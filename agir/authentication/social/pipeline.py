from django.contrib import messages
from django.utils.safestring import mark_safe


def add_message(backend, user, details, new_association, *args, **kwargs):
    request = backend.strategy.request
    email = details.get("email")

    if request is not None:
        if user:
            if new_association:
                if not user.person.emails.filter(address=email).exists():
                    message = (
                        f"Éxito. Ahora puedes usar FB para conectarte a Claudializate."
                    )
                else:
                    message = f"Se conectó tu cuenta FB a Claudializate mediante tu email {email}"
                messages.add_message(
                    request=request,
                    level=messages.SUCCESS,
                    message=message,
                )
        else:
            messages.add_message(
                request=request,
                level=messages.ERROR,
                message=mark_safe(
                    f"Ojo: tu cuenta FB no está asociada a Claudializate. Crea una cuenta Claudializate para poder asociarlas."
                ),
            )
