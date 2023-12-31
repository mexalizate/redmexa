# Generated by Django 3.2.12 on 2022-05-03 13:25

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("gestion", "0028_alter_depense_type"),
    ]

    operations = [
        migrations.AlterField(
            model_name="depense",
            name="quantite",
            field=models.FloatField(
                blank=True,
                help_text="Lorsque la dépense correspond à l'achat de matériel, indiquez ici la quantité achetée.",
                null=True,
                verbose_name="Quantité",
            ),
        ),
    ]
