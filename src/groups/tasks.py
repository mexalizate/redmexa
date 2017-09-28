from collections import OrderedDict
from urllib.parse import urljoin

from django.utils.translation import ugettext_lazy as _
from django.template.loader import render_to_string
from django.conf import settings
from django.db.models import Q
from django.shortcuts import reverse

from celery import shared_task

from lib.mails import send_mosaico_email

from .models import SupportGroup, Membership

# encodes the preferred order when showing the messages
CHANGE_DESCRIPTION = OrderedDict((
    ("information", _("le nom ou la description du groupe")),
    ("location", _("le lieu de rencontre du groupe d'appui")),
    ("contact", _("les informations de contact des référents du groupe"))
))


@shared_task
def send_support_group_creation_notification(membership_pk):
    try:
        membership = Membership.objects.select_related('supportgroup', 'person').get(pk=membership_pk)
    except Membership.DoesNotExist:
        return

    group = membership.supportgroup
    referent = membership.person

    bindings = {
        "GROUP_NAME": group.name,
        "CONTACT_NAME": group.contact_name,
        "CONTACT_EMAIL": group.contact_email,
        "CONTACT_PHONE": group.contact_phone,
        "CONTACT_PHONE_VISIBILITY": _("caché") if group.contact_hide_phone else _("public"),
        "LOCATION_NAME": group.location_name,
        "LOCATION_ADDRESS": group.short_address,
        "GROUP_LINK": urljoin(settings.APP_DOMAIN, "/groupes/details/{}".format(group.pk)),
        "MANAGE_GROUP_LINK": reverse('manage_group', kwargs={'pk': group.pk}, urlconf='front.urls'),
    }

    send_mosaico_email(
        code='GROUP_CREATION',
        subject=_("Les informations de votre nouveau groupe d'appui"),
        from_email=settings.EMAIL_FROM,
        recipients=[referent.email],
        bindings=bindings,
    )


@shared_task
def send_support_group_changed_notification(support_group_pk, changes):
    try:
        group = SupportGroup.objects.get(pk=support_group_pk, published=True)
    except SupportGroup.DoesNotExist:
        return

    change_descriptions = [desc for label, desc in CHANGE_DESCRIPTION.items() if label in changes]
    change_fragment = render_to_string(
        template_name='lib/list_fragment.html',
        context={'items': change_descriptions}
    )

    # TODO: find adequate way to set up domain names to use for these links
    bindings = {
        "GROUP_NAME": group.name,
        "GROUP_CHANGES": change_fragment,
        "GROUP_LINK": urljoin(settings.APP_DOMAIN, "/groupes/details/{}".format(support_group_pk))
    }

    notifications_enabled = Q(notifications_enabled=True) & Q(person__group_notifications=True)

    recipients = [membership.person.email
                  for membership in group.memberships.filter(notifications_enabled).select_related('person')]

    send_mosaico_email(
        code='GROUP_CHANGED',
        subject=_("Les informations de votre groupe d'appui ont été changées"),
        from_email=settings.EMAIL_FROM,
        recipients=recipients,
        bindings=bindings,
    )


@shared_task
def send_someone_joined_notification(membership_pk):
    try:
        membership = Membership.objects.select_related('person', 'supportgroup').get(pk=membership_pk)
    except Membership.DoesNotExist:
        return

    person_information = str(membership.person)

    managers_filter = (Q(is_referent=True) | Q(is_manager=True)) & Q(notifications_enabled=True)
    managing_membership = membership.supportgroup.memberships.filter(managers_filter).select_related('person')
    recipients = [membership.person.email for membership in managing_membership]

    bindings = {
        "GROUP_NAME": membership.supportgroup.name,
        "PERSON_INFORMATION": person_information,
        "MANAGE_GROUP_LINK": urljoin(
            settings.FRONT_DOMAIN,
            reverse("manage_group", kwargs={"pk": membership.supportgroup.pk}, urlconf='front.urls')
        )
    }

    send_mosaico_email(
        code='GROUP_SOMEONE_JOINED_NOTIFICATION',
        subject=_("Un nouveau membre dans votre groupe d'appui"),
        from_email=settings.EMAIL_FROM,
        recipients=recipients,
        bindings=bindings
    )
