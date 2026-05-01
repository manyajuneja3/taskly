"""
users/admin.py
==============
Registers our custom User model with Django's admin panel.
This lets you view, create, and edit users at /admin/

We extend UserAdmin (not just ModelAdmin) so we get Django's
built-in password hashing UI and permission fields.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Add `role` to the list view columns
    list_display = ["email", "username", "role", "is_staff", "date_joined"]
    list_filter = ["role", "is_staff"]

    # Add `role` to the user detail/edit page
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Role", {"fields": ("role",)}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Role", {"fields": ("role",)}),
    )
