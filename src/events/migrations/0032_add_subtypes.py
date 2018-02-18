# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-01-16 18:16
from __future__ import unicode_literals

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import lib.models


def create_and_assign_default_subtypes(apps, schema):
    EventSubtype = apps.get_model('events', 'EventSubtype')

    subtypes = [
        {
            'label': "autre reunion groupe",
            'description': "Autre type de réunion de groupe",
            'hide_text_label': True,
            'color': "#00B400",
            'type': 'G',
            'privileged_only': False
        },
        {
            'label': "autre reunion publique",
            'description': "Autre type de réunion publique",
            'hide_text_label': True,
            'color': "#0098B6",
            'type': 'M',
            'privileged_only': False
        },
        {
            'label': "autre action publique",
            'description': "Autre type d'action publique",
            'hide_text_label': True,
            'color': "#C9462C",
            'type': 'A',
            'privileged_only': False
        }
    ]

    for subtype in subtypes:
        EventSubtype.objects.create(
            **subtype
        )


def assign_current_events(apps, schema):
    EventSubtype = apps.get_model('events', 'EventSubtype')
    Calendar = apps.get_model('events', 'Calendar')
    Event = apps.get_model('events', 'Event')

    public_action = EventSubtype.objects.get(label="autre action publique")
    public_meeting = EventSubtype.objects.get(label="autre reunion publique")
    national_calendar = Calendar.objects.get(slug="national")

    Event.objects.filter(calendar=national_calendar).update(subtype=public_meeting)
    Event.objects.exclude(calendar=national_calendar).update(subtype=public_action)


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0031_auto_20171220_1737'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventSubtype',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('label', models.CharField(max_length=50, unique=True, verbose_name='nom')),
                ('description', models.TextField(blank=True, verbose_name='description')),
                ('privileged_only', models.BooleanField(default=True, verbose_name='réservé aux administrateurs')),
                ('hide_text_label', models.BooleanField(default=False, verbose_name='cacher le label texte')),
                ('icon', models.ImageField(blank=True, help_text="L'icône associée aux marqueurs sur la carte.", upload_to=lib.models.UploadToInstanceDirectoryWithFilename(filename='icon'), verbose_name='icon')),
                ('color', models.CharField(help_text='La couleur associée aux marqueurs sur la carte.', max_length=7, validators=[django.core.validators.RegexValidator(regex='^#[0-9a-f]{6}$')], verbose_name='couleur')),
                ('icon_anchor_x', models.PositiveSmallIntegerField(null=True, verbose_name="ancre de l'icône (x)")),
                ('icon_anchor_y', models.PositiveSmallIntegerField(null=True, verbose_name="ancre de l'icône (y)")),
                ('popup_anchor_x', models.PositiveSmallIntegerField(null=True, verbose_name='ancre de la popup (x)')),
                ('popup_anchor_y', models.PositiveSmallIntegerField(null=True, verbose_name='ancre de la popup (y)')),
                ('type', models.CharField(choices=[('G', 'Réunion de groupe'), ('M', 'Réunion publique'), ('A', 'Action publique')], max_length=1, verbose_name="Type d'événement")),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='event',
            name='subtype',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='events', to='events.EventSubtype'),
        ),
        migrations.RunPython(
            code=create_and_assign_default_subtypes,
            reverse_code=migrations.RunPython.noop,
        ),
        migrations.RunPython(
            code=assign_current_events,
            reverse_code=migrations.RunPython.noop,
        ),
        migrations.AlterField(
            model_name='event',
            name='subtype',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='events', to='events.EventSubtype'),
        )
    ]
