# Generated by Django 3.2.20 on 2023-10-21 01:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("geodata", "0003_search"),
    ]

    operations = [
        migrations.AddField(
            model_name="uszipcode",
            name="state",
            field=models.ForeignKey(
                editable=False,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="zip_codes",
                related_query_name="zip_code",
                to="geodata.usstate",
            ),
        ),
    ]
