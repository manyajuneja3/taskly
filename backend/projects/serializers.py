from rest_framework import serializers
from .models import Project
from users.serializers import UserSerializer


class ProjectSerializer(serializers.ModelSerializer):
    members    = UserSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)
    task_count = serializers.SerializerMethodField()

    class Meta:
        model  = Project
        fields = ["id", "name", "description", "created_by", "members", "task_count", "created_at"]

    def get_task_count(self, obj):
        return obj.tasks.count()


class ProjectCreateSerializer(serializers.ModelSerializer):
    member_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, required=False,
        queryset=__import__('users').models.User.objects.all(),
        source="members",
    )

    class Meta:
        model  = Project
        fields = ["id", "name", "description", "member_ids"]

    def create(self, validated_data):
        members = validated_data.pop("members", [])
        project = Project.objects.create(**validated_data)
        project.members.set(members)
        return project
