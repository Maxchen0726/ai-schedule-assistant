from django.db import models

from django.db import models
from django.contrib.auth.models import User


class RecurrenceRule(models.Model):
    FREQ_CHOICES = [
        ("daily", "Daily"),
        ("weekly", "Weekly"),
        ("monthly", "Monthly"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recurrence_rules")
    freq = models.CharField(max_length=20, choices=FREQ_CHOICES)
    interval = models.PositiveIntegerField(default=1)  # 每多少天/周/月
    by_day = models.CharField(max_length=50, blank=True, null=True)  # 例如 "MO,TU,FR"
    by_month_day = models.IntegerField(blank=True, null=True)        # 例如 15
    end_date = models.DateField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.freq} every {self.interval}"


class Event(models.Model):
    EVENT_TYPE_CHOICES = [
        ("work", "Work"),
        ("study", "Study"),
        ("fitness", "Fitness"),
        ("entertainment", "Entertainment"),
        ("personal", "Personal"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="events")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_all_day = models.BooleanField(default=False)

    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES, default="personal")
    recurrence_rule = models.ForeignKey(
        RecurrenceRule,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="events",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.start_time} - {self.end_time})"

class AdviceLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()  # 针对哪一天的日程生成建议
    created_at = models.DateTimeField(auto_now_add=True)

    model_name = models.CharField(max_length=100, default="gemini-2.5-flash")
    prompt_version = models.CharField(max_length=20, default="v1")

    prompt = models.TextField()      # 发送给模型的 prompt
    response = models.TextField()    # 模型的返回内容

    rating = models.IntegerField(null=True, blank=True)  # 未来可加：1~5 评分

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.created_at}"
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    display_name = models.CharField(max_length=100, blank=True)
    timezone = models.CharField(max_length=64, default="Europe/London")
    bio = models.TextField(blank=True)  # 简短自我介绍

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.display_name or self.user.username