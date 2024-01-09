from django.apps import AppConfig


class ClientsConfig(AppConfig):
    name = "agir.clients"
    verbose_name = "Clientes"

    def ready(self):
        from . import signals
