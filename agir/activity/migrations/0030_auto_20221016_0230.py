# Generated by Django 3.2.14 on 2022-10-16 00:30

from django.db import migrations
import dynamic_filenames
import stdimage.models
import stdimage.validators


class Migration(migrations.Migration):
    dependencies = [
        ("activity", "0029_auto_20220307_1146"),
    ]

    operations = [
        migrations.AlterField(
            model_name="announcement",
            name="image",
            field=stdimage.models.StdImageField(
                blank=True,
                force_min_size=False,
                null=True,
                upload_to=dynamic_filenames.FilePattern(
                    filename_pattern="activity/announcements/{uuid:.2base32}/{uuid:s}{ext}"
                ),
                validators=[stdimage.validators.MinSizeValidator(255, 160)],
                variations={
                    "activity": {"crop": True, "height": 241, "width": 548},
                    "desktop": {"crop": True, "height": 130, "width": 255},
                    "mobile": {"crop": True, "height": 160, "width": 160},
                },
                verbose_name="Bannière",
            ),
        ),
    ]
