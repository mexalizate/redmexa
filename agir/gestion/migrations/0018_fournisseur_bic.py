# Generated by Django 3.2.12 on 2022-03-02 14:36

import agir.lib.model_fields
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("gestion", "0017_rename_bic_founisseur_reglement_bic_fournisseur"),
    ]

    operations = [
        migrations.AddField(
            model_name="fournisseur",
            name="bic",
            field=agir.lib.model_fields.BICField(
                blank=True, verbose_name="BIC du fournisseur"
            ),
        ),
    ]
