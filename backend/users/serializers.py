from rest_framework import serializers
from .models import User, Follow


class UserSerializer(serializers.ModelSerializer):

    followers_count = serializers.SerializerMethodField()

    following_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'bio', 'profile_picture', 'first_name', 'last_name', 'followers_count', 'following_count']
        read_only_fields = ['email']

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:

        model = User

        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):

        if data['password'] != data['password2']:

            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        return data
    
    def create(self, validated_data):

        user = User.objects.create_user(

            username=validated_data['username'],

            email=validated_data['email'],

            password=validated_data['password']
        )

        return user
    
class FollowSerializer(serializers.ModelSerializer):

    follower_username = serializers.CharField(source='follower.username', read_only=True)

    following_username = serializers.CharField(source='following.username', read_only=True)

    class Meta:

        model = Follow

        fields = ['id', 'follower', 'following', 'follower_username', 'following_username', 'created_at']
        
        read_only_fields = ['created_at']