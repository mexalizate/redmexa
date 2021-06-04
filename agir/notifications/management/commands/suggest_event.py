from django.contrib.gis.db.models.functions import Distance
from django.core.management.base import BaseCommand
from django.utils import timezone
from tqdm import tqdm

from agir.events.actions.notifications import new_event_suggestion_notification
from agir.lib.management_utils import segment_argument
from agir.people.models import Person
from agir.events.models import Event


class Command(BaseCommand):
    SUGGEST_LIMIT_METERS = 50000

    help = "suggest an event to each user"

    def add_arguments(self, parser):
        parser.add_argument("-S", "--segment", type=segment_argument)

    def handle(self, segment, limit=SUGGEST_LIMIT_METERS, *args, **options):

        if segment:
            person_queryset = segment.get_subscribers_queryset()
        else:
            person_queryset = Person.all()
        for person in tqdm(
            person_queryset.exclude(coordinates=None).filter(role__is_active=True)
        ):
            base_queryset = (
                Event.objects.with_serializer_prefetch(person)
                .listed()
                .upcoming()
                .exclude(coordinates=None)
            )
            if person.is_2022:
                base_queryset = base_queryset.is_2022()

            near_event = (
                base_queryset.annotate(
                    distance=Distance("coordinates", person.coordinates)
                )
                .filter(distance__lte=limit)
                .filter(start_time__lt=timezone.now() + timezone.timedelta(days=7))
                .exclude(organizer_configs__as_group__members=person)
                .exclude(attendees=person)
                .distinct()
                .order_by("distance")
                .first()
            )

            if near_event is not None:
                new_event_suggestion_notification(near_event, person)