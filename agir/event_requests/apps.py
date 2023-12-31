from django.apps import AppConfig


class EventRequestConfig(AppConfig):
    name = "agir.event_requests"
    verbose_name = "Demandes d'événement"

    def ready(self):
        import agir.event_requests.signals
