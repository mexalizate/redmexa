import datetime

from nuntius.models import CampaignSentEvent

from agir.events.models import Event
from agir.groups.models import SupportGroup, Membership
from agir.people.models import Person


def get_absolute_statistics(date=None, as_kwargs=False, columns=None):
    if date is None:
        date = datetime.date.today() - datetime.timedelta(days=1)

    querysets = {
        # EVENTS
        "event_count": Event.objects.public()
        .listed()
        .filter(start_time__date__lte=date),
        # GROUPS
        "local_supportgroup_count": (
            SupportGroup.objects.active()
            .filter(type=SupportGroup.TYPE_LOCAL_GROUP)
            .filter(created__date__lte=date)
        ),
        "local_certified_supportgroup_count": (
            SupportGroup.objects.active()
            .filter(type=SupportGroup.TYPE_LOCAL_GROUP)
            .certified()
            .filter(certification_date__date__lte=date)
        ),
        "membership_person_count": (
            Membership.objects.active()
            .filter(created__date__lte=date)
            .filter(supportgroup__type=SupportGroup.TYPE_LOCAL_GROUP)
            .distinct("person_id")
            .order_by("person_id")
        ),
        "boucle_departementale_membership_person_count": (
            Membership.objects.active()
            .filter(created__date__lte=date)
            .filter(supportgroup__type=SupportGroup.TYPE_BOUCLE_DEPARTEMENTALE)
            .distinct("person_id")
            .order_by("person_id")
        ),
        # PEOPLE
        "political_support_person_count": Person.objects.exclude(role__is_active=False)
        .is_political_support()
        .filter(created__date__lte=date),
        "liaison_count": (
            Person.objects.exclude(role__is_active=False)
            .liaisons()
            .filter(liaison_date__date__lte=date)
        ),
        "lfi_newsletter_subscriber_count": (
            Person.objects.exclude(role__is_active=False)
            .filter(newsletters__contains=(Person.Newsletter.LFI_REGULIERE,))
            .filter(created__date__lte=date)
        ),
        # MAILING
        "sent_campaign_count": CampaignSentEvent.objects.filter(
            datetime__date__lte=date
        )
        .distinct("campaign_id")
        .order_by("campaign_id"),
        "sent_campaign_email_count": CampaignSentEvent.objects.filter(
            datetime__date__lte=date
        ),
    }

    if columns:
        querysets = {key: qs for key, qs in querysets.items() if key in columns}

    if not querysets:
        return querysets

    if as_kwargs:
        querysets = {key: qs.count() for key, qs in querysets.items()}
        querysets["date"] = date

    return querysets
