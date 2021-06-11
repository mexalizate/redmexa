# Generated by Django 3.1.11 on 2021-06-11 08:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("people", "0004_display_name_and_image"),
        ("activity", "0019_fix unique_recipient_announcement_activity_constraint"),
    ]

    operations = [
        migrations.AlterField(
            model_name="activity",
            name="recipient",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="activities",
                related_query_name="activities",
                to="people.person",
            ),
        ),
        migrations.AlterUniqueTogether(name="activity", unique_together=set(),),
    ]
