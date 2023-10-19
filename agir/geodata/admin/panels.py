from django.contrib import admin

from .utils import ImmutableModelAdmin
from .. import models


@admin.register(models.MexicanState)
class MexicanStateAdmin(ImmutableModelAdmin):
    fieldsets = ((None, {"fields": ("code", "name", "geometry_as_widget")}),)

    list_display = ("code", "name")

    search_fields = (
        "code",
        "name",
    )  # doit être "truthy" pour afficher le champ de recherche

    # def get_search_results(self, request, queryset, search_term):
    #    use_distinct = False
    #    if search_term:
    #        return queryset.search(search_term), use_distinct
    #    return queryset, use_distinct


@admin.register(models.MexicanMunicipio)
class MexicanMunicipioAdmin(ImmutableModelAdmin):
    list_display = ("code", "name", "type", "state_link")
    fields = list_display + ("geometry_as_widget",)
    search_fields = ("code", "name")

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("state")
