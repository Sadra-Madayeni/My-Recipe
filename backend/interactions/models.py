from django.db import models
from django.conf import settings
from recipes.models import Recipe

class Review(models.Model):

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='reviews')

    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)], verbose_name="rating")  

    comment = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

class Bookmark(models.Model):

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='bookmarked_by')

    created_at = models.DateTimeField(auto_now_add=True)
