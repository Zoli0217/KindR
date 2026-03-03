from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "username", "first_name", "password"]
    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data.get("email"),
            username=validated_data.get("username"),
            first_name=validated_data.get("first_name"),
            password=validated_data.get("password"),
        )
        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["age", "gender", "bio", "avatar_url", "city", "preferred_gender", "min_age", "max_age", "relationship_type", "is_completed"]