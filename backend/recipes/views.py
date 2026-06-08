from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter  
from users.views import IsOwnerOrReadOnly 

from .models import Recipe, Category, Ingredient
from .serializers import RecipeSerializer, CategorySerializer, IngredientSerializer

class CategoryViewSet(viewsets.ModelViewSet):

    queryset = Category.objects.all().order_by('name')

    serializer_class = CategorySerializer

    permission_classes = [permissions.IsAdminUser | permissions.IsAuthenticatedOrReadOnly]

    filter_backends = [SearchFilter, OrderingFilter]

    search_fields = ['name']

class IngredientViewSet(viewsets.ModelViewSet):

    queryset = Ingredient.objects.all().order_by('name')

    serializer_class = IngredientSerializer

    permission_classes = [permissions.IsAdminUser | permissions.IsAuthenticatedOrReadOnly]

    filter_backends = [SearchFilter, OrderingFilter]

    search_fields = ['name']

class RecipeViewSet(viewsets.ModelViewSet):

    queryset = Recipe.objects.select_related('author', 'category').prefetch_related('ingredients__ingredient').order_by('-created_at')

    serializer_class = RecipeSerializer
    
    permission_classes = [IsOwnerOrReadOnly | permissions.IsAdminUser]

    
    filter_backends = [SearchFilter, OrderingFilter]
    
 
    search_fields = ['title', 'description', 'ingredients__ingredient__name'] 
    
 
    ordering_fields = ['created_at', 'cook_time', 'title'] 

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
