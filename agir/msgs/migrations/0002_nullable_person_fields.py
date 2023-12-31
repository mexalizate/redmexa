# Generated by Django 3.1.6 on 2021-03-18 09:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("people", "0004_display_name_and_image"),
        ("msgs", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="supportgroupmessage",
            name="author",
            field=models.ForeignKey(
                editable=False,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="people.person",
                verbose_name="Auteur",
            ),
        ),
        migrations.AlterField(
            model_name="supportgroupmessagecomment",
            name="author",
            field=models.ForeignKey(
                editable=False,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="people.person",
                verbose_name="Auteur",
            ),
        ),
        migrations.AlterField(
            model_name="userreport",
            name="reporter",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="people.person",
                verbose_name="Personne à l'origine du signalement",
            ),
        ),
    ]
