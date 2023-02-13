# Generated by Django 3.1.3 on 2021-01-05 10:54

import agir.lib.models
import django.contrib.gis.db.models.fields
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import django_countries.fields
import dynamic_filenames
import stdimage.models
import uuid


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("people", "0001_creer_modeles"),
    ]

    operations = [
        migrations.CreateModel(
            name="Membership",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    models.DateTimeField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="date de création",
                    ),
                ),
                (
                    "modified",
                    models.DateTimeField(
                        auto_now=True, verbose_name="dernière modification"
                    ),
                ),
                (
                    "membership_type",
                    models.IntegerField(
                        choices=[
                            (10, "Membre du groupe"),
                            (50, "Membre gestionnaire"),
                            (100, "Animateur⋅rice"),
                        ],
                        default=10,
                        verbose_name="Statut dans le groupe",
                    ),
                ),
                (
                    "notifications_enabled",
                    models.BooleanField(
                        default=True,
                        help_text="Je recevrai des messages en cas de modification du groupe.",
                        verbose_name="Recevoir les notifications de ce groupe",
                    ),
                ),
            ],
            options={
                "verbose_name": "adhésion",
                "verbose_name_plural": "adhésions",
            },
        ),
        migrations.CreateModel(
            name="SupportGroup",
            fields=[
                (
                    "created",
                    models.DateTimeField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="date de création",
                    ),
                ),
                (
                    "modified",
                    models.DateTimeField(
                        auto_now=True, verbose_name="dernière modification"
                    ),
                ),
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="UUID interne à l'API pour identifier la ressource",
                        primary_key=True,
                        serialize=False,
                        verbose_name="UUID",
                    ),
                ),
                (
                    "coordinates",
                    django.contrib.gis.db.models.fields.PointField(
                        blank=True,
                        geography=True,
                        null=True,
                        srid=4326,
                        verbose_name="coordonnées",
                    ),
                ),
                (
                    "coordinates_type",
                    models.PositiveSmallIntegerField(
                        choices=[
                            (0, "Coordonnées manuelles"),
                            (10, "Coordonnées automatiques précises"),
                            (
                                20,
                                "Coordonnées automatiques approximatives (niveau rue)",
                            ),
                            (
                                25,
                                "Coordonnées automatique approximatives (arrondissement)",
                            ),
                            (30, "Coordonnées automatiques approximatives (ville)"),
                            (50, "Coordonnées automatiques (qualité inconnue)"),
                            (254, "Pas de position géographique"),
                            (255, "Coordonnées introuvables"),
                        ],
                        editable=False,
                        help_text="Comment les coordonnées ci-dessus ont-elle été acquises",
                        null=True,
                        verbose_name="type de coordonnées",
                    ),
                ),
                (
                    "location_name",
                    models.CharField(
                        blank=True, max_length=255, verbose_name="nom du lieu"
                    ),
                ),
                (
                    "location_address1",
                    models.CharField(
                        blank=True, max_length=100, verbose_name="adresse (1ère ligne)"
                    ),
                ),
                (
                    "location_address2",
                    models.CharField(
                        blank=True, max_length=100, verbose_name="adresse (2ème ligne)"
                    ),
                ),
                (
                    "location_citycode",
                    models.CharField(
                        blank=True, max_length=20, verbose_name="code INSEE"
                    ),
                ),
                (
                    "location_city",
                    models.CharField(blank=True, max_length=100, verbose_name="ville"),
                ),
                (
                    "location_zip",
                    models.CharField(
                        blank=True, max_length=20, verbose_name="code postal"
                    ),
                ),
                (
                    "location_state",
                    models.CharField(blank=True, max_length=40, verbose_name="état"),
                ),
                (
                    "location_country",
                    django_countries.fields.CountryField(
                        blank=True, default="FR", max_length=2, verbose_name="pays"
                    ),
                ),
                (
                    "contact_name",
                    models.CharField(
                        blank=True, max_length=255, verbose_name="nom du contact"
                    ),
                ),
                (
                    "contact_email",
                    models.EmailField(
                        blank=True,
                        max_length=254,
                        verbose_name="adresse email du contact",
                    ),
                ),
                (
                    "contact_phone",
                    models.CharField(
                        blank=True,
                        max_length=30,
                        verbose_name="numéro de téléphone du contact",
                    ),
                ),
                (
                    "contact_hide_phone",
                    models.BooleanField(
                        default=False, verbose_name="Cacher mon numéro de téléphone"
                    ),
                ),
                (
                    "image",
                    stdimage.models.StdImageField(
                        blank=True,
                        help_text="Vous pouvez ajouter une image de bannière : elle apparaîtra sur la page, et sur les réseaux sociaux en cas de partage. Préférez une image à peu près deux fois plus large que haute. Elle doit faire au minimum 1200 pixels de large et 630 de haut pour une qualité optimale.",
                        upload_to=dynamic_filenames.FilePattern(
                            filename_pattern="{app_label}/{model_name}/{instance.id}/banner{ext}"
                        ),
                        validators=[
                            django.core.validators.FileExtensionValidator(
                                allowed_extensions=["jpg", "jpeg", "gif", "png", "svg"]
                            )
                        ],
                        verbose_name="image",
                    ),
                ),
                (
                    "description",
                    agir.lib.models.DescriptionField(
                        blank=True,
                        help_text="Une courte description",
                        verbose_name="description",
                    ),
                ),
                (
                    "allow_html",
                    models.BooleanField(
                        default=False,
                        verbose_name="autoriser le HTML étendu dans la description",
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        help_text="Le nom du groupe", max_length=255, verbose_name="nom"
                    ),
                ),
                (
                    "type",
                    models.CharField(
                        choices=[
                            ("L", "Groupe local"),
                            ("B", "Groupe thématique"),
                            ("F", "Groupe fonctionnel"),
                            ("P", "Groupe professionel"),
                            ("2", "Équipe de soutien « Nous Sommes Pour ! »"),
                        ],
                        default="L",
                        max_length=1,
                        verbose_name="type de groupe",
                    ),
                ),
                (
                    "published",
                    models.BooleanField(
                        default=True,
                        help_text="Le groupe doit-il être visible publiquement.",
                        verbose_name="publié",
                    ),
                ),
            ],
            options={
                "verbose_name": "groupe d'action",
                "verbose_name_plural": "groupes d'action",
                "ordering": ("-created",),
                "permissions": (
                    (
                        "view_hidden_supportgroup",
                        "Peut afficher les groupes non publiés",
                    ),
                ),
            },
        ),
        migrations.CreateModel(
            name="SupportGroupSubtype",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    models.DateTimeField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="date de création",
                    ),
                ),
                (
                    "modified",
                    models.DateTimeField(
                        auto_now=True, verbose_name="dernière modification"
                    ),
                ),
                (
                    "label",
                    models.CharField(max_length=50, unique=True, verbose_name="nom"),
                ),
                (
                    "description",
                    models.TextField(blank=True, verbose_name="description"),
                ),
                (
                    "visibility",
                    models.CharField(
                        choices=[
                            ("N", "Personne (plus utilisé)"),
                            ("D", "Seulement depuis l'administration"),
                            ("A", "N'importe qui"),
                        ],
                        default="D",
                        max_length=1,
                        verbose_name="Qui peut créer avec ce sous-type ?",
                    ),
                ),
                (
                    "hide_text_label",
                    models.BooleanField(
                        default=False, verbose_name="cacher le label texte"
                    ),
                ),
                (
                    "icon",
                    models.ImageField(
                        blank=True,
                        help_text="L'icône associée aux marqueurs sur la carte.",
                        upload_to=dynamic_filenames.FilePattern(
                            filename_pattern="{app_label}/{model_name}/{instance.id}/icon{ext}"
                        ),
                        verbose_name="icon",
                    ),
                ),
                (
                    "icon_name",
                    models.CharField(
                        blank=True,
                        max_length=200,
                        verbose_name="Nom de l'icône Font Awesome",
                    ),
                ),
                (
                    "color",
                    models.CharField(
                        blank=True,
                        help_text="La couleur associée aux marqueurs sur la carte.",
                        max_length=7,
                        validators=[
                            django.core.validators.RegexValidator(
                                regex="^#[0-9A-Fa-f]{6}$"
                            )
                        ],
                        verbose_name="couleur",
                    ),
                ),
                (
                    "icon_anchor_x",
                    models.PositiveSmallIntegerField(
                        blank=True, null=True, verbose_name="ancre de l'icône (x)"
                    ),
                ),
                (
                    "icon_anchor_y",
                    models.PositiveSmallIntegerField(
                        blank=True, null=True, verbose_name="ancre de l'icône (y)"
                    ),
                ),
                (
                    "popup_anchor_y",
                    models.PositiveSmallIntegerField(
                        blank=True,
                        null=True,
                        verbose_name="placement de la popup (par rapport au point)",
                    ),
                ),
                (
                    "config",
                    models.JSONField(
                        blank=True, default=dict, verbose_name="Configuration"
                    ),
                ),
                (
                    "allow_external",
                    models.BooleanField(
                        default=False,
                        verbose_name="Les non-insoumis⋅es peuvent rejoindre",
                    ),
                ),
                (
                    "external_help_text",
                    models.TextField(
                        blank=True,
                        verbose_name="Phrase d'explication pour rejoindre le groupe ou l'événement",
                    ),
                ),
                (
                    "type",
                    models.CharField(
                        choices=[
                            ("L", "Groupe local"),
                            ("B", "Groupe thématique"),
                            ("F", "Groupe fonctionnel"),
                            ("P", "Groupe professionel"),
                            ("2", "Équipe de soutien « Nous Sommes Pour ! »"),
                        ],
                        max_length=1,
                        verbose_name="type de groupe",
                    ),
                ),
            ],
            options={
                "verbose_name": "sous-type",
            },
        ),
        migrations.CreateModel(
            name="SupportGroupTag",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "label",
                    models.CharField(max_length=50, unique=True, verbose_name="nom"),
                ),
                (
                    "description",
                    models.TextField(blank=True, verbose_name="description"),
                ),
            ],
            options={
                "verbose_name": "tag",
            },
        ),
        migrations.CreateModel(
            name="TransferOperation",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "timestamp",
                    models.DateTimeField(
                        auto_now_add=True, verbose_name="Heure de l'opération"
                    ),
                ),
                (
                    "former_group",
                    models.ForeignKey(
                        editable=False,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="+",
                        to="groups.supportgroup",
                    ),
                ),
            ],
            options={
                "verbose_name": "Transfert de membres",
                "verbose_name_plural": "Transferts de membres",
                "ordering": ("timestamp", "former_group"),
            },
        ),
        # Relations et index
        migrations.AddField(
            model_name="transferoperation",
            name="manager",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="people.person",
            ),
        ),
        migrations.AddField(
            model_name="transferoperation",
            name="members",
            field=models.ManyToManyField(
                editable=False,
                related_name="_transferoperation_members_+",
                to="people.Person",
            ),
        ),
        migrations.AddField(
            model_name="transferoperation",
            name="new_group",
            field=models.ForeignKey(
                editable=False,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="+",
                to="groups.supportgroup",
            ),
        ),
        migrations.AddField(
            model_name="supportgroup",
            name="members",
            field=models.ManyToManyField(
                blank=True,
                related_name="supportgroups",
                through="groups.Membership",
                to="people.Person",
            ),
        ),
        migrations.AddField(
            model_name="supportgroup",
            name="subtypes",
            field=models.ManyToManyField(
                blank=True,
                related_name="supportgroups",
                to="groups.SupportGroupSubtype",
            ),
        ),
        migrations.AddField(
            model_name="supportgroup",
            name="tags",
            field=models.ManyToManyField(
                blank=True, related_name="groups", to="groups.SupportGroupTag"
            ),
        ),
        migrations.AddField(
            model_name="membership",
            name="person",
            field=models.ForeignKey(
                editable=False,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="memberships",
                to="people.person",
            ),
        ),
        migrations.AddField(
            model_name="membership",
            name="supportgroup",
            field=models.ForeignKey(
                editable=False,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="memberships",
                to="groups.supportgroup",
            ),
        ),
        migrations.CreateModel(
            name="ThematicGroup",
            fields=[],
            options={
                "verbose_name": "Groupe thématique",
                "verbose_name_plural": "Groupes thématiques",
                "proxy": True,
                "default_permissions": ("view", "change"),
                "indexes": [],
                "constraints": [],
            },
            bases=("groups.supportgroup",),
        ),
        migrations.AlterUniqueTogether(
            name="membership",
            unique_together={("supportgroup", "person")},
        ),
    ]
