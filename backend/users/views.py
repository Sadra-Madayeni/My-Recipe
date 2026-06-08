from django.shortcuts import render

from rest_framework import generics, viewsets, status, permissions  
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action  

from .models import User, Follow
from .serializers import UserSerializer, RegisterSerializer, FollowSerializer


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):

        if request.method in permissions.SAFE_METHODS:
            return True

        return obj == request.user  


class UserViewSet(viewsets.ModelViewSet):

    serializer_class = UserSerializer
    
    queryset = User.objects.all().order_by('-date_joined')

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'create':  
            permission_classes = [AllowAny]

        elif self.action in ['update', 'partial_update', 'destroy']: 
            permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

        elif self.action == 'me': 
            permission_classes = [IsAuthenticated]

        else:  
            permission_classes = [AllowAny]  

        return [permission() for permission in permission_classes]
    

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request) -> Response:

        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
                                


class RegisterView(generics.CreateAPIView):

    queryset = User.objects.all()

    serializer_class = RegisterSerializer

    permission_classes = [AllowAny]


class FollowViewSet(viewsets.ModelViewSet):
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        query_type = self.request.query_params.get('type', 'following')
        
        if query_type == 'followers':
            
            return self.queryset.filter(following=self.request.user)
        else:
             
            return self.queryset.filter(follower=self.request.user)

    def create(self, request, *args, **kwargs):
      
        following_user_id = request.data.get('following')

        if not following_user_id:

            return Response({"detail": "User to follow is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:

            following_user = User.objects.get(id=following_user_id)

        except User.DoesNotExist:

            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        
        if request.user == following_user:

            return Response({"detail": "You cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            follow = Follow.objects.create(follower=request.user, following=following_user)
            serializer = self.get_serializer(follow)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"detail": f"Could not follow user: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        

    def destroy(self, request, *args, **kwargs):
 
        try:
            instance = self.get_object() 
    
            if instance.follower != request.user:

                return Response({"detail": "You do not have permission to unfollow this user."}, 
                                status=status.HTTP_403_FORBIDDEN)
            
            self.perform_destroy(instance)

            return Response(status=status.HTTP_204_NO_CONTENT)
        
        except Exception as e:
            
            return Response({"detail": f"Could not unfollow user: {e}"}, status=status.HTTP_400_BAD_REQUEST)