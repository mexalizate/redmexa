from django.contrib import admin
from django.utils.html import format_html

from agir.cagnottes.actions import montant_cagnotte
from agir.cagnottes.models import Cagnotte
from agir.lib.display import display_price
from agir.lib.utils import front_url
from django.utils.translation import gettext_lazy as _

@admin.register(Cagnotte)
class CagnotteAdmin(admin.ModelAdmin):
    list_display = ("nom", "slug", "public")
    fieldsets = (
        (None, {"fields": ("nom", "slug", "public", "url_remerciement", "compteur")}),
        (_("Texte des pages"), {"fields": ("titre", "legal", "description")}),
        (_("Email de remerciement"), {"fields": ("expediteur_email", "remerciements")}),
        (_("Configuration"), {"fields": ("meta", "progress_link")}),
    )
    readonly_fields = ("compteur", "progress_link")

    @admin.display(description=_("Montant donné"))
    def compteur(self, obj):
        return display_price(montant_cagnotte(obj))

    @admin.display(description=_("Barre de progression"))
    def progress_link(self, obj):
        link = front_url("cagnottes:progress", kwargs={"slug": obj.slug}, absolute=True)
        return format_html(f"<a href='{link}'>{link}</a>")
