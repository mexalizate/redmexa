# Generated by Django 2.2.10 on 2020-03-05 14:56

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("municipales", "0013_ajout_listes_candidates")]

    operations = [
        migrations.AddConstraint(
            model_name="liste",
            constraint=models.UniqueConstraint(
                condition=models.Q(_negated=True, soutien="N"),
                fields=("commune",),
                name="commune_soutenue_unique",
            ),
        )
    ]
