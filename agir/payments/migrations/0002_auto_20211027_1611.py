# Generated by Django 3.1.13 on 2021-10-27 14:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0001_creer_modeles'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='type',
            field=models.CharField(max_length=255, verbose_name='type'),
        ),
    ]
