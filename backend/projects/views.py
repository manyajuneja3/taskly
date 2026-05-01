from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from users.models import User
from .models import Project
from .permissions import IsAdminUser, IsProjectMemberOrAdmin
from .serializers import ProjectSerializer, ProjectCreateSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Project.objects.all().prefetch_related("members")
        return Project.objects.filter(members=user).prefetch_related("members")

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return ProjectCreateSerializer
        return ProjectSerializer

    def get_permissions(self):
        if self.action in ["create", "destroy", "update", "partial_update", "add_member", "remove_member"]:
            return [IsAdminUser()]
        return [IsAuthenticated(), IsProjectMemberOrAdmin()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["post"])
    def add_member(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get("user_id")
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        project.members.add(user)
        return Response(ProjectSerializer(project).data)

    @action(detail=True, methods=["post"])
    def remove_member(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get("user_id")
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        project.members.remove(user)
        return Response(ProjectSerializer(project).data)
