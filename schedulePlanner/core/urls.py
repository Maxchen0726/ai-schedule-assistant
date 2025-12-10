from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, UserDashboardView
from .views import EventViewSet, DailyAdviceView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')

urlpatterns = [
    # JWT 登录相关
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('ai/daily-advice/', DailyAdviceView.as_view(), name='daily-advice'),

    path('me/dashboard/', UserDashboardView.as_view(), name='user-dashboard'),
    # 事件 CRUD
    path('', include(router.urls)),
]