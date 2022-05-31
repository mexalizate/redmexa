# Generated by Django 3.2.13 on 2022-05-31 10:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gestion', '0033_reglement_libre'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='document',
            name='requis',
        ),
        migrations.AddField(
            model_name='document',
            name='source_url',
            field=models.URLField(blank=True, help_text="Si ce document provient d'internet, l'URL de la source d'origine.", verbose_name="URL d'origine"),
        ),
    ]
