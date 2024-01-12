from agir.groups.models import Membership
from agir.lib.display import genrer
from django.utils.translation import gettext_lazy as _, ngettext


def genrer_membership(genre, membership_type):
    """
    Returns membership_type french word from the gender given
    """

    if membership_type is None:
        return genrer(genre, _("Visiteur"), _("Visiteuse"), _("Visiteur⋅se"))

    if membership_type == Membership.MEMBERSHIP_TYPE_FOLLOWER:
        author_status = genrer(genre, _("Abonné"), _("Abonnée"), _("Abonné⋅e"))
    elif membership_type == Membership.MEMBERSHIP_TYPE_MEMBER:
        author_status = _("Membre")
    elif membership_type == Membership.MEMBERSHIP_TYPE_MANAGER:
        author_status = _("Membre gestionnaire")
    elif membership_type == Membership.MEMBERSHIP_TYPE_REFERENT:
        author_status = genrer(
            genre, _("Animateur"), _("Animatrice"), _("Animateur·ice")
        )
    else:
        raise Exception(_("The author status is unknown"))

    return author_status
