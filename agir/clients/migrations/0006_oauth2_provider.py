# Generated by Django 2.1.3 on 2018-11-07 16:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("clients", "0005_auto_20171205_1218"),
    ]

    operations = [
        migrations.AddField(
            model_name="client",
            name="authorization_grant_type",
            field=models.CharField(
                choices=[
                    ("authorization-code", "Authorization code"),
                    ("implicit", "Implicit"),
                    ("password", "Resource owner password-based"),
                    ("client-credentials", "Client credentials"),
                ],
                default="authorization-code",
                max_length=32,
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="client",
            name="client_id",
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name="client",
            name="client_secret",
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="client",
            name="client_type",
            field=models.CharField(
                choices=[("confidential", "Confidential"), ("public", "Public")],
                default="confidential",
                max_length=32,
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="client",
            name="redirect_uris",
            field=models.TextField(
                blank=True, help_text="Allowed URIs list, space separated"
            ),
        ),
        migrations.AddField(
            model_name="client",
            name="skip_authorization",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="client",
            name="updated",
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name="client",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="clients_client",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="client",
            name="label",
            field=models.CharField(
                help_text="L'identifiant du client, utilisé pour l'authentication.",
                max_length=40,
                verbose_name="identifiant du client",
                blank=True,
            ),
        ),
    ]
