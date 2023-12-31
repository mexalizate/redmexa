# Generated by Django 3.1.14 on 2022-02-10 09:00

import agir.lib.model_fields
import agir.mailing.models
from django.db import migrations, models
import django_countries.fields


class Migration(migrations.Migration):
    dependencies = [
        ("mailing", "0039_segment_elu_consulaire"),
    ]

    operations = [
        migrations.AlterField(
            model_name="segment",
            name="countries",
            field=django_countries.fields.CountryField(
                blank=True,
                max_length=754,
                multiple=True,
                verbose_name="Limiter aux pays",
            ),
        ),
        migrations.AlterField(
            model_name="segment",
            name="is_2022",
            field=models.BooleanField(
                blank=True, default=True, null=True, verbose_name="Inscrits NSP"
            ),
        ),
        migrations.AlterField(
            model_name="segment",
            name="is_insoumise",
            field=models.BooleanField(
                blank=True, null=True, verbose_name="Inscrits LFI"
            ),
        ),
        migrations.AlterField(
            model_name="segment",
            name="newsletters",
            field=agir.lib.model_fields.ChoiceArrayField(
                base_field=models.CharField(
                    choices=[
                        ("LFI", "Lettre d'information de la France insoumise"),
                        ("2022", "Lettre d'information NSP"),
                        ("2022_exceptionnel", "NSP : informations exceptionnelles"),
                        ("2022_en_ligne", "NSP actions en ligne"),
                        ("2022_chez_moi", "NSP agir près de chez moi"),
                        ("2022_programme", "NSP processus programme"),
                        ("2022_liaison", "NSP Correspondant·e d'immeuble ou de rue"),
                    ],
                    max_length=255,
                ),
                blank=True,
                default=agir.mailing.models.default_newsletters,
                help_text="Inclure les personnes abonnées aux newsletters suivantes.",
                size=None,
            ),
        ),
    ]
