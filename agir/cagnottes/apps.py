from django.apps import AppConfig

from agir.payments.actions.payments import default_description_context_generator
from agir.payments.types import (
    PaymentType,
    register_payment_type,
)


class CagnottesConfig(AppConfig):
    name = "agir.cagnottes"
    verbose_name = "Cagnottes"
    PAYMENT_TYPE = "don_cagnotte"

    def ready(self):
        from agir.payments.models import Payment
        from agir.cagnottes.models import Cagnotte
        from .views import RemerciementView, notification_listener

        def recuperer_cagnotte(payment: Payment):
            context = default_description_context_generator(payment)

            if "cagnotte" in payment.meta:
                try:
                    context["cagnotte"] = Cagnotte.objects.get(
                        id=payment.meta["cagnotte"]
                    )

                except (Cagnotte.DoesNotExist, ValueError):
                    pass

            return context

        register_payment_type(
            payment_type=PaymentType(
                self.PAYMENT_TYPE,
                "Don à une cagnotte",
                RemerciementView.as_view(),
                status_listener=notification_listener,
                description_template="cagnottes/description.html",
                description_context_generator=recuperer_cagnotte,
            )
        )
