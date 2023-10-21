from dataclasses import dataclass
from functools import partial

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from agir.authentication.tokens import subscription_confirmation_token_generator
from agir.groups.models import Membership
from agir.lib.http import add_query_params_to_url
from agir.people.models import Person


def make_subscription_token(email, **kwargs):
    return subscription_confirmation_token_generator.make_token(email=email, **kwargs)


@dataclass
class SubscriptionMessageInfo:
    code: str
    subject: str
    from_email: str = settings.EMAIL_FROM


# The folllowing parameters will defined subscription profile and associated workflow
SUBSCRIPTION_TYPE_PLATFORM = "PLA"
SUBSCRIPTION_TYPE_CAMPAIGN = "CAM"
SUBSCRIPTION_TYPE_ACTIVIST = "ACT"
SUBSCRIPTION_TYPE_EXTERNAL = "EXT"
SUBSCRIPTION_TYPE_ADMIN = "ADM"

# Here we set the type of subscription profile that will define the subscription flow for the user
# This values will also be used as key, to store subscription metadata to the person "meta" field
SUBSCRIPTION_TYPE_CHOICES = (
    (SUBSCRIPTION_TYPE_PLATFORM, "Platform"),
    (SUBSCRIPTION_TYPE_CAMPAIGN, "Campaign"),
    (SUBSCRIPTION_TYPE_ACTIVIST, "Activist"),
    (SUBSCRIPTION_TYPE_EXTERNAL, "Externe"),
    (SUBSCRIPTION_TYPE_ADMIN, "Admin"),
)
# Here we set a default origin (website or app) for a profile in case the subscription payload data will not define one.
SUBSCRIPTION_DEFAULT_ORIGIN = {
    SUBSCRIPTION_TYPE_PLATFORM: "redmexa.com",
    SUBSCRIPTION_TYPE_CAMPAIGN: "claudializate.com",
    SUBSCRIPTION_TYPE_ACTIVIST: "redmigrantes.com",
}
# Here we set the specificications for the emails to be sent to the new user for each profile workflow
#
# Three emails can be configured:
# - "already_subscribed": the message sent to someone trying to subscribe and who already has an account
# - "confirmation": the message sent to ask the new user to confirm his/her email address
# - "welcome": the message sent once the email address has been validated and the subscription successfully completed
#
# For each email, we can specify the email template code, subject and from address
SUBSCRIPTIONS_EMAILS = {
    SUBSCRIPTION_TYPE_PLATFORM: {
        "already_subscribed": SubscriptionMessageInfo(
            code="SUBSCRIPTION__PLATFORM__ALREADY_SUBSCRIBED_MESSAGE",
            subject="Vous êtes déjà inscrit·e !",
        ),
        "confirmation": SubscriptionMessageInfo(
            code="SUBSCRIPTION__PLATFORM__CONFIRMATION_MESSAGE",
            subject="Plus qu'un clic pour vous inscrire",
        ),
    },
    SUBSCRIPTION_TYPE_CAMPAIGN: {
        "already_subscribed": SubscriptionMessageInfo(
            "SUBSCRIPTION__CAMPAIGN__ALREADY_SUBSCRIBED_MESSAGE",
            "Vous êtes déjà inscrit·e !",
        ),
        "confirmation": SubscriptionMessageInfo(
            code="SUBSCRIPTION__CAMPAIGN__CONFIRMATION_MESSAGE",
            subject="Plus qu'un clic pour vous inscrire",
            from_email=settings.EMAIL_FROM_LFI,
        ),
        "welcome": SubscriptionMessageInfo(
            "SUBSCRIPTION__CAMPAIGN__WELCOME_MESSAGE",
            "Bienvenue sur la plateforme de la France insoumise",
        ),
    },
    SUBSCRIPTION_TYPE_ACTIVIST: {
        "confirmation": SubscriptionMessageInfo(
            code="SUBSCRIPTION__ACTIVIST__CONFIRMATION_MESSAGE",
            subject="Confirmez votre e-mail pour valider votre signature !",
            from_email=settings.EMAIL_FROM_MELENCHON_2022,
        )
    },
    SUBSCRIPTION_TYPE_EXTERNAL: {},
    SUBSCRIPTION_TYPE_ADMIN: {},
}
# Here we set the URL of the page to which the user will be redirected right after entering his/her data
# This page should warn the user that he/she will receive an email to validate his/her email address
SUBSCRIPTION_EMAIL_SENT_REDIRECT = {
    SUBSCRIPTION_TYPE_CAMPAIGN: f"{settings.CAMPAIGN_DOMAIN}/consulter-vos-emails/",
    SUBSCRIPTION_TYPE_ACTIVIST: f"{settings.ACTIVIST_DOMAIN}/validez-votre-e-mail/",
    SUBSCRIPTION_TYPE_PLATFORM: f"{settings.PLATFORM_FRONT_DOMAIN}/inscription/code/",
}
# Here we set the URL of the page to which the user will be redirected right after validating his/her email address
# by following the validation link received by email.
SUBSCRIPTION_SUCCESS_REDIRECT = {
    SUBSCRIPTION_TYPE_CAMPAIGN: f"{settings.CAMPAIGN_DOMAIN}/bienvenue/",
    SUBSCRIPTION_TYPE_ACTIVIST: f"{settings.ACTIVIST_DOMAIN}/signature-confirmee/",
    SUBSCRIPTION_TYPE_PLATFORM: f"{settings.PLATFORM_FRONT_DOMAIN}/bienvenue/",
}
# Here we set the newsletters choices that will automatically be activated for the new user upon
# subscription based on profile (from Person.Newsletter choices)
SUBSCRIPTION_NEWSLETTERS = {
    SUBSCRIPTION_TYPE_PLATFORM: set(),
    SUBSCRIPTION_TYPE_CAMPAIGN: {Person.Newsletter.CAMPAIGN},
    SUBSCRIPTION_TYPE_ACTIVIST: {Person.Newsletter.ACTIVIST},
    SUBSCRIPTION_TYPE_ADMIN: set(),
    SUBSCRIPTION_TYPE_EXTERNAL: set(),
}


def save_subscription_information(person, type, data, new=False):
    person_fields = set(f.name for f in Person._meta.get_fields())

    # mise à jour des différents champs
    for f in person_fields.intersection(data):
        # Si la personne n'est pas nouvelle on ne remplace que les champs vides
        setattr(person, f, data[f] if new else getattr(person, f) or data[f])

    person.newsletters = list(SUBSCRIPTION_NEWSLETTERS[type].union(person.newsletters))

    subscriptions = person.meta.setdefault("subscriptions", {})

    if type not in subscriptions:
        # Save subscription date and origin
        date = timezone.now().isoformat()
        default_source = SUBSCRIPTION_DEFAULT_ORIGIN.get(type, None)
        origin = data.get("origin", default_source)
        subscriptions[type] = {"date": date, "origin": origin}

        if referrer_id := data.get("referrer", data.get("referer")):
            try:
                referrer = Person.objects.get(referrer_id=referrer_id)
            except Person.DoesNotExist:
                pass
            else:
                subscriptions[type]["referrer"] = str(referrer.pk)

                # l'import se fait ici pour éviter les imports circulaires
                from ..tasks import notify_referrer

                transaction.on_commit(
                    partial(
                        notify_referrer.delay,
                        referrer_id=str(referrer.id),
                        referred_id=str(person.id),
                        referral_type=type,
                    )
                )

    # Save subscription metadata
    if data.get("metadata"):
        subscriptions[type].setdefault("metadata", {}).update(data["metadata"])

    person.save()


def subscription_success_redirect_url(type, id, data):
    params = {"agir_id": str(id)}
    url = SUBSCRIPTION_SUCCESS_REDIRECT[type]
    if data.get("next", None):
        url = data.pop("next")
    params.update({f"agir_{k}": v for k, v in data.items()})
    return add_query_params_to_url(url, params, as_fragment=True)


CONTACT_PERSON_UPDATABLE_FIELDS = (
    "contact_phone",
    "location_address1",
    "location_zip",
    "location_city",
    "location_country",
    "newsletters",
)
LIAISON_SINCE_META_PROPERTY = "liaison_since"


def save_contact_information(data):
    group = None
    has_group_notifications = data.pop("hasGroupNotifications")

    if "group" in data:
        group = data.pop("group")

    with transaction.atomic():
        try:
            if data.get("email"):
                person = Person.objects.get_by_natural_key(data["email"])
            else:
                # If no email address has been sent, check if the given phone number
                # relates to a unique Person instance (create a new person otherwise)
                person = Person.objects.get(contact_phone=data.get("contact_phone"))
            # If a person exists for this email or phone number, update some of the person's fields
            is_new = False
            person_patch = {
                key: value
                for key, value in data.items()
                if key in CONTACT_PERSON_UPDATABLE_FIELDS and not getattr(person, key)
            }
            if "newsletters" in data and person.newsletters:
                person_patch["newsletters"] = list(
                    set(data["newsletters"] + person.newsletters)
                )
            for key, value in person_patch.items():
                setattr(person, key, value)

            person.save()
        except (Person.DoesNotExist, Person.MultipleObjectsReturned):
            # Create a new person if none exists for the email
            data["meta"] = {
                "subscriptions": {
                    SUBSCRIPTION_TYPE_PLATFORM: {
                        "date": timezone.now().isoformat(),
                        "subscriber": str(data.pop("subscriber").id),
                    }
                }
            }
            person = Person.objects.create_person(data.pop("email", ""), **data)
            is_new = True

        if person.is_liaison and not person.meta.get(LIAISON_SINCE_META_PROPERTY, None):
            person.meta[LIAISON_SINCE_META_PROPERTY] = timezone.now().isoformat(
                timespec="seconds"
            )
            person.save()

        from agir.people.tasks import notify_contact

        transaction.on_commit(
            partial(notify_contact.delay, str(person.id), is_new=is_new)
        )

    if group:
        # Create a follower type membership for the person if none exists already and
        # a group id has been sent
        Membership.objects.get_or_create(
            supportgroup=group,
            person=person,
            defaults={
                "membership_type": Membership.MEMBERSHIP_TYPE_FOLLOWER,
                "personal_information_sharing_consent": True,
                "default_subscriptions_enabled": has_group_notifications,
            },
        )

    return person
