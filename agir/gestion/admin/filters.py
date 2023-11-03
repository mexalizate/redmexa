from agir.lib.admin.autocomplete_filter import AutocompleteRelatedModelFilter

from agir.gestion.models import Projet, Depense
from django.contrib.admin import SimpleListFilter, ListFilter
from django.utils.translation import gettext_lazy as _


class InclureProjetsMilitantsFilter(ListFilter):
    parameter_name = _("militant")
    title = _("origine du projet")

    def __init__(self, request, params, model, model_admin):
        super().__init__(request, params, model, model_admin)
        if self.parameter_name in params:
            self.value = params.pop(self.parameter_name)
            self.used_parameters[self.parameter_name] = self.value
        else:
            self.value = None

    def expected_parameters(self):
        return [self.parameter_name]

    def has_output(self):
        return True

    def choices(self, changelist):
        yield {
            "selected": self.value is None,
            "query_string": changelist.get_query_string(remove=[self.parameter_name]),
            "display": _("n'inclure que les projets créés dans l'administration"),
        }
        yield {
            "selected": self.value == "O",
            "query_string": changelist.get_query_string({self.parameter_name: "O"}),
            "display": _("inclure aussi les projets militants"),
        }

    def queryset(self, request, queryset):
        if self.value == "O":
            return queryset
        return queryset.exclude(origine=Projet.Origin.UTILISATEUR)


class ProjetResponsableFilter(SimpleListFilter):
    parameter_name = _("responsable")
    title = _("responsable actuel")

    def lookups(self, request, model_admin):
        return (("R", _("Responsable du compte")), ("G", _("Gestionnaire projets")))

    def queryset(self, request, queryset):
        value = self.value()

        if value == "R":
            return queryset.filter(etat=Projet.Etat.FINALISE)
        elif value == "G":
            return queryset.filter(
                etat__in=[
                    Projet.Etat.CREE_PLATEFORME,
                    Projet.Etat.EN_CONSTITUTION,
                    Projet.Etat.RENVOI,
                ]
            )
        return queryset


class DepenseResponsableFilter(SimpleListFilter):
    parameter_name = _("responsable")
    title = _("responsable actuel")

    def lookups(self, request, model_admin):
        return (
            ("R", _("Responsable du compte")),
            ("G", _("Gestionnaire projets")),
            ("E", _("Experts comptables")),
        )

    def queryset(self, request, queryset):
        value = self.value()

        if value == "R":
            return queryset.filter(
                etat__in=[Depense.Etat.ATTENTE_ENGAGEMENT, Depense.Etat.COMPLET]
            )
        elif value == "G":
            return queryset.filter(
                etat__in=[Depense.Etat.ATTENTE_VALIDATION, Depense.Etat.CONSTITUTION]
            )

        return queryset


class FournisseurFilter(AutocompleteRelatedModelFilter):
    field_name = _("fournisseur")
    title = _("fournisseur")
