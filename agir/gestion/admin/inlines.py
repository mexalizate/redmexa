from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html_join, format_html

from agir.gestion.admin.base import BaseMixin
from agir.gestion.admin.forms import (
    DocumentInlineForm,
    DepenseDevisForm,
)
from agir.gestion.models import Depense, Projet, Participation


class BaseDocumentInline(admin.TabularInline):
    extra = 0
    show_change_link = True
    form = DocumentInlineForm

    autocomplete_fields = ("document",)

    fields = ("document", *DocumentInlineForm.DOCUMENTS_FIELDS)


class DepenseDocumentInline(BaseDocumentInline):
    model = Depense.documents.through


class DepenseInline(BaseMixin, admin.TabularInline):
    verbose_name = "Dépense"
    verbose_name_plural = "Dépenses du projet"

    model = Depense
    extra = 0
    show_change_link = True
    can_delete = False

    def has_add_permission(self, request, obj):
        return False

    fields = ("numero_", "titre", "type", "montant", "date_depense", "compte")
    readonly_fields = ("montant", "type", "date_depense", "compte")


class AjouterDepenseInline(admin.TabularInline):
    verbose_name_plural = "Ajout rapide de dépenses"
    model = Depense
    form = DepenseDevisForm
    extra = 1
    can_delete = False

    def has_change_permission(self, request, obj=None):
        return False

    def has_view_permission(self, request, obj=None):
        return False

    fields = ("titre", "type", "montant", "compte", "devis")


class ProjetDocumentInline(BaseDocumentInline):
    model = Projet.documents.through


def depense_type(type, label):
    def func(self, obj):
        if obj and obj.projet and obj.person:
            dep = obj.projet.depenses.filter(
                beneficiaires=obj.person, type__startswith=type
            )

            creation_url = "{}?projet={}&person={}&type={}".format(
                reverse("admin:gestion_depense_add"),
                obj.projet_id,
                obj.person_id,
                type,
            )
            add_button = format_html(
                '<div><a class="gestion--button" href="{}">Ajouter</a></div>',
                creation_url,
            )

            if dep:
                try:
                    return format_html(
                        '<ul class="gestion--liste"><li>{}</li></ul>{}',
                        format_html_join(
                            "</li><li>",
                            '<a href="{}">{}</a>',
                            (
                                (
                                    reverse(
                                        "admin:gestion_depense_change", args=(d.id,)
                                    ),
                                    f"{d.numero} ({d.montant} €)",
                                )
                                for d in dep
                            ),
                        ),
                        add_button,
                    )
                except Exception as e:
                    print(e)
            else:
                return add_button

        return "PROUT"

    func.short_description = label
    return func


class ProjetParticipationInline(admin.TabularInline):
    verbose_name_plural = "Personnes impliquées dans ce projet"
    model = Participation
    extra = 1

    fields = (
        "person",
        "role",
        "precisions",
        "depense_transport",
        "depense_hebergement",
    )
    autocomplete_fields = ("person",)
    readonly_fields = ("depense_transport", "depense_hebergement")

    depense_transport = depense_type("TRA", "Dépenses de transport")
    depense_hebergement = depense_type("FRH", "Dépenses d'hébergement")
