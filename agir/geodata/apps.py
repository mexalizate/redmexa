from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class GeoDataConfig(AppConfig):
    name = "agir.geodata"
    verbose_name = _("GeoData")
