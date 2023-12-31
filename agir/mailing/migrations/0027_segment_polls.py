# Generated by Django 2.2.14 on 2020-07-03 10:10

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("polls", "0016_poll_authorized_segment"),
        ("mailing", "0026_auto_20200701_1804"),
    ]

    operations = [
        migrations.AddField(
            model_name="segment",
            name="polls",
            field=models.ManyToManyField(
                blank=True,
                related_name="_segment_polls_+",
                to="polls.Poll",
                verbose_name="A participé à au moins une de ces consultations",
            ),
        ),
    ]
