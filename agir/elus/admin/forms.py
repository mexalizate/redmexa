from django import forms
from django.db import IntegrityError
from phonenumber_field.formfields import PhoneNumberField

from agir.elus.models import DELEGATIONS_CHOICES
from agir.people.models import PersonEmail, Person

PERSON_FIELDS = [
    "last_name",
    "first_name",
    "contact_phone",
    "location_address1",
    "location_address2",
    "location_zip",
    "location_city",
    "is_insoumise",
    "subscribed",
]


class CreerMandatForm(forms.ModelForm):
    last_name = forms.CharField(label="Nom", required=False)
    first_name = forms.CharField(label="Prénom", required=False)
    contact_phone = PhoneNumberField(label="Numéro de téléphone", required=False)
    location_address1 = forms.CharField(label="Adresse", required=False)
    location_address2 = forms.CharField(label="Adresse (2ème ligne)", required=False)
    location_zip = forms.CharField(label="Code postal", required=False)
    location_city = forms.CharField(label="Ville (où habite l'élu)", required=False)
    email_officiel = forms.ModelChoiceField(
        label="Email officiel", queryset=PersonEmail.objects.none(), required=False
    )
    is_insoumise = forms.BooleanField(label="Est insoumis⋅e", required=False)
    subscribed = forms.BooleanField(
        label="Inscrit à la lettre d'information de la FI",
        required=False,
        help_text="Assurez-vous d'avoir recueilli le consensus de la personne. Il n'est pas possible d'inscrire une"
        " personne sans avoir recueilli son consentement EXPLICITE.",
    )
    new_email = forms.EmailField(label="Ajouter un email officiel", required=False)
    delegations_municipales = forms.MultipleChoiceField(
        choices=DELEGATIONS_CHOICES,
        label="Délégations (pour un maire adjoint)",
        required=False,
        widget=forms.CheckboxSelectMultiple,
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if "person" in self.fields:
            person = self.get_initial_for_field(self.fields["person"], "person")
            self.fields["person"].required = False
            self.fields["person"].label = "Compte plateforme de l'élu"
            self.fields[
                "person"
            ].help_text = "Attention, si vous ne choisissez pas de compte plateforme, cela créera une fiche élu sans compte."
        else:
            person = getattr(self.instance, "person", None)

        if person is not None:
            for f in PERSON_FIELDS:
                self.fields[f].initial = getattr(person, f)
            self.fields["email_officiel"].queryset = person.emails.all()

        if "email_officiel" not in self._meta.fields:
            del self.fields["email_officiel"]

    def clean(self):
        if "person" in self.fields:
            person = self.cleaned_data.get("person")
        else:
            person = getattr(self.instance, "person", None)

        new_email = self.cleaned_data.get("new_email")
        contact_phone = self.cleaned_data.get("contact_phone")
        last_name = self.cleaned_data.get("last_name")
        first_name = self.cleaned_data.get("first_name")
        email_officiel = self.cleaned_data.get("email_officiel")

        minimal_information = (
            person or new_email or contact_phone or (last_name and first_name)
        )

        if not minimal_information:
            self.add_error(
                None,
                "Sélectionnez un compte existant ou indiquez adresse email, numéro de téléphone ou nom/prénom pour"
                " créer une fiche élue sans compte.",
            )

        if new_email and person:
            try:
                person_email = PersonEmail.objects.get_by_natural_key(new_email)
            except PersonEmail.DoesNotExist:
                pass
            else:
                if person_email.person != person:
                    self.add_error(
                        "new_email",
                        "Cette adresse email est déjà utilisée associée à quelqu'un d'autre sur la plateforme.",
                    )

        if new_email and not person:
            try:
                person = Person.objects.get_by_natural_key(new_email)
            except Person.DoesNotExist:
                pass
            else:
                self.cleaned_data["person"] = person
                del self.cleaned_data["new_email"]

        if email_officiel and person and email_officiel.person != person:
            self.cleaned_data["email_officiel"] = None

        return self.cleaned_data

    def _save_m2m(self):
        super()._save_m2m()

        cleaned_data = self.cleaned_data
        if "person" in self.fields:
            person = cleaned_data["person"]
        else:
            person = self.instance.person

        if not person:
            # création d'une personne
            self.instance.person = Person.objects.create_person(
                cleaned_data["new_email"],
                **{k: v for k, v in cleaned_data.items() if k in PERSON_FIELDS},
            )
            self.instance.email_officiel = self.instance.person.primary_email
            self.instance.save(update_fields=["email_officiel"])
        else:
            if "person" not in self.changed_data:
                for f in PERSON_FIELDS:
                    setattr(person, f, cleaned_data[f])

                person.save(update_fields=PERSON_FIELDS)

            if "new_email" in self.changed_data:
                try:
                    email = person.add_email(cleaned_data["new_email"])
                except IntegrityError:
                    pass
                else:
                    self.instance.email_officiel = email
                    self.instance.save(update_fields=["email_officiel"])

        return super()._save_m2m()


class CreerMandatMunicipalForm(CreerMandatForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if hasattr(self.instance, "conseil"):
            commune = self.instance.conseil
            epci = commune.epci
            if epci:
                self.fields["communautaire"].label = f"Mandat auprès de la {epci.nom}"
            else:
                self.fields["communautaire"].disabled = True
