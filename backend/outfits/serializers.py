from rest_framework import serializers
from .models import Outfit, OutfitTag

class OutfitTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = OutfitTag
        fields = ['tag']


class OutfitSerializer(serializers.ModelSerializer):
    tags = OutfitTagSerializer(many=True, read_only=True)
    
    class Meta:
        model = Outfit
        fields = '__all__'
        read_only_fields = ['user', 'uploaded_at', 'updated_at', 'thumbnail']