from django.core.management.commands.compilemessages import (
    Command as CompileMessagesCommand
)

class Command(CompileMessagesCommand):
    help = "Compiles .po files to .mo files for use with builtin gettext support."

    def handle(self, **options):
        options["ignore"] = options.get("ignore", [])
        options["ignore"] += ["node_modules/*"]
        super().handle(**options)