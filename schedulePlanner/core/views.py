from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import timedelta
from .models import Event, AdviceLog, UserProfile
from .serializers import EventSerializer, UserProfileSerializer, UserDashboardSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.dateparse import parse_date
from django.utils import timezone
from datetime import datetime, time
from .models import Event
from .ai_client import call_gemini
from django.utils.timezone import make_aware  # ⭐ 新增这一行
class IsOwner(permissions.BasePermission):
    """
    只允许访问自己的数据
    """
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        # 只返回当前用户的事件，并支持简单的日期过滤
        user = self.request.user
        queryset = Event.objects.filter(user=user).order_by("start_time")

        date = self.request.query_params.get("date")
        start = self.request.query_params.get("start")
        end = self.request.query_params.get("end")

        if date:
            from django.utils.dateparse import parse_date
            from django.utils.timezone import make_aware, datetime

            d = parse_date(date)
            if d:
                start_dt = make_aware(datetime(d.year, d.month, d.day, 0, 0, 0))
                end_dt = make_aware(datetime(d.year, d.month, d.day, 23, 59, 59))
                queryset = queryset.filter(start_time__lte=end_dt, end_time__gte=start_dt)

        # TODO: 后面可以扩展 start/end 的区间过滤
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

def build_schedule_summary(events):
    """
    把当天的事件转成给 Gemini 的结构化文本/摘要
    同时统计不同类型的总时长
    """
    lines = []
    totals = {
        "work": 0,
        "study": 0,
        "fitness": 0,
        "entertainment": 0,
        "personal": 0,
    }

    for e in events:
        duration_hours = (e.end_time - e.start_time).total_seconds() / 3600.0
        totals[e.event_type] += duration_hours
        lines.append(
            f"- [{e.event_type}] {e.start_time.strftime('%H:%M')} - "
            f"{e.end_time.strftime('%H:%M')}: {e.title} ({duration_hours:.1f}h)"
        )

    summary_text = "\n".join(lines)

    stats_text = "\n".join(
        f"{k}: {v:.1f} 小时" for k, v in totals.items() if v > 0
    ) or "暂无统计数据"

    return summary_text, stats_text


# def call_gemini(prompt: str) -> str:
#     """
#     这里先写成占位函数：
#     - 后面你可以接入真正的 Gemini API 调用
#     - 比如用 requests 调 HTTP，或者用官方 SDK
#
#     现在先返回一个假字符串，方便你跑通后端逻辑。
#     """
#     # TODO: 替换成真实 Gemini 调用
#     return "（这里本来是 Gemini 给出的建议，现在是占位文本，请接入真实 API。）"


class DailyAdviceView(APIView):
    def post(self, request):
        date_str = request.data.get("date")
        if not date_str:
            return Response({"detail": "缺少 date 字段"}, status=status.HTTP_400_BAD_REQUEST)

        d = parse_date(date_str)
        if not d:
            return Response({"detail": "日期格式错误，应为 YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)

        start_dt = make_aware(datetime.combine(d, time.min))
        end_dt = make_aware(datetime.combine(d, time.max))

        events = Event.objects.filter(
            user=request.user,
            start_time__lte=end_dt,
            end_time__gte=start_dt,
        ).order_by("start_time")

        summary_text, stats_text = build_schedule_summary(events)

        prompt = f"""
你是一个温和但现实的生活规划助手。

以下是用户在 {date_str} 的日程安排（时间为本地时间）：
{summary_text or "这一天没有安排任何事件。"}

不同类型事件的总时长统计：
{stats_text}

请你从「效率」「休息」「健康」「长期习惯」四个角度，对这一天的安排给出 3-5 条具体建议。
建议以 Markdown 列表格式输出。
"""

        advice_text = call_gemini(prompt)

        # ⭐⭐⭐ 写入 AdviceLog ⭐⭐⭐
        AdviceLog.objects.create(
            user=request.user,
            date=d,
            prompt=prompt,
            response=advice_text,
            model_name="gemini-2.5-flash",
            prompt_version="v1",
        )

        return Response(
            {
                "date": date_str,
                "advice": advice_text,
            },
            status=status.HTTP_200_OK,
        )
class UserDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        # 如果没有 profile，自动创建一个空的
        profile, _ = UserProfile.objects.get_or_create(user=user)

        now = timezone.now()
        seven_days_ago = now - timedelta(days=7)
        thirty_days_ago = now - timedelta(days=30)

        # 事件相关统计
        all_events = Event.objects.filter(user=user)
        recent_events = all_events.filter(start_time__gte=seven_days_ago)

        total_events = all_events.count()
        events_last_7_days = recent_events.count()

        # 按类型统计
        events_by_type = {}
        for etype, _ in Event.EVENT_TYPE_CHOICES:
            events_by_type[etype] = all_events.filter(event_type=etype).count()

        # AI 建议统计
        all_advices = AdviceLog.objects.filter(user=user)
        advices_last_30_days = all_advices.filter(created_at__gte=thirty_days_ago).count()
        total_advices = all_advices.count()

        # 最近活跃时间：取 最近一次事件 或 最近一次 advice 的时间
        last_event = all_events.order_by("-updated_at").first()
        last_advice = all_advices.order_by("-created_at").first()

        candidates = []
        if last_event:
            candidates.append(last_event.updated_at)
        if last_advice:
            candidates.append(last_advice.created_at)
        last_active = max(candidates) if candidates else None

        data = {
            "profile": UserProfileSerializer(profile).data,
            "total_events": total_events,
            "events_last_7_days": events_last_7_days,
            "events_by_type": events_by_type,
            "total_advices": total_advices,
            "advices_last_30_days": advices_last_30_days,
            "last_active": last_active,
        }

        serializer = UserDashboardSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)