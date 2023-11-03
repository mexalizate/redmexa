from agir.lib.admin.autocomplete_filter import AutocompleteRelatedModelFilter
from django.utils.translation import gettext as _


class EventThemesAutocompleteFilter(AutocompleteRelatedModelFilter):
    title = _("Thème")
    parameter_name = "theme"
    field_name = "event_theme"


class EventSpeakerAutocompleteFilter(AutocompleteRelatedModelFilter):
    title = _("Intervenant·e")
    parameter_name = "speaker"
    field_name = "event_speaker"


class EventAutocompleteFilter(AutocompleteRelatedModelFilter):
    title = _("Événement")
    parameter_name = "event"
    field_name = "event"
