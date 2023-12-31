# Generated by Django 3.2.16 on 2022-11-22 16:18

import agir.lib.models
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("cagnottes", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="cagnotte",
            name="url_remerciement",
            field=models.URLField(
                default="/",
                help_text="L'URL vers laquelle rediriger après le paiement.",
                verbose_name="URL de présentation",
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="cagnotte",
            name="description",
            field=agir.lib.models.DescriptionField(
                blank=True,
                help_text="Texte affiché dans le profil sur la page des dons d'une personne.",
            ),
        ),
        migrations.AlterField(
            model_name="cagnotte",
            name="legal",
            field=agir.lib.models.DescriptionField(
                blank=True,
                help_text="Texte additionnel à indiquer en haut de la colonne de texte légal sur la page de dons.",
            ),
        ),
        migrations.AlterField(
            model_name="cagnotte",
            name="nom",
            field=models.CharField(
                help_text="Utilisé notamment dans le profil sur la page des dons d'une personne.",
                max_length=100,
            ),
        ),
        migrations.AlterField(
            model_name="cagnotte",
            name="slug",
            field=models.SlugField(help_text="Utilisé dans l'URL pour cette cagnotte"),
        ),
        migrations.AlterField(
            model_name="cagnotte",
            name="titre",
            field=models.CharField(
                help_text="Utilisée en titre principal de la page de dons elle-même.",
                max_length=100,
            ),
        ),
    ]
