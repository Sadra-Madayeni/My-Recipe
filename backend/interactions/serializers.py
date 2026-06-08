from rest_framework import serializers
from .models import Review, Bookmark
from users.serializers import UserSerializer  

class ReviewSerializer(serializers.ModelSerializer):

    user = serializers.ReadOnlyField(source='user.username')  

    recipe_title = serializers.CharField(source='recipe.title', read_only=True) 

    class Meta:
        model = Review
        fields = ['id', 'user', 'recipe', 'recipe_title', 'rating', 'comment', 'created_at']
        read_only_fields = ['user', 'created_at']  

class BookmarkSerializer(serializers.ModelSerializer):

    user = serializers.ReadOnlyField(source='user.username')
    
    recipe_title = serializers.CharField(source='recipe.title', read_only=True)

    class Meta:
        model = Bookmark
        fields = ['id', 'user', 'recipe', 'recipe_title', 'created_at']
        read_only_fields = ['user', 'created_at']
