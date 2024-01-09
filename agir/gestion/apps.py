from django.apps import AppConfig


class GestionConfig(AppConfig):
    name = "agir.gestion"
    verbose_name = "gestión y cuentas"

    def ready(self):
        from . import signals
