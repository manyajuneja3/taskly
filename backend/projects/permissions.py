from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin


class IsProjectMemberOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_admin:
            return True
        if request.method in SAFE_METHODS:
            return obj.members.filter(id=request.user.id).exists()
        return False
