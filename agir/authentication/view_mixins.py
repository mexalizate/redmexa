from django.contrib import messages
from django.contrib.auth.mixins import (
    AccessMixin,
    LoginRequiredMixin,
)
from django.contrib.auth.views import redirect_to_login
from django.core.exceptions import PermissionDenied
from django.http import Http404, HttpResponseRedirect
from django.template.response import TemplateResponse
from django.utils.translation import gettext_lazy as _
from rules.contrib.views import PermissionRequiredMixin

from agir.authentication.utils import is_hard_logged
from agir.lib.utils import front_url_lazy

SoftLoginRequiredMixin = LoginRequiredMixin


class PermissionErrorTo404Mixin:
    def dispatch(self, request, *args, **kwargs):
        try:
            return super().dispatch(request, *args, **kwargs)
        except PermissionDenied:
            raise Http404()


class HardLoginRequiredMixin(AccessMixin):
    def dispatch(self, request, *args, **kwargs):
        if not is_hard_logged(request):
            # TOUJOURS rediriger vers le login pour du hardlogin
            # N.B. on ne peut pas redéfinir handle_no_permission, sinon on rend impossible l'utilisation
            # de ce mixin en même temps qu'un des mixins de permissions.
            return redirect_to_login(
                self.request.get_full_path(),
                self.get_login_url(),
                self.get_redirect_field_name(),
            )
        return super().dispatch(request, *args, **kwargs)


class VerifiedContactPhoneRequiredMixin(AccessMixin):
    unverified_phone_redirect_target = front_url_lazy("send_validation_sms")
    unverified_phone_message = _(
        "Vous devez ajouter et verifier un numéro de téléphone avant de pouvoir continuer"
    )

    def dispatch(self, request, *args, **kwargs):
        if not is_hard_logged(request):
            # TOUJOURS rediriger vers le login pour du hardlogin
            # N.B. on ne peut pas redéfinir handle_no_permission, sinon on rend impossible l'utilisation
            # de ce mixin en même temps qu'un des mixins de permissions.
            return redirect_to_login(
                self.request.get_full_path(),
                self.get_login_url(),
                self.get_redirect_field_name(),
            )
        person = request.user.person

        if (
            not person.contact_phone
            or not person.contact_phone_status == person.CONTACT_PHONE_VERIFIED
        ):
            messages.add_message(
                request, messages.WARNING, self.unverified_phone_message
            )
            return HttpResponseRedirect(self.unverified_phone_redirect_target)

        return super().dispatch(request, *args, **kwargs)


class GlobalOrObjectPermissionRequiredMixin(PermissionRequiredMixin):
    raise_exception = True

    def has_permission(self):
        perms = self.get_permission_required()

        user = self.request.user
        required_object_perms = {perm for perm in perms if not user.has_perm(perm)}
        if required_object_perms:
            obj = self.get_permission_object()
            for perm in required_object_perms:
                if not user.has_perm(perm, obj):
                    return False

        return True


class VerifyLinkSignatureMixin:
    signed_params = None
    signature_generator = None
    link_error_template_name = "authentication/link_error.html"

    def get_params(self):
        if self.signed_params is not None:
            return self.signed_params
        return self.signature_generator.token_params

    def get_signed_values(self):
        token = self.request.GET.get("token")
        params_keys = self.get_params()
        if (not set(params_keys) <= set(self.request.GET)) or token is None:
            return None

        params = {k: self.request.GET[k] for k in params_keys}

        if not self.signature_generator.check_token(token, **params):
            return None

        return params

    def link_error_page(self):
        return TemplateResponse(self.request, self.link_error_template_name)
