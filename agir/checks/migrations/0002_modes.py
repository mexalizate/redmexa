# Generated by Django 2.2.14 on 2020-07-22 12:38

from django.db import migrations


def migrate_checks(apps, schema_editor):
    Payment = apps.get_model("payments", "Payment")

    Payment.objects.filter(mode="check").filter(type="don").update(
        mode="check_donations"
    )
    Payment.objects.filter(mode="check").filter(type="evenement").update(
        mode="check_events"
    )


def unmigrate_checks(apps, schema_editor):
    Payment = apps.get_model("payments", "Payment")

    Payment.objects.filter(mode="check_donations").update(mode="check")
    Payment.objects.filter(mode="check_events").update(mode="check")


class Migration(migrations.Migration):
    dependencies = [
        ("checks", "0001_checkpayment"),
    ]

    operations = [migrations.RunPython(migrate_checks, unmigrate_checks)]
