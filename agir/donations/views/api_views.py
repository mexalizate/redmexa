import json

from django.db import transaction
from django.urls import reverse
from rest_framework import permissions
from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework.mixins import UpdateModelMixin
from rest_framework.response import Response

from agir.donations.allocations import create_monthly_donation
from agir.donations.apps import DonsConfig
from agir.donations.serializers import (
    CreateDonationSessionSerializer,
    SendDonationSerializer,
    TO_2022,
    TYPE_MONTHLY,
)
from agir.donations.tasks import send_monthly_donation_confirmation_email
from agir.donations.views import DONATION_SESSION_NAMESPACE
from agir.payments.actions.payments import create_payment
from agir.payments.models import Subscription
from agir.people.models import Person
from agir.presidentielle2022.apps import Presidentielle2022Config


# 1st step : Fill session with donation infos
class CreateSessionDonationAPIView(CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = CreateDonationSessionSerializer
    queryset = Person.objects.none()


# 2nd step : Create and send donation with personal infos
class SendDonationAPIView(UpdateModelMixin, GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = SendDonationSerializer

    def get_object(self):
        if self.request.user.is_authenticated:
            return self.request.user.person

    def clear_session(self):
        del self.request.session[DONATION_SESSION_NAMESPACE]

    # Create person with only its model fields in validated_data
    def create_person(self, validated_data):
        clean_data = {}
        for attr, value in validated_data.items():
            if getattr(Person, attr, False):
                clean_data[attr] = value
        person = Person.objects.create(**clean_data)
        person.save()
        return person

    def monthly_payment(self, allocations):
        validated_data = self.validated_data
        payment_mode = validated_data["payment_mode"]
        amount = validated_data["amount"]

        if validated_data["to"] == TO_2022:
            payment_type = Presidentielle2022Config.DONATION_SUBSCRIPTION_TYPE
        else:
            payment_type = DonsConfig.SUBSCRIPTION_TYPE

        # Confirm email if the user is unknown
        if self.person is None:
            email = validated_data.pop("email", None)

            if not "allocations" in validated_data:
                validated_data["allocations"] = "[]"

            confirmation_view_name = "monthly_donation_confirm"
            if validated_data["to"] == TO_2022:
                confirmation_view_name = "monthly_donation_2022_confirm"

            send_monthly_donation_confirmation_email.delay(
                confirmation_view_name=confirmation_view_name,
                email=email,
                subscription_total=amount,
                **validated_data,
            )
            self.clear_session()
            return Response(
                {"next": reverse("monthly_donation_confirmation_email_sent")}
            )

        # Redirect if user already monthly donator
        if Subscription.objects.filter(
            person=self.person, status=Subscription.STATUS_ACTIVE, mode=payment_mode,
        ):
            # stocker toutes les infos en session
            # attention à ne pas juste modifier le dictionnaire existant,
            # parce que la session ne se "rendrait pas compte" qu'elle a changé
            # et cela ne serait donc pas persisté
            self.request.session[DONATION_SESSION_NAMESPACE] = {
                "new_subscription": {
                    "type": payment_type,
                    "mode": payment_mode,
                    "subscription_total": amount,
                    "meta": validated_data,
                },
                **self.request.session.get(DONATION_SESSION_NAMESPACE, {}),
            }
            return Response({"next": reverse("already_has_subscription")})

        with transaction.atomic():
            subscription = create_monthly_donation(
                person=self.person,
                mode=payment_mode,
                subscription_total=amount,
                allocations=allocations,
                meta=validated_data,
                type=payment_type,
            )

        self.clear_session()
        return Response({"next": reverse("subscription_page", args=[subscription.pk])})

    def post(self, request, *args, **kwargs):

        self.person = self.get_object()
        serializer = self.get_serializer(self.person, data=request.data)
        serializer.is_valid(raise_exception=True)

        self.validated_data = serializer.validated_data
        validated_data = self.validated_data
        amount = validated_data["amount"]
        payment_mode = validated_data["payment_mode"]

        # User exist and connected : update user informations
        if self.person is not None:
            self.perform_update(serializer)

        allocations = {
            str(allocation["group"].id): allocation["amount"]
            for allocation in validated_data.get("allocations", [])
        }

        if "allocations" in validated_data:
            validated_data["allocations"] = json.dumps(allocations)

        # Monthly payments
        if validated_data["payment_times"] == TYPE_MONTHLY:
            return self.monthly_payment(allocations)

        # Direct payments
        payment_type = DonsConfig.PAYMENT_TYPE
        if validated_data["to"] == TO_2022:
            payment_type = Presidentielle2022Config.DONATION_PAYMENT_TYPE

        if self.person is None:
            self.person = self.create_person(validated_data)

        with transaction.atomic():
            payment = create_payment(
                person=self.person,
                type=payment_type,
                mode=payment_mode,
                price=amount,
                meta=validated_data,
                **kwargs,
            )

        self.clear_session()
        return Response({"next": payment.get_payment_url()})
