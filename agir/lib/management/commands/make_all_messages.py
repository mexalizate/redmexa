from django.core.management.commands.makemessages import (
    Command as MakeMessagesCommand
)

class Command(MakeMessagesCommand):
    help = "Scan i18n messages for both django and js files"

    def handle(self, *args, **options):
        options["all"] = True
        # Make django messages
        options["domain"] = "django"
        super().handle(*args, **options)
        # Make javascript messages
        options["domain"] = "djangojs"
        options["ignore_patterns"] += ["node_modules/*", "*.stories.js", "assets/*", "jest/*"]
        super().handle(*args, **options)