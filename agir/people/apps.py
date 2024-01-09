from django.apps import AppConfig


class PeopleConfig(AppConfig):
    name = "agir.people"
    verbose_name = "Personas"

    def ready(self):
        from . import signals
