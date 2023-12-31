# Generated by Django 3.2.12 on 2022-04-08 09:15

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("gestion", "0026_auto_20220329_1937"),
    ]

    operations = [
        migrations.AddField(
            model_name="reglement",
            name="numero",
            field=models.PositiveIntegerField(
                null=True,
                verbose_name="Numéro dans le relevé bancaire",
                blank=True,
                help_text="le numéro de la ligne correspondante dans le relevé bancaire du compte de campagne.",
            ),
        ),
    ]
