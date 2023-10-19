from django.contrib.gis.db import models
from django.utils.translation import gettext_lazy as _


class MexicanState(models.Model):
    code = models.CharField(
        verbose_name=_("Code"), max_length=2, editable=False, unique=True
    )
    name = models.CharField(verbose_name=_("Name"), max_length=70, editable=False)
    geometry = models.MultiPolygonField(
        verbose_name=_("Geometry"), geography=True, srid=4326  # WGS84, GPS coordinates
    )

    def __str__(self):
        return f"State of {self.name} ({self.code})"

    class Meta:
        verbose_name = _("Mexican State")
        ordering = ("code",)


class MexicanMunicipio(models.Model):
    class Type(models.TextChoices):
        MUNICIPIO = "M", _("Municipio")
        DEMARCACION = "D", _("Demarcacíon territorial")

    code = models.CharField(
        verbose_name=_("Code"), max_length=5, editable=False, unique=True
    )
    name = models.CharField(verbose_name=_("Name"), max_length=100, editable=False)
    type = models.CharField(
        verbose_name=_("Type"), max_length=1, editable=False, choices=Type.choices
    )

    state = models.ForeignKey(
        to=MexicanState,
        on_delete=models.PROTECT,
        verbose_name=_("State"),
    )

    geometry = models.MultiPolygonField(
        verbose_name=_("Geometry"), geography=True, srid=4326  # WGS84, GPS coordinates
    )

    def __str__(self):
        return f"{self.name} ({self.code})"

    class Meta:
        verbose_name = _("Mexican Municipio")
        ordering = ("code",)
