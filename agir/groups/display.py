from agir.groups.models import Membership
from agir.lib.display import genrer
from django.utils.translation import gettext as _, ngettext


def genrer_membership(genre, membership_type):
    """
    Returns membership_type french word from the gender given
    """

    if membership_type is None:
        # return genrer(genre, _("Visiteur"), _("Visiteuse"), _("Visiteur⋅se"))
        return "Visitante"

    if membership_type == Membership.MEMBERSHIP_TYPE_FOLLOWER:
        author_status = "Seguidor(a)"
    elif membership_type == Membership.MEMBERSHIP_TYPE_MEMBER:
        author_status = "Miembro"
    elif membership_type == Membership.MEMBERSHIP_TYPE_MANAGER:
        author_status = "Miembro gestor(a)"
    elif membership_type == Membership.MEMBERSHIP_TYPE_REFERENT:
        author_status = "Facilitador(a)"
    else:
        raise Exception("El estatus del autor no está identificado")

    return author_status
