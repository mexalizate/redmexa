from agir.event_requests import models
from agir.events.models import Event
from agir.lib.celery import emailing_task, post_save_task
from agir.lib.mailing import send_template_email
from agir.lib.utils import front_url
from agir.people.models import Person


@post_save_task()
def render_event_assets(event_pk):
    event = Event.objects.get(pk=event_pk)
    for event_asset in event.event_assets.renderable():
        event_asset.render()


@emailing_task()
def send_new_event_speaker_request_notification(speaker_pk):
    speaker = (
        models.EventSpeaker.objects.select_related("person")
        .with_serializer_prefetch()
        .filter(pk=speaker_pk)
        .first()
    )

    if speaker is None:
        return

    # Make sure the speaker's person has a role, for the magic link to work
    speaker.person.ensure_role_exists()

    event_theme_type = (
        speaker.event_speaker_requests.order_by("-created")
        .first()
        .event_request.event_theme.event_theme_type
    )
    email_bindings = event_theme_type.get_event_speaker_request_email_bindings()
    send_template_email(
        from_email=email_bindings.get("email_from"),
        template_name="event_speaker/new_event_speaker_request_email.html",
        bindings={
            **email_bindings,
            "event_speaker_page_url": front_url("event_speaker", absolute=True),
            "event_speaker_themes": [
                f"{theme} ({theme.event_theme_type})"
                for theme in speaker.event_themes.all().order_by("event_theme_type_id")
            ],
        },
        recipients=[speaker.person],
    )


@emailing_task(post_save=True)
def send_new_publish_event_asset_notification(event_pk):
    event = Event.objects.get(pk=event_pk)
    organizers = event.get_organizer_people()
    send_template_email(
        template_name="event_asset/asset_published_email.html",
        bindings={
            "event": event,
            "event_asset_page_link": front_url(
                "view_event_settings_assets", auto_login=True, kwargs={"pk": event.pk}
            ),
        },
        recipients=organizers,
    )


@emailing_task(post_save=True)
def send_event_request_validation_emails(event_request_pk):
    event_request = (
        models.EventRequest.objects.select_related(
            "event",
            "event_theme",
            "event_theme__event_theme_type",
        )
        .prefetch_related("event__event_speakers", "event__event_speakers__person")
        .get(pk=event_request_pk)
    )

    event = event_request.event
    event_speakers = list(event.event_speakers.all().select_related("person"))
    organizers = event.organizer_configs.select_related("person", "as_group")

    theme_email_bindings = (
        event_request.event_theme.get_event_creation_emails_bindings()
    )

    if theme_email_bindings.get("speaker"):
        bindings = theme_email_bindings.get("speaker")
        send_template_email(
            from_email=bindings.get("email_from"),
            template_name="event_request/validation_email.html",
            bindings={
                **bindings,
                "event": event,
                "event_page_link": front_url(
                    "view_event", auto_login=True, kwargs={"pk": event.pk}
                ),
                "organizer": organizers.first(),
            },
            recipients=[event_speaker.person for event_speaker in event_speakers],
        )

    if theme_email_bindings.get("organizer"):
        bindings = theme_email_bindings.get("organizer")
        send_template_email(
            from_email=bindings.get("email_from"),
            template_name="event_request/validation_email.html",
            bindings={
                **bindings,
                "event": event,
                "event_page_link": front_url(
                    "view_event", auto_login=True, kwargs={"pk": event.pk}
                ),
                "speakers": event_speakers,
            },
            recipients=[o.person for o in organizers],
        )

    if theme_email_bindings.get("notification"):
        bindings = theme_email_bindings.get("notification")
        send_template_email(
            from_email=bindings.get("email_from"),
            template_name="event_request/validation_email.html",
            bindings={
                **bindings,
                "event": event,
                "event_page_link": front_url(
                    "view_event", auto_login=False, kwargs={"pk": event.pk}
                ),
                "organizer": organizers.first(),
                "speakers": event_speakers,
            },
            recipients=(bindings.get("email_to"),),
        )

    if theme_email_bindings.get("unretained_speakers"):
        bindings = theme_email_bindings.get("unretained_speakers")
        recipients = Person.objects.filter(
            id__in=event_request.event_speaker_requests.unretained()
            .exclude(event_speaker__in=event_speakers)
            .select_related("event_speaker__person_id")
            .values_list("event_speaker__person_id", flat=True)
        )
        send_template_email(
            from_email=bindings.get("email_from"),
            template_name="event_request/validation_email.html",
            bindings={
                **bindings,
                "event": event,
                "event_page_link": front_url(
                    "view_event", auto_login=True, kwargs={"pk": event.pk}
                ),
            },
            recipients=recipients,
        )
