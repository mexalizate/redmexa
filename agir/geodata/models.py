from django.contrib.gis.db import models
from django.contrib.postgres.indexes import GinIndex
from django.contrib.postgres.search import SearchVectorField, SearchRank
from django.utils.translation import gettext_lazy as _

from agir.lib.search import PrefixSearchQuery


class SearchQueryset(models.QuerySet):
    def search(self, terms: str):
        """Do a full text search in the queryset

        :param terms: research terms
        :return: original queryset, filtered and sorted according to relevance
        """
        query = PrefixSearchQuery(terms, config="places")

        return (
            self.filter(search=query)
            .annotate(rank=SearchRank(models.F("search"), query, normalization=8))
            .order_by("-rank")
        )


class MexicanState(models.Model):
    code = models.CharField(
        verbose_name=_("Code"), max_length=2, editable=False, unique=True
    )
    name = models.CharField(verbose_name=_("Name"), max_length=70, editable=False)
    geometry = models.MultiPolygonField(
        verbose_name=_("Geometry"), geography=True, srid=4326  # WGS84, GPS coordinates
    )

    def __str__(self):
        return _("State of {name} ({code})").format(name=self.name, code=self.code)

    class Meta:
        verbose_name = _("Mexican State")
        ordering = ("code",)


class MexicanMunicipio(models.Model):
    class Type(models.TextChoices):
        MUNICIPIO = "M", _("Municipio")
        DEMARCACION = "D", _("Demarcacíon territorial")

    objects = SearchQueryset.as_manager()

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
        related_name="municipios",
        related_query_name="municipio",
    )

    geometry = models.MultiPolygonField(
        verbose_name=_("Geometry"),
        geography=True,
        srid=4326,  # WGS84, GPS coordinates
        spatial_index=True,
    )

    search = SearchVectorField(null=True)

    def __str__(self):
        return f"{self.name} ({self.state.name})"

    class Meta:
        verbose_name = _("Mexican Municipio")
        ordering = ("code",)
        indexes = (GinIndex(fields=["search"]),)


class USState(models.Model):
    class Type(models.TextChoices):
        STATE = "S", _("State")
        OUTLYING = "O", _("outlying area")

    code = models.CharField(
        verbose_name=_("ANSI code"),
        help_text=_(
            "Two-digits code that uniquely identify a state or territory of the US, as standardized by ANSI"
        ),
        max_length=2,
        editable=False,
        unique=True,
    )

    code_usps = models.CharField(
        verbose_name=_("USPS code"),
        help_text=_(
            "Two-letters code attributed by the US Postal Service to every State and territory."
        ),
        max_length=2,
        editable=False,
        unique=True,
    )

    name = models.CharField(
        verbose_name=_("name"),
        max_length=100,
        editable=False,
    )

    type = models.CharField(
        verbose_name=_("type"), max_length=1, choices=Type.choices, editable=False
    )

    geometry = models.MultiPolygonField(
        verbose_name=_("Geometry"), geography=True, srid=4326  # WGS84, GPS coordinates
    )

    def __str__(self):
        return _("State of {name}").format(name=self.name)

    class Meta:
        ordering = ("code",)
        verbose_name = _("US state")


class USCounty(models.Model):
    objects = SearchQueryset.as_manager()

    code = models.CharField(
        verbose_name=_("ANSI code"),
        help_text=_(
            "Five-digits code that uniquely identify a county or equivalent, as standardized by ANSI"
        ),
        max_length=5,
        editable=False,
        unique=True,
    )

    name = models.CharField(
        verbose_name=_("name"),
        max_length=100,
        editable=False,
    )

    full_name = models.CharField(
        verbose_name=_("full name"),
        help_text=_("full name of the county, including area description"),
        max_length=200,
        editable=False,
    )

    state = models.ForeignKey(
        to=USState,
        on_delete=models.PROTECT,
        verbose_name=_("State"),
        related_name="counties",
        related_query_name="county",
    )

    geometry = models.MultiPolygonField(
        verbose_name=_("Geometry"),
        geography=True,
        srid=4326,  # WGS84, GPS coordinates
        spatial_index=True,
    )

    search = SearchVectorField(null=True)

    def __str__(self):
        return f"{self.full_name} ({self.state.name})"

    class Meta:
        ordering = ("code",)
        verbose_name = _("US county")
        verbose_name_plural = _("US counties")
        indexes = (GinIndex(fields=["search"]),)


class USZipCode(models.Model):
    code = models.CharField(
        verbose_name="zip code", max_length=5, editable=False, unique=True
    )

    official_city = models.CharField(
        verbose_name="official city name",
        max_length=50,
        editable=False,
    )

    timezone = models.CharField(
        verbose_name=_("timezone"), max_length=50, editable=False
    )

    coordinates = models.PointField(
        verbose_name=_("average coordinates"),
        geography=True,
        srid=4326,
        editable=False,
        spatial_index=True,
    )

    state = models.ForeignKey(
        to=USState,
        related_name="zip_codes",
        related_query_name="zip_code",
        editable=False,
        on_delete=models.PROTECT,
        null=True,
    )

    counties = models.ManyToManyField(
        to=USCounty,
        related_name="zip_codes",
        related_query_name="zip_code",
        through="USZipCodeCountyRel",
    )

    def __str__(self):
        return f"{self.code} ({self.official_city})"

    class Meta:
        ordering = ("code",)
        verbose_name = _("US zip code")
        verbose_name_plural = _("US zip codes")


class USZipCodeCountyRel(models.Model):
    zip_code = models.ForeignKey(
        to=USZipCode,
        on_delete=models.PROTECT,
        related_name="county_relations",
        related_query_name="county_relation",
        editable=False,
    )
    county = models.ForeignKey(
        to=USCounty,
        on_delete=models.PROTECT,
        related_name="zip_code_relations",
        related_query_name="zip_code_relation",
        editable=False,
    )

    weight = models.DecimalField(
        verbose_name=_("weight"),
        help_text=_("Weight of this county in this zip code."),
        max_digits=5,
        decimal_places=2,
        editable=False,
    )

    principal = models.BooleanField(
        verbose_name=_("Principal county"),
        help_text=_("Whether this county is the principal county for this zip code."),
        editable=False,
    )

    class Meta:
        unique_together = ("zip_code", "county")
