from rest_framework import serializers
from .models import FitResult
from outfits.serializers import OutfitSerializer

class FitResultSerializer(serializers.ModelSerializer):
    outfit_detail = OutfitSerializer(source='outfit', read_only=True)
    measurement_breakdown = serializers.SerializerMethodField()
    
    class Meta:
        model = FitResult
        fields = '__all__'
        read_only_fields = ['user', 'created_at']
    
    def get_measurement_breakdown(self, obj):
        """Calculate measurement differences for detailed breakdown"""
        try:
            user_measurements = obj.user.measurement
            outfit = obj.outfit
            
            breakdown = {}
            
            # Calculate chest difference
            if user_measurements.chest and outfit.outfit_chest:
                breakdown['chest'] = {
                    'user': float(user_measurements.chest),
                    'outfit': float(outfit.outfit_chest),
                    'diff': float(outfit.outfit_chest - user_measurements.chest),
                    'status': 'good'
                }
            
            # Calculate waist difference
            if user_measurements.waist and outfit.outfit_waist:
                breakdown['waist'] = {
                    'user': float(user_measurements.waist),
                    'outfit': float(outfit.outfit_waist),
                    'diff': float(outfit.outfit_waist - user_measurements.waist),
                    'status': 'good'
                }
            
            # Calculate hips difference
            if user_measurements.hips and outfit.outfit_hips:
                breakdown['hips'] = {
                    'user': float(user_measurements.hips),
                    'outfit': float(outfit.outfit_hips),
                    'diff': float(outfit.outfit_hips - user_measurements.hips),
                    'status': 'good'
                }
            
            return breakdown if breakdown else None
        except Exception:
            return None