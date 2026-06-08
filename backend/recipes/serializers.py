import json
from rest_framework import serializers
from .models import Recipe, Category, Ingredient, RecipeIngredient

class CategorySerializer(serializers.ModelSerializer):

    class Meta:

        model = Category
        fields = ['id', 'name']

class IngredientSerializer(serializers.ModelSerializer):

    class Meta:

        model = Ingredient
        fields = ['id', 'name']

class RecipeIngredientSerializer(serializers.ModelSerializer):

    ingredient_name = serializers.CharField(source='ingredient.name', read_only=True)

    class Meta:
        model = RecipeIngredient
        fields = ['id', 'ingredient', 'ingredient_name', 'quantity']

class RecipeSerializer(serializers.ModelSerializer):

    author = serializers.ReadOnlyField(source='author.username')  

    author_id = serializers.ReadOnlyField(source='author.id') 

    category_name = serializers.CharField(source='category.name', read_only=True) 

    ingredients = RecipeIngredientSerializer(many=True, required=False)  

    class Meta:
        model = Recipe
        fields = [
            'id', 'title', 'description', 'cook_time', 'image', 'created_at',
            'author', 'author_id', 'category', 'category_name', 'ingredients'  
        ]

        read_only_fields = ['created_at', 'author', 'author_id']

    def create(self, validated_data):

        request = self.context.get('request')

        ingredients_data = request.data.get('ingredients', '[]')
        
        if isinstance(ingredients_data, str):
            try:
                ingredients_data = json.loads(ingredients_data)

            except ValueError:
                ingredients_data = []

        validated_data.pop('ingredients', None)
        
        recipe = Recipe.objects.create(**validated_data)
        
        for item in ingredients_data:
            ingredient_id = item.get('ingredient')
            quantity = item.get('quantity')

            if ingredient_id and quantity:

                ingredient_obj = Ingredient.objects.get(id=ingredient_id)

                RecipeIngredient.objects.create(
                    recipe=recipe, 
                    ingredient=ingredient_obj, 
                    quantity=quantity
                )
            
        return recipe
    
    def update(self, instance, validated_data):

        request = self.context.get('request')
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if request and 'ingredients' in request.data:
            ingredients_data = request.data.get('ingredients', '[]')
            
            if isinstance(ingredients_data, str):
                try:
                    ingredients_data = json.loads(ingredients_data)
                except ValueError:
                    ingredients_data = []

            instance.ingredients.all().delete()
            
            for item in ingredients_data:
                ingredient_id = item.get('ingredient')
                quantity = item.get('quantity')
                if ingredient_id and quantity:
                    ingredient_obj = Ingredient.objects.get(id=ingredient_id)
                    RecipeIngredient.objects.create(
                        recipe=instance, 
                        ingredient=ingredient_obj, 
                        quantity=quantity
                    )
                    
        return instance