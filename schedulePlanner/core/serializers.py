from rest_framework import serializers
from .models import Event, RecurrenceRule, UserProfile


class RecurrenceRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurrenceRule
        fields = "__all__"
        read_only_fields = ("user", "created_at")


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"
        read_only_fields = ("user", "created_at", "updated_at")
class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = UserProfile
        fields = ["username", "email", "display_name", "timezone", "bio", "created_at"]


class UserDashboardSerializer(serializers.Serializer):
    profile = UserProfileSerializer()
    total_events = serializers.IntegerField()
    events_last_7_days = serializers.IntegerField()
    events_by_type = serializers.DictField(child=serializers.IntegerField())

    total_advices = serializers.IntegerField()
    advices_last_30_days = serializers.IntegerField()
    last_active = serializers.DateTimeField(allow_null=True)