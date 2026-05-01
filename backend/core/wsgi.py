"""
core/wsgi.py
============
WSGI = Web Server Gateway Interface.

This file is the entry point when you deploy Django in PRODUCTION.
When Railway runs `gunicorn core.wsgi:application`, it:
  1. Imports this file
  2. Finds the `application` object
  3. Uses it to handle HTTP requests

WSGI is the OLD (but still very popular) standard.
Gunicorn is a "WSGI server" — it's the bridge between Railway's
load balancer and your Django code.

You will almost never edit this file.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
application = get_wsgi_application()
