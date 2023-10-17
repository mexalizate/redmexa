import sys
from os import popen

from django.core.management.commands.compilemessages import (
    Command as CompileMessagesCommand
)

class ListStream:
    def __init__(self):
        self.data = []
    def write(self, s):
        self.data.append(s)

class Command(CompileMessagesCommand):
    help = "Compiles .po files to .mo files for use with builtin gettext support."

    def add_arguments(self, parser):
        super().add_arguments(parser)
        parser.add_argument(
            '--ci', dest='ci', action='store_true',
            help='Simplify stdout messages for CI usage',
        )

    def execute(self, *args, ci=False, **options):
        if ci:
            self._stdout = self.stdout
            options["stdout"] = ListStream()

        super().execute(*args, **options)

        if ci and self.stdout.data:
            unchanged = all([
                "is already compiled and up to date" in msg
                for msg in self.stdout.data
            ])
            if unchanged:
               self._stdout.write("All files already compiled and up to date.")
            else:
               self._stdout.write("All files compiled and up to date.")


    def handle(self, ci=False, **options):
        options["ignore"] = options.get("ignore", [])
        options["ignore"] += ["node_modules/*"]

        super().handle(**options)