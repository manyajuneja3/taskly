from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN  = "admin",  "Admin"
        MEMBER = "member", "Member"

    email = models.EmailField(unique=True)
    role  = models.CharField(max_length=10, choices=Role.choices, default=Role.MEMBER)

    USERNAME_FIELD  = "email"
    REQUIRED_FIELDS = ["username"]

    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN

    def __str__(self):
        return f"{self.username} ({self.role})"
