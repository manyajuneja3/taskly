"""
core/urls.py
============
The ROOT URL ROUTER of the entire Django project.

Think of this file like a traffic cop at the entrance of your city.
Every incoming request hits this file first, and Django decides
which "app" to hand it off to.

URL structure we're building:
  /api/auth/         → users app   (signup, login, token refresh)
  /api/projects/     → projects app
  /api/tasks/        → tasks app
  /admin/            → Django's built-in admin panel
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Django's built-in admin panel at /admin/
    # You can manage all data here — useful for debugging.
    path("admin/", admin.site.urls),

    # All auth-related endpoints (signup, login, refresh token)
    # We prefix them with /api/auth/ to keep things organized.
    path("api/auth/", include("users.urls")),

    # All project-related endpoints
    path("api/projects/", include("projects.urls")),

    # All task-related endpoints
    path("api/tasks/", include("tasks.urls")),
]
