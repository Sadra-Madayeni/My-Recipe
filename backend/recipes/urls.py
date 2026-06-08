from rest_framework.routers import DefaultRouter
from .views import RecipeViewSet, CategoryViewSet, IngredientViewSet

router = DefaultRouter()

router.register(r'recipes', RecipeViewSet, basename='recipe')

router.register(r'categories', CategoryViewSet, basename='category')

router.register(r'ingredients', IngredientViewSet, basename='ingredient')

urlpatterns = router.urls
