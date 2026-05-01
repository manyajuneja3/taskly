from rest_framework import serializers
from django.utils import timezone
from users.serializers import UserSerializer
from users.models import User
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(read_only=True)
    is_overdue  = serializers.ReadOnlyField()

    class Meta:
        model  = Task
        fields = ["id", "project", "title", "description", "status",
                  "assigned_to", "deadline", "is_overdue", "created_at", "updated_at"]


class TaskCreateSerializer(serializers.ModelSerializer):
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source="assigned_to",
        required=False, allow_null=True,
    )
    is_overdue = serializers.ReadOnlyField()

    class Meta:
        model  = Task
        fields = ["id", "project", "title", "description", "status",
                  "assigned_to_id", "deadline", "is_overdue"]

    def validate_deadline(self, value):
        if value and value < timezone.now():
            raise serializers.ValidationError("Deadline must be in the future.")
        return value

    def validate(self, data):
        project  = data.get("project")
        assignee = data.get("assigned_to")
        if assignee and project and not project.members.filter(id=assignee.id).exists():
            raise serializers.ValidationError("Assigned user is not a member of this project.")
        return data


class TaskStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Task
        fields = ["status"]
