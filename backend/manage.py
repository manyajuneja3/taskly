#!/usr/bin/env python
"""
Django's command-line utility. You run things like:
    python manage.py runserver
    python manage.py makemigrations
    python manage.py migrate
    python manage.py createsuperuser

It's just a thin wrapper that points Django at our settings module ("core.settings")
and then forwards the CLI arguments to django.core.management.
"""
import os
import sys


def main():
    # Tell Django where the settings live. "core.settings" means: the file
    # backend/core/settings.py inside the package `core`.
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you in the right virtualenv? "
            "Did you `pip install -r requirements.txt`?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
