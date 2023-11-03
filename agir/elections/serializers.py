from data_france.models import (
    Commune,
    CirconscriptionConsulaire,
    CirconscriptionLegislative,
)
from django_countries.serializer_fields import CountryField
from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.utils.translation import gettext as _

from agir.elections.actions import create_or_update_polling_station_officer
from agir.elections.models import PollingStationOfficer


class VotingCommuneOrConsulateSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    type = serializers.SerializerMethodField()
    value = serializers.IntegerField(read_only=True, source="id")
    label = serializers.SerializerMethodField(read_only=True)
    departement = serializers.SerializerMethodField(read_only=True)
    countries = serializers.SerializerMethodField(read_only=True)

    def get_label(self, instance):
        if isinstance(instance, Commune):
            return f"{instance.code_departement} - {instance.nom_complet}"
        if isinstance(instance, CirconscriptionConsulaire):
            return str(instance)

    def get_type(self, instance):
        if isinstance(instance, Commune):
            return "commune"
        if isinstance(instance, CirconscriptionConsulaire):
            return "consulate"

    def get_departement(self, instance):
        if not isinstance(instance, Commune):
            return None

        return instance.code_departement

    def get_countries(self, instance):
        if isinstance(instance, Commune):
            return None

        return [country.code for country in instance.pays] if instance.pays else None


class CreateUpdatePollingStationOfficerSerializer(serializers.ModelSerializer):
    person = serializers.UUIDField(read_only=True, source="person_id")

    firstName = serializers.CharField(
        required=True, source="first_name", label=_("Prénom")
    )
    lastName = serializers.CharField(
        required=True, source="last_name", label=_("Nom de famille")
    )
    birthName = serializers.CharField(
        required=False, allow_blank=True, source="birth_name", label=_("Nom de naissance")
    )
    birthDate = serializers.DateField(
        required=True, source="birth_date", label=_("Date de naissance")
    )
    birthCity = serializers.CharField(
        required=True, source="birth_city", label=_("Ville de naissance")
    )
    birthCountry = CountryField(
        required=True, source="birth_country", label=_("Pays de naissance")
    )

    address1 = serializers.CharField(
        required=True, source="location_address1", label=_("Adresse")
    )
    address2 = serializers.CharField(
        required=False,
        allow_blank=True,
        source="location_address2",
        label=_("Complément d'adresse"),
    )
    zip = serializers.CharField(
        required=True, source="location_zip", label=_("Code postal")
    )
    city = serializers.CharField(required=True, source="location_city", label=_("Ville"))
    country = CountryField(required=True, source="location_country", label=_("Pays"))

    votingCirconscriptionLegislative = serializers.SlugRelatedField(
        required=True,
        allow_null=False,
        source="voting_circonscription_legislative",
        label=_("Circonscription législative"),
        queryset=CirconscriptionLegislative.objects.all(),
        slug_field="code",
    )
    votingLocation = serializers.SerializerMethodField(
        read_only=True, method_name="get_voting_location"
    )
    votingCommune = serializers.PrimaryKeyRelatedField(
        required=False,
        allow_null=True,
        source="voting_commune",
        label=_("Commune"),
        queryset=Commune.objects.filter(
            type__in=(Commune.TYPE_COMMUNE, Commune.TYPE_ARRONDISSEMENT_PLM),
        ).exclude(code__in=("75056", "69123", "13055")),
    )
    votingConsulate = serializers.PrimaryKeyRelatedField(
        required=False,
        allow_null=True,
        source="voting_consulate",
        label=_("Circonscription consulaire"),
        queryset=CirconscriptionConsulaire.objects.all(),
    )
    pollingStation = serializers.CharField(
        required=True,
        source="polling_station",
        label=_("bureau de vote"),
    )
    voterId = serializers.CharField(
        required=True,
        source="voter_id",
        label=_("Numéro national d'électeur"),
    )

    hasMobility = serializers.BooleanField(
        source="has_mobility", label=_("Mobilité"), default=False
    )
    availableVotingDates = serializers.MultipleChoiceField(
        source="available_voting_dates",
        required=True,
        allow_empty=False,
        choices=[
            (str(date), label)
            for date, label in PollingStationOfficer.VOTING_DATE_CHOICES
        ],
        label=_("Dates de disponibilité"),
    )

    email = serializers.EmailField(
        required=True, source="contact_email", label=_("Adresse e-mail")
    )
    phone = PhoneNumberField(
        required=True, source="contact_phone", label=_("Numéro de téléphone")
    )

    updated = serializers.BooleanField(
        default=False,
        read_only=True,
    )

    def get_voting_location(self, instance):
        location = None
        if isinstance(instance, dict):
            location = (
                instance.get("voting_comune")
                if instance.get("voting_comune", None) is not None
                else instance.get("voting_consulate", None)
            )
        if isinstance(instance, PollingStationOfficer):
            location = (
                instance.voting_commune
                if instance.voting_commune is not None
                else instance.voting_consulate
            )
        if location is not None:
            location = VotingCommuneOrConsulateSerializer(location).data
        return location

    def validate_required_commune_or_consulate(self, attrs):
        commune = attrs.get("voting_commune", None)
        consulate = attrs.get("voting_consulate", None)

        if commune is None and consulate is None:
            raise ValidationError(
                {
                    "votingCommune": _("Au moins une commune ou une circonscription consulaire doit être sélectionnée"),
                    "votingConsulate": _("Au moins une commune ou une circonscription consulaire doit être sélectionnée"),
                },
                code="invalid_missing_commune_and_consulate",
            )

        if commune is not None and consulate is not None:
            raise ValidationError(
                {
                    "votingCommune": _("Une commune et une circonscription consulaire ne peuvent pas être sélectionnées en "
                    "même temps"),
                    "votingConsulate": _("Une commune et une circonscription consulaire ne peuvent pas être sélectionnées en "
                    "même temps"),
                },
                code="invalid_commune_and_consulate",
            )

    def validate_circonscription_legislative(self, attrs):
        circo = attrs.get("voting_circonscription_legislative", None)

        consulate = attrs.get("voting_consulate", None)
        if consulate is not None and circo.departement_id is not None:
            raise ValidationError(
                {
                    "votingConsulate": _("La circonscription consulaire ne fait pas partie de la circonscription législative indiquée"),
                },
                code="consulate_and_circonscription_legislative_mismatch",
            )

        commune = attrs.get("voting_commune", None)
        if commune is not None:
            commune_departement_id = (
                commune.commune_parent.departement_id
                if commune.commune_parent_id
                else commune.departement_id
            )
            if commune_departement_id != circo.departement_id:
                raise ValidationError(
                    {
                        "votingCommune": _("La commune ne fait pas partie de la circonscription législative indiquée"),
                    },
                    code="commune_and_circonscription_legislative_mismatch",
                )

    def validate(self, attrs):
        super().validate(attrs)
        self.validate_required_commune_or_consulate(attrs)
        self.validate_circonscription_legislative(attrs)

        return attrs

    def create(self, validated_data):
        return create_or_update_polling_station_officer(validated_data)

    class Meta:
        model = PollingStationOfficer
        fields = (
            "id",
            "person",
            "firstName",
            "lastName",
            "birthName",
            "gender",
            "birthDate",
            "birthCity",
            "birthCountry",
            "address1",
            "address2",
            "zip",
            "city",
            "country",
            "votingCirconscriptionLegislative",
            "votingLocation",
            "votingCommune",
            "votingConsulate",
            "pollingStation",
            "voterId",
            "role",
            "hasMobility",
            "availableVotingDates",
            "email",
            "phone",
            "remarks",
            "updated",
        )
