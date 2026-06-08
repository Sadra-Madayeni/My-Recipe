from django.contrib import admin
from .models import Category, Ingredient, Recipe, RecipeIngredient

class RecipeIngredientInline(admin.TabularInline):
    model = RecipeIngredient
    extra = 1

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    inlines = [RecipeIngredientInline]
    list_display = ('title', 'author', 'category', 'created_at')

admin.site.register(Category)
admin.site.register(Ingredient)
