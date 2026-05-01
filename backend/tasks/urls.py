"""
tasks/urls.py
=============
Same Router pattern as projects.

Auto-generated URLs:
  GET    /api/tasks/              → list (filtered by role)
  POST   /api/tasks/              → create (Admin only)
  GET    /api/tasks/{id}/         → retrieve
  PATCH  /api/tasks/{id}/         → partial_update (status for members)
  DELETE /api/tasks/{id}/         → destroy (Admin only)
  GET    /api/tasks/dashboard/    → dashboard stats
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet

router = DefaultRouter()
router.register(r"", TaskViewSet, basename="task")

urlpatterns = [
    path("", include(router.urls)),
]
