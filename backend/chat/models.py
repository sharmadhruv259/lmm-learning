from django.db import models


class Conversation(models.Model):
    title = models.CharField(max_length=120, default="New chat")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]


class Message(models.Model):
    conversation = models.ForeignKey(
        Conversation, related_name="messages", on_delete=models.CASCADE
    )
    role = models.CharField(max_length=10)  # "user" or "assistant"
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at", "id"]


class Profile(models.Model):
    """Single-user profile + personalization (no login yet)."""

    TONES = [
        ("balanced", "Balanced"),
        ("concise", "Concise"),
        ("friendly", "Friendly"),
        ("detailed", "Detailed"),
    ]
    THEMES = [("dark", "Dark"), ("light", "Light")]

    name = models.CharField(max_length=80, default="You")
    tone = models.CharField(max_length=20, choices=TONES, default="balanced")
    custom_instructions = models.TextField(blank=True)
    theme = models.CharField(max_length=10, choices=THEMES, default="dark")

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj