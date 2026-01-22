from rest_framework import serializers
from .models import Outfit

class OutfitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Outfit
        fields = '__all__'
        read_only_fields = ['user', 'uploaded_at']