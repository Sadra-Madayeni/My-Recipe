from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):

    bio = models.CharField(blank=True, null=True)
        
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True, verbose_name="profile pic")

    def __str__(self):
        return self.username
    


class Follow(models.Model):

    follower = models.ForeignKey(User, related_name='following', on_delete=models.CASCADE, verbose_name="Follower")

    following = models.ForeignKey(User, related_name="followers", on_delete=models.CASCADE, verbose_name="Following")

    created_at = models.DateField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['follower', 'following'], name='unique_follow')
        ]