from django.db import models
from django.conf import settings

class Category(models.Model):

    name = models.CharField(max_length=100, verbose_name="category name")

    def __str__(self):
        return self.name
    
    

class Ingredient(models.Model):
    
    name = models.CharField(max_length=100, verbose_name="ingredient name")

    def __str__(self):
        return self.name
    
class Recipe(models.Model):

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recipes')

    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='recipes')

    title = models.CharField(max_length=200, verbose_name="title")

    description = models.TextField(verbose_name="description")

    cook_time = models.IntegerField(verbose_name="time to coock ( minutes )")

    image = models.ImageField(upload_to='recipes/images/', null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class RecipeIngredient(models.Model):

    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients')

    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    
    quantity = models.CharField(max_length=50, verbose_name="quantity like 200 grams")