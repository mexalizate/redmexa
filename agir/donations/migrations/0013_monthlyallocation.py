# Generated by Django 2.2.3 on 2019-07-24 13:49

from django.db import migrations, models
import django.db.models.deletion


from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("donations", "0012_auto_20190215_1902"),
    ]

    operations = [
        migrations.CreateModel(
            name="MonthlyAllocation",
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
                ("amount", models.SmallIntegerField(verbose_name="montant")),
                (
                    "group",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="subscriptions",
                        to="groups.SupportGroup",
                    ),
                ),
            ],
            options={
                "verbose_name": "Allocation mensuelle",
                "verbose_name_plural": "Allocations mensuelles",
            },
        )
    ]
