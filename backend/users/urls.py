from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, FollowViewSet, RegisterView

router = DefaultRouter()

router.register(r'profiles', UserViewSet, basename='user') 

router.register(r'follows', FollowViewSet, basename='follow') 

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),  
    path('', include(router.urls)),
]