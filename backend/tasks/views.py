from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone

from projects.permissions import IsAdminUser
from .models import Task
from .serializers import TaskSerializer, TaskCreateSerializer, TaskStatusUpdateSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()

    def get_queryset(self):
        user = self.request.user
        qs   = Task.objects.select_related("assigned_to", "project")
        if not user.is_admin:
            qs = qs.filter(project__members=user)
        project_id = self.request.query_params.get("project")
        if project_id:
            qs = qs.filter(project_id=project_id)
        status_filter = self.request.query_params.get("status")
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    def get_serializer_class(self):
        if self.action in ["update", "partial_update"] and set(self.request.data.keys()) == {"status"}:
            return TaskStatusUpdateSerializer
        if self.action in ["create", "update", "partial_update"]:
            return TaskCreateSerializer
        return TaskSerializer

    def get_permissions(self):
        if self.action in ["create", "destroy"]:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    @action(detail=False, methods=["get"])
    def dashboard(self, request):
        user = request.user
        qs   = Task.objects.all() if user.is_admin else Task.objects.filter(project__members=user)
        now  = timezone.now()
        return Response({
            "total_tasks": qs.count(),
            "by_status": {
                "todo":        qs.filter(status="todo").count(),
                "in_progress": qs.filter(status="in_progress").count(),
                "done":        qs.filter(status="done").count(),
            },
            "overdue_count": qs.filter(deadline__lt=now).exclude(status="done").count(),
            "my_tasks": TaskSerializer(
                qs.filter(assigned_to=user).order_by("deadline")[:10],
                many=True
            ).data,
        })
