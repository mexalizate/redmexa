# Generated by Django 3.2.20 on 2023-10-20 22:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("geodata", "0003_search"),
        ("people", "0031_remove_unused_options_for_newsletters"),
    ]

    operations = [
        migrations.AddField(
            model_name="person",
            name="municipio",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="+",
                to="geodata.mexicanmunicipio",
                verbose_name="Municipalité d'origine au Mexique",
            ),
        ),
    ]
