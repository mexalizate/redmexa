# Generated by Django 3.2.16 on 2022-11-18 17:33

from django.db import migrations, models

from agir.lib.models import DescriptionField


def creer_cagnotte_initiale(apps, schema):
    Cagnotte = apps.get_model("cagnottes", "Cagnotte")
    Payment = apps.get_model("payments", "Payment")

    initial = Cagnotte.objects.create(slug="initiale", nom="Cagnotte initiale")

    Payment.objects.filter(type="don_cagnotte").update(
        meta=models.Func(
            models.F("meta"),
            models.Value(["cagnotte"]),
            models.Value(initial.id, output_field=models.JSONField()),
            function="jsonb_set",
        )
    )


class Migration(migrations.Migration):

    initial = True

    dependencies = [("payments", "0002_auto_20211027_1611")]

    operations = [
        migrations.CreateModel(
            name="Cagnotte",
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
                ("nom", models.CharField(max_length=100)),
                ("slug", models.SlugField()),
                ("public", models.BooleanField(default=True)),
                ("titre", models.CharField(max_length=100)),
                ("description", DescriptionField(blank=True)),
                ("legal", DescriptionField(blank=True)),
            ],
        ),
        migrations.RunPython(
            code=creer_cagnotte_initiale, reverse_code=migrations.RunPython.noop
        ),
    ]
