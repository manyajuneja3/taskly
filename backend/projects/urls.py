"""
projects/urls.py
================
We use a DRF Router to auto-generate URLs for our ViewSet.

DefaultRouter registers ALL standard CRUD URLs automatically:
  GET    /api/projects/              → list
  POST   /api/projects/              → create
  GET    /api/projects/{id}/         → retrieve
  PUT    /api/projects/{id}/         → update
  PATCH  /api/projects/{id}/         → partial_update
  DELETE /api/projects/{id}/         → destroy
  POST   /api/projects/{id}/add_member/    → our @action
  POST   /api/projects/{id}/remove_member/ → our @action

Without a Router, you'd have to write all 8 URL patterns by hand.
This is the power of ViewSets + Routers.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet

router = DefaultRouter()
# Register the ViewSet with the router.
# "projects" → the URL prefix
# ProjectViewSet → the view class
# basename="project" → used for naming URL patterns (project-list, project-detail, etc.)
router.register(r"", ProjectViewSet, basename="project")

urlpatterns = [
    path("", include(router.urls)),
]
