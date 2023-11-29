from django.apps import AppConfig


class AuthenticationConfig(AppConfig):
    name = "agir.authentication"
    # verbose_name = "Autenticación"

    def ready(self):
        from . import signals
