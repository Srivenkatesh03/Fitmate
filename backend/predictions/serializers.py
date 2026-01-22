from rest_framework import serializers
from .models import FitResult
from outfits.serializers import OutfitSerializer

class FitResultSerializer(serializers.ModelSerializer):
    outfit_detail = OutfitSerializer(source='outfit', read_only=True)
    
    class Meta:
        model = FitResult
        fields = '__all__'
        read_only_fields = ['user', 'created_at']