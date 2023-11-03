from prometheus_client import Counter
from django.utils.translation import gettext as _

logged_in = Counter("agir_auth_logged_in", _("Connexions réussies"), ["backend"])
logged_out = Counter("agir_auth_logged_out", _("Déconnexions"))
login_failed = Counter("agir_auth_login_failed", _("Connexions échouées"), ["backend"])
