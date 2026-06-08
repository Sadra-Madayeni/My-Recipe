from rest_framework import viewsets, permissions, status, serializers
from rest_framework.response import Response
from users.views import IsOwnerOrReadOnly 

from .models import Review, Bookmark
from .serializers import ReviewSerializer, BookmarkSerializer

class ReviewViewSet(viewsets.ModelViewSet):

    queryset = Review.objects.all().order_by('-created_at')

    serializer_class = ReviewSerializer

    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]


    def get_queryset(self):

        queryset = super().get_queryset()

        recipe_id = self.request.query_params.get('recipe', None)

        if recipe_id:
            queryset = queryset.filter(recipe__id=recipe_id)

        return queryset

    def perform_create(self, serializer):
       
        serializer.save(user=self.request.user)

class BookmarkViewSet(viewsets.ModelViewSet):

    queryset = Bookmark.objects.all().order_by('-created_at')

    serializer_class = BookmarkSerializer

    permission_classes = [permissions.IsAuthenticated] 

    def get_queryset(self):

        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):

        recipe_id = self.request.data.get('recipe')
        
        if Bookmark.objects.filter(user=self.request.user, recipe__id=recipe_id).exists():
            raise serializers.ValidationError({"detail": "You have already bookmarked this recipe."})
        
        serializer.save(user=self.request.user)
