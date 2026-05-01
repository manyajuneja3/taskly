from django.db import models
from django.conf import settings
from django.utils import timezone


class Task(models.Model):
    class Status(models.TextChoices):
        TODO        = "todo",        "To Do"
        IN_PROGRESS = "in_progress", "In Progress"
        DONE        = "done",        "Done"

    project     = models.ForeignKey("projects.Project", on_delete=models.CASCADE, related_name="tasks")
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name="tasks"
    )
    title       = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    status      = models.CharField(max_length=20, choices=Status.choices, default=Status.TODO)
    deadline    = models.DateTimeField(null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    @property
    def is_overdue(self):
        return bool(self.deadline and self.status != self.Status.DONE and self.deadline < timezone.now())

    def __str__(self):
        return self.title
