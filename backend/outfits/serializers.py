from rest_framework import serializers
from .models import Outfit, OutfitTag, UserPreferences

class OutfitTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = OutfitTag
        fields = ['id', 'tag']
        read_only_fields = ['id']


class OutfitSerializer(serializers.ModelSerializer):
    tags = OutfitTagSerializer(many=True, read_only=True)
    
    class Meta:
        model = Outfit
        fields = [
            'id', 'name', 'description', 'image', 'thumbnail', 'category', 
            'occasion', 'brand', 'color', 'season', 'outfit_length', 
            'outfit_chest', 'outfit_waist', 'outfit_hips', 'outfit_shoulder',
            'is_favorite', 'is_public', 'times_worn', 'uploaded_at', 
            'updated_at', 'tags'
        ]
        read_only_fields = ['id', 'user', 'thumbnail', 'uploaded_at', 'updated_at']


class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = [
            'id', 'preferred_colors', 'preferred_brands', 'preferred_styles',
            'notification_enabled', 'theme', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']