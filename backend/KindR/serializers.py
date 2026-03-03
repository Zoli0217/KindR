from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class RegisterSerializer(serializers.ModelSerializer):
    # profile-related fields included in the payload
    age = serializers.IntegerField(required=False, allow_null=True)
    gender = serializers.CharField(required=False, allow_blank=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    preferred_gender = serializers.CharField(required=False, allow_blank=True)
    min_age = serializers.IntegerField(required=False, allow_null=True)
    max_age = serializers.IntegerField(required=False, allow_null=True)
    relationship_type = serializers.CharField(required=False, allow_blank=True)

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "email",
            "username",
            "first_name",
            "password",
            "age",
            "gender",
            "bio",
            "city",
            "preferred_gender",
            "min_age",
            "max_age",
            "relationship_type",
        ]

    def create(self, validated_data):
        # extract and remove profile-specific data
        profile_data = {}
        for field in [
            "age",
            "gender",
            "bio",
            "city",
            "preferred_gender",
            "min_age",
            "max_age",
            "relationship_type",
        ]:
            if field in validated_data:
                profile_data[field] = validated_data.pop(field)

        user = User.objects.create_user(
            email=validated_data.get("email"),
            username=validated_data.get("username"),
            first_name=validated_data.get("first_name", ""),
            password=validated_data.get("password"),
        )

        # fill in profile fields and save
        profile = user.profile
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()

        return user
