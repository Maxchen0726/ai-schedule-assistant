from django.contrib import admin

from core.models import AdviceLog


# Register your models here.
@admin.register(AdviceLog)
class AdviceLogAdmin(admin.ModelAdmin):
    list_display = ("user", "date", "created_at", "model_name", "prompt_version")
    search_fields = ("user__username", "date", "prompt")
    list_filter = ("model_name", "prompt_version", "created_at")