from functools import partial

import numpy
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Field, Div
from crispy_forms.layout import Fieldset
from crispy_forms.layout import HTML, Row, Submit, Layout
from django import forms
from django.db import transaction
from django.forms import Form
from django.urls import reverse
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

from agir.lib.form_components import HalfCol, FullCol, ThirdCol, TwoThirdCol
from agir.lib.form_fields import MexicanMunicipioField
from agir.lib.form_mixins import TagMixin, MetaFieldsMixin, ImageFormMixin
from agir.lib.forms import MediaInHead
from agir.lib.models import RE_FRENCH_ZIPCODE
from agir.lib.tasks import geocode_person
from agir.people.form_mixins import ContactPhoneNumberMixin
from agir.people.forms.mixins import LegacySubscribedMixin
from agir.people.models import PersonTag, Person
from agir.people.tags import skills_tags
from agir.people.tasks import (
    send_confirmation_change_email,
    send_confirmation_merge_account,
)
from agir.people.token_buckets import ChangeMailBucket


def cut_list(list, parts):
    lst = []
    size = len(list)

    for i in range(parts):
        beg = int(i * size / parts)
        end = int((i + 1) * size / parts)
        lst.append(list[beg:end])
    return lst


class PersonalInformationsForm(ImageFormMixin, forms.ModelForm):
    image_field = "image"
    municipio = MexicanMunicipioField(
        label=_("Municipalité mexicaine d'origine"),
        required=False,
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.helper = FormHelper()
        self.helper.form_method = "POST"
        self.helper.add_input(Submit("submit", "Guardar mis datos"))

        self.fields["location_address1"].label = _("Adresse")
        self.fields["location_address2"].label = False
        self.fields["location_country"].required = True
        self.fields["display_name"].required = True
        self.fields[
            "action_radius"
        ].help_text = "La distancia indicada (en km) nos permite sugerirte acciones cerca de ti a máximo esa distancia."

        description_gender = HTML(
            format_html(
                """<p class="help-block">{help_text}</p>""",
                help_text="Para dirigirnos a ti correctamente y asegurar la paridad de género.",
            )
        )

        description_address = HTML(
            format_html(
                """<p class="help-block">{help_text}</p>""",
                help_text="Para informarte de acciones cerca de ti.",
            )
        )

        description_birth_date = HTML(
            format_html(
                """<p class="help-block">{help_text}</p>""",
                help_text="Para fines estadísticos",
            )
        )

        description = HTML(
            """<p class="marginbottommore">Esta información nos permite dirigirte la información adecuada en función de tu zona y perfil.</p>"""
        )

        description_display_name = HTML(
            format_html(
                """<p class="help-block">{help_text}</p>""",
                help_text="El nombre con el que apareces en Claudialízate. Puede ser tu nombre o un apodo.",
            )
        )

        self.helper.layout = Layout(
            Row(
                FullCol(description),
                HalfCol(
                    Row(
                        HalfCol("first_name"),
                        HalfCol("last_name"),
                    ),
                    Row(
                        FullCol(
                            Field("display_name"),
                            description_display_name,
                            css_class="field-with-help",
                        )
                    ),
                    Row(
                        FullCol(
                            "gender", description_gender, css_class="field-with-help"
                        )
                    ),
                    Row(
                        FullCol(
                            Field("date_of_birth", placeholder=_("JJ/MM/AAAA")),
                            description_birth_date,
                            css_class="field-with-help",
                        )
                    ),
                    Row(
                        FullCol(
                            Field("location_address1", placeholder=_("1ère ligne"))
                        ),
                        FullCol(
                            Field("location_address2", placeholder=_("2ème ligne"))
                        ),
                        HalfCol("location_zip"),
                        HalfCol("location_city"),
                        FullCol(
                            "location_country",
                            description_address,
                            css_class="field-with-help",
                        ),
                        FullCol(
                            Field("action_radius", min=1, max=500, step=1),
                            css_class="field-with-help",
                        ),
                        FullCol("municipio"),
                    ),
                ),
                HalfCol(
                    Row(FullCol("image")),
                    Row(FullCol("image_accept_license")),
                ),
            )
        )

    def clean(self):
        super().clean()

        if self.cleaned_data["location_zip"] == "":
            self.add_error(
                "location_zip",
                forms.ValidationError(
                    self.fields["location_zip"].error_messages["required"],
                    code="required",
                ),
            )

        if (
            self.cleaned_data.get("location_country") == "FR"
            and self.cleaned_data.get("location_zip") == "FR"
            and not RE_FRENCH_ZIPCODE.match(self.cleaned_data["location_zip"])
        ):
            self.add_error(
                "location_zip",
                forms.ValidationError(
                    _("Merci d'indiquer un code postal valide"), code="invalid"
                ),
            )

        return self.cleaned_data

    def _save_m2m(self):
        super()._save_m2m()

        if not self.instance.should_relocate_when_address_changed():
            return

        if any(field in self.changed_data for field in self.instance.GEOCODING_FIELDS):
            transaction.on_commit(partial(geocode_person.delay, self.instance.pk))

    class Meta:
        model = Person
        fields = (
            "first_name",
            "last_name",
            "display_name",
            "image",
            "gender",
            "date_of_birth",
            "location_address1",
            "location_address2",
            "location_city",
            "location_zip",
            "location_country",
            "action_radius",
            "municipio",
        )


class AddEmailMergeAccountForm(Form):
    email_add_merge = forms.EmailField(
        max_length=200,
        label="Nueva dirección email",
        required=False,
        error_messages={
            "rate_limit": "Trop d'email de confirmation envoyés. Merci de réessayer dans quelques minutes.",
            "same_person": "Cette adresse e-mail correspond déjà à l'une de vos adresses pour vous connecter.",
        },
    )

    def __init__(self, user_pk, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.user_pk = user_pk
        self.fields["email_add_merge"].label = "Nueva dirección email"
        self.helper = FormHelper()
        self.helper.form_method = "POST"
        self.helper.add_input(Submit("submit", "Enviar"))
        self.helper.layout = Layout(("email_add_merge"))

    def is_rate_limited(self):
        if not ChangeMailBucket.has_tokens(self.user_pk):
            self.add_error(
                "email_add_merge",
                self.fields["email_add_merge"].error_messages["rate_limit"],
            )
            return True
        return False

    def send_confirmation(self):
        email = self.cleaned_data["email_add_merge"]

        try:
            pk_merge = Person.objects.get(email=email).pk
        except Person.DoesNotExist:
            if self.is_rate_limited():
                return [None, None]

            # l'utilisateur n'existe pas. On envoie une demande d'ajout d'adresse e-mail
            send_confirmation_change_email.delay(
                new_email=email, user_pk=str(self.user_pk)
            )
            return [email, False]
        else:
            if pk_merge == self.user_pk:
                self.add_error(
                    "email_add_merge",
                    self.fields["email_add_merge"].error_messages["same_person"],
                )
                return [None, None]

            # l'utilisateur existe. On envoie une demande de fusion de compte
            if self.is_rate_limited():
                return [None, None]
            send_confirmation_merge_account.delay(self.user_pk, pk_merge)
            return [email, True]


class InformationConfidentialityForm(Form):
    def get_fields(self, fields=None):
        fields = fields or []

        title = "<h3>{}</h3>"
        help_text = '<p class="help-block">{}</p>'

        unsubscribe_title = HTML(
            format_html(title, "Desinscribirse de las listas de correos")
        )
        unsubscribe_button = Submit(
            "unsubscribe", "Quiero desinscribirme de todas las listas de correo"
        )
        unsubscribe_help_text = HTML(
            format_html(
                help_text,
                "Dejarás de recibir los emails de información de Claudialízate. Puedes seguir usando la plataforma como hasta ahora.",
            )
        )
        unsubscribe_block = Div(
            unsubscribe_title, unsubscribe_button, unsubscribe_help_text
        )

        delete_account_title = HTML(format_html(title, "Eliminar mi cuenta"))
        delete_account_link = HTML(
            format_html(
                '<a href="{url}" class="btn btn-wrap btn-danger">{label}</a>',
                url=reverse("delete_account"),
                label="Quiero eliminar mi cuenta definitivamente",
            )
        )
        delete_account_help_text = HTML(
            format_html(
                help_text,
                "Tu cuenta en Claudialízate y todos tus datos serán eliminados. Ya no recibirás emails de parte nuestra.",
            )
        )
        delete_account_block = Div(
            delete_account_title, delete_account_link, delete_account_help_text
        )

        description_block = HTML(
            format_html(
                """<p>{description}<a href="{link_url}">{link_text}</a></p>""",
                description="Puedes saber más sobre el uso de tus datos personales consultando ",
                link_url="https://info.claudializate.com/aviso-legal/",
                link_text="el aviso legal.",
            )
        )

        fields.extend([description_block, unsubscribe_block, delete_account_block])
        return fields

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(*self.get_fields())


class ContactForm(LegacySubscribedMixin, ContactPhoneNumberMixin, forms.ModelForm):
    def __init__(self, data=None, *args, **kwargs):
        super().__init__(data, *args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = "POST"
        self.no_mail = data is not None and "no_mail" in data
        self.helper.layout = Layout(*self.get_fields())
        self.fields["contact_phone"].label = "Número de celular"

    def get_fields(self, fields=None):
        fields = fields or []

        block_template = """
                    <label class="control-label">{label}</label>
                    <div class="controls">
                      <div>{value}</div>
                      <p class="help-block">{help_text}</p>
                    </div>
                """
        validation_link = format_html(
            '<a href="{url}" class="btn btn-sm btn-default" style="color: white !important;">{label}</a>',
            url=reverse("send_validation_sms"),
            label=_("Valider mon numéro de téléphone"),
        )

        unverified = (
            self.instance.contact_phone_status == Person.CONTACT_PHONE_UNVERIFIED
        )

        validation_block = HTML(
            format_html(
                block_template,
                label=_("Vérification de votre numéro de téléphone"),
                value=validation_link
                if unverified
                else f"Cuenta {self.instance.get_contact_phone_status_display().lower()}",
                help_text=_(
                    "Faites vérifiez votre numéro de téléphone (cette certification "
                    "facultative n'est possible que pour les numéros français)."
                )
                if unverified
                else "",
            )
        )

        btn_no_mails = Submit(
            "no_mail",
            "Dejar de recibir emails o mensajes",
            css_class="btn-danger btn-block marginbottom",
        )

        btn_submit = Submit(
            "submit",
            "Guardar",
            css_class="btn-primary btn-block marginbottom",
        )

        fields.extend(
            [
                Fieldset(
                    "Teléfono",
                    Row(ThirdCol("contact_phone"), HalfCol(validation_block)),
                    "subscribed_sms",
                ),
                Row(
                    HalfCol(btn_no_mails),
                    ThirdCol(btn_submit, css_class="col-md-offset-2"),
                    css_class="padtop",
                ),
            ]
        )
        return fields

    def clean(self):
        cleaned_data = super().clean()

        if self.no_mail:
            # if the user clicked the "unsubscribe from all button", we want to put all fields thare are boolean
            # to false, and keep all the others to their initial values: it allows posting to this form with
            # the single "no_mail" content
            for k, v in cleaned_data.items():
                if isinstance(v, bool):
                    cleaned_data[k] = False
                else:
                    cleaned_data[k] = self.get_initial_for_field(self.fields[k], k)

        return cleaned_data

    def save(self, commit=True):
        if "subscribed" in self.cleaned_data:
            self.instance.subscribed = self.cleaned_data["subscribed"]

        return super().save(commit=commit)

    class Meta:
        model = Person
        fields = ("contact_phone", "subscribed_sms", "subscribed")


class ActivityAndSkillsForm(TagMixin, forms.ModelForm):
    tags = skills_tags
    tag_model_class = PersonTag

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.helper = FormHelper()
        self.helper.form_method = "POST"
        self.helper.add_input(Submit("submit", "Guardar mi perfil"))

        tag_cols = numpy.array_split([tag for tag, desc in skills_tags], 3)

        self.helper.layout = Layout(
            Row(
                FullCol(
                    HTML(
                        """<p>Al indicar tu perfil e intereses, nos permites darte la información que más te puede interesar y ponerte en contacto con más personas de mismo perfil</p>"""
                    )
                ),
                FullCol(
                    *(ThirdCol(*tags) for tags in tag_cols),
                    css_class="padbottommore",
                ),
            )
        )

    @property
    def media(self):
        return MediaInHead.from_media(super().media)

    class Meta:
        model = Person
        fields = []
