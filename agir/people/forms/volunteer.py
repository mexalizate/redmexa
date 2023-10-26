from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, Row, HTML, Fieldset
from django import forms
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

from agir.lib.form_components import HalfCol, FullCol
from agir.lib.form_mixins import TagMixin
from agir.people.form_mixins import ContactPhoneNumberMixin
from agir.people.models import PersonTag, Person
from agir.people.tags import action_tags


class VolunteerForm(ContactPhoneNumberMixin, TagMixin, forms.ModelForm):
    tags = [
        (
            tag,
            format_html(
                "<span class='padmore'><strong>{}</strong><br><small><em>{}</em></small></span>",
                title,
                description,
            ),
        )
        for _, tags in action_tags.items()
        for tag, title, description in tags
    ]
    tag_model_class = PersonTag

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.helper = FormHelper()
        self.helper.form_method = "POST"
        self.helper.add_input(
            Submit(
                "submit", _("Enregistrer mes informations"), css_class="margintopmore"
            )
        )
        self.helper.layout = Layout(
            Row(
                FullCol(
                    Fieldset(
                        _("Agissez près de chez vous !"),
                        *(tag for tag, title, desc in action_tags["actions"])
                    )
                ),
            )
        )

    class Meta:
        model = Person
        fields = ()
