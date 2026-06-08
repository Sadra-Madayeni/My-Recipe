from rest_framework.routers import DefaultRouter
from .views import ReviewViewSet, BookmarkViewSet

router = DefaultRouter()

router.register(r'reviews', ReviewViewSet, basename='review')

router.register(r'bookmarks', BookmarkViewSet, basename='bookmark')

urlpatterns = router.urls
