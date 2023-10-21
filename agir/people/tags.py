"""Collections of useful tags that are used as part as forms or API views

"""

from django.utils.translation import gettext_lazy as _

from .models import PersonTag

__all__ = ["skills_tags", "action_tags"]


skills_tags = [
    ("skill:empresariado", _("Empresariado")),
    ("skill:sindicalismo", _("Sindicalismo")),
    ("skill:liderazgo_comunitario", _("Liderazgo comunitario")),
    ("skill:liderazgo_religioso/de_fe", _("Liderazgo Religioso/de Fe")),
    ("skill:derechos_de_migrantes", _("Derechos de migrantes")),
    ("skill:derechos_de_la_mujer", _("Derechos de la mujer")),
    ("skill:derechos_de_grupos_indígenas", _("Derechos de grupos indígenas")),
    (
        "skill:derechos_de_personas_discapacitadas",
        _("Derechos de personas discapacitadas"),
    ),
    ("skill:derechos_de_especies_naturales", _("Derechos de especies naturales")),
    ("skill:ambientalismo", _("Ambientalismo")),
    ("skill:dreamers", _("Dreamers")),
    ("skill:arte/música", _("Arte/Música")),
    ("skill:influencers", _("Influencers")),
    ("skill:medios/prensa", _("Medios/Prensa")),
    ("skill:deportes", _("Deportes")),
    ("skill:academia", _("Academia")),
    ("skill:ciencia/medicina", _("Ciencia/Medicina")),
    ("skill:lgbt", _("LGBT")),
    ("skill:campesinos", _("Campesinos")),
    ("skill:morena", _("MORENA")),
    ("skill:política", _("Política")),
]

action_tags = {
    "actions": [
        ("action:hacer_llamadas", _("Hacer llamadas"), ""),
        ("action:brigadear", _("Brigadear"), ""),
        ("action:compartir_en_redes", _("Compartir en redes"), ""),
        ("action:crear/diseñar_contenidos ", _("Crear/diseñar contenidos "), ""),
        ("action:redactar_contenidos", _("Redactar contenidos"), ""),
        ("action:conectar_personas_y_grupos", _("Conectar personas y grupos"), ""),
        ("action:comunicar/influencer ", _("Comunicar/Influencer "), ""),
        ("action:hacer_música_o_arte", _("Hacer música o arte"), ""),
        ("action:organizar_eventos", _("Organizar eventos"), ""),
        ("action:desarrollar_código", _("Desarrollar código"), ""),
    ]
}
