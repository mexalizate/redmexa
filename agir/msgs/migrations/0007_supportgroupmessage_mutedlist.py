# Generated by Django 3.1.13 on 2022-01-03 17:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("people", "0015_add_person_created_id_index"),
        ("msgs", "0006_supportgroupmessage_required_membership_type"),
    ]

    operations = [
        migrations.AddField(
            model_name="supportgroupmessage",
            name="mutedlist",
            field=models.ManyToManyField(
                blank=True,
                related_name="messages_muted",
                to="people.Person",
                verbose_name="Liste de personnes en sourdine",
            ),
        ),
    ]
