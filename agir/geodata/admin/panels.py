from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html_join
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _

from .utils import ImmutableModelAdmin, list_of_links
from .. import models


class WithFullTextSearch:
    def get_search_results(self, request, queryset, search_term):
        use_distinct = False
        if search_term:
            queryset = queryset.search(search_term)
        return queryset, use_distinct


@admin.register(models.MexicanState)
class MexicanStateAdmin(ImmutableModelAdmin):
    fields = ("code", "name", "geometry_as_widget")
    list_display = ("name", "code")

    search_fields = (
        "code",
        "name",
    )  # doit être "truthy" pour afficher le champ de recherche


@admin.register(models.MexicanMunicipio)
class MexicanMunicipioAdmin(WithFullTextSearch, ImmutableModelAdmin):
    list_display = ("name", "code", "type", "state_link")
    fields = ("code", "name", "type", "state_link", "geometry_as_widget")
    search_fields = ("code", "name")

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("state")


@admin.register(models.USState)
class USStateAdmin(ImmutableModelAdmin):
    list_display = ("name", "code", "code_usps")
    fields = (
        "code",
        "code_usps",
        "name",
        "type",
        "geometry_as_widget",
    )

    search_fields = (
        "code",
        "code_usps",
        "name",
    )  # doit être "truthy" pour afficher le champ de recherche


@admin.register(models.USCounty)
class USCountyAdmin(WithFullTextSearch, ImmutableModelAdmin):
    list_display = ("full_name", "code", "state_link")
    fields = (
        "code",
        "name",
        "full_name",
        "state_link",
        "geometry_as_widget",
        "zip_codes_list",
    )
    search_fields = ("code", "full_name")

    def get_queryset(self, request):
        qs = super().get_queryset(request).select_related("state")
        if request.resolver_match.url_name.endswith("_change"):
            qs = qs.prefetch_related("zip_codes")
        return qs

    @admin.decorators.display(description=_("Zip codes"))
    def zip_codes_list(self, obj):
        if obj.id:
            return list_of_links(obj.zip_codes.all())


@admin.register(models.USZipCode)
class USZipCodeAdmin(ImmutableModelAdmin):
    list_display = ("code", "official_city")
    fields = (
        "code",
        "official_city",
        "coordinates_as_widget",
        "counties_list",
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.resolver_match.url_name.endswith("_change"):
            qs = qs.prefetch_related("county_relations__county")
        return qs

    @admin.decorators.display(description=_("Counties"))
    def counties_list(self, obj):
        if obj.id:
            return format_html_join(
                mark_safe("<br>"),
                '<a href="{}">{}</a>',
                (
                    (
                        reverse("admin:geodata_uscounty_change", args=(r.county.pk,)),
                        f"{r.county.full_name} ({r.weight}%)",
                    )
                    for r in obj.county_relations.all()
                ),
            )
