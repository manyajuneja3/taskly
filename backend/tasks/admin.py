from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ["title", "project", "assigned_to", "status", "deadline", "is_overdue"]
    list_filter = ["status", "project"]
    search_fields = ["title", "description"]
    list_select_related = ["project", "assigned_to"]
