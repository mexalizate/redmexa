from django.db.models import (
    Prefetch,
    Q,
    Subquery,
    OuterRef,
    Case,
    When,
    Value,
    IntegerField,
)
from django.utils import timezone

from .models import Activity, Announcement
from ..events.models import Event
from agir.notifications.types import SubscriptionType


def get_activities(person):
    activities = (
        Activity.objects.displayed()
        .filter(recipient=person)
        .filter(
            ~Q(type=SubscriptionType.TYPE_ANNOUNCEMENT)
            | Q(
                type=SubscriptionType.TYPE_ANNOUNCEMENT,
                announcement__custom_display__exact="",
            )
        )
        .select_related("supportgroup", "individual", "announcement")
        .prefetch_related(
            Prefetch(
                "event",
                Event.objects.with_serializer_prefetch(person).select_related(
                    "subtype"
                ),
            )
        )
        .filter(recipient=person)
        .exclude(supportgroup__isnull=False, supportgroup__published=False)
        .exclude(~Q(event__visibility=Event.VISIBILITY_PUBLIC), event__isnull=False)
        .filter(
            ~Q(type=Activity.TYPE_ANNOUNCEMENT)
            | Q(type=Activity.TYPE_ANNOUNCEMENT, announcement__custom_display__exact="")
        )
        .distinct()
        # Always display undisplayed announcement activities first
        .annotate(
            sort=Case(
                When(
                    type=SubscriptionType.TYPE_ANNOUNCEMENT,
                    status=Activity.STATUS_UNDISPLAYED,
                    then=0,
                ),
                default=1,
                output_field=IntegerField(),
            )
        )
        .order_by("sort", "-timestamp")
    )

    return activities


def get_announcements(person=None):
    today = timezone.now()
    cond = Q(start_date__lt=today) & (Q(end_date__isnull=True) | Q(end_date__gt=today))

    # Les annonces sont affichés :
    # - avec les plus grandes priorités d'abord
    # - à priorité égale, les plus récentes d'abord
    # - à priorité et date de début égales, celles qui disparaitront les premières d'abord
    announcements = (
        Announcement.objects.filter(cond)
        .select_related("segment")
        .order_by("-priority", "-start_date", "end_date")
    )

    if person:
        announcements = (
            announcements.filter(
                pk__in=[
                    a.pk
                    for a in announcements
                    if a.segment is None
                    or a.segment.get_subscribers_queryset()
                    .filter(pk=person.id)
                    .exists()
                ]
            )
            .annotate(
                activity_id=Subquery(
                    Activity.objects.filter(
                        recipient=person, announcement_id=OuterRef("id")
                    ).values("id")[:1]
                ),
            )
            .distinct()
        )
        # Automatically create an activity for the person if none exists for the announcement
        Activity.objects.bulk_create(
            [
                Activity(
                    type=SubscriptionType.TYPE_ANNOUNCEMENT,
                    recipient=person,
                    announcement=announcement,
                )
                for announcement in announcements
                if announcement.activity_id is None
            ],
            ignore_conflicts=True,
        )

        return announcements
    else:
        return announcements.filter(segment__isnull=True)


def get_non_custom_announcements(person=None):
    return get_announcements(person).filter(custom_display__exact="")


def get_custom_announcements(person, custom_display):
    # Avoid calling get_announcement if an activity already exists for
    # the person and the announcement
    if person and custom_display:
        today = timezone.now()
        activity = (
            Activity.objects.filter(
                type=Activity.TYPE_ANNOUNCEMENT,
                recipient=person,
                announcement__custom_display__exact=custom_display,
            )
            .filter(
                Q(announcement__start_date__lt=today)
                & (
                    Q(announcement__end_date__isnull=True)
                    | Q(announcement__end_date__gt=today)
                )
            )
            .only("id", "announcement_id")
            .first()
        )
        if activity:
            return Announcement.objects.filter(pk=activity.announcement_id,).annotate(
                activity_id=Value(activity.id, IntegerField())
            )

    return (
        get_announcements(person)
        .exclude(custom_display__exact="")
        .order_by("custom_display", "-priority", "-start_date", "end_date")
        .distinct("custom_display")
    )
