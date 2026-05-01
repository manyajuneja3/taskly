from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["name", "created_by", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["name", "description"]
    filter_horizontal = ["members"]  # Nice UI for ManyToMany field
