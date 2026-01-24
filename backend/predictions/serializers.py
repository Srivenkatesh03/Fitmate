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
                chest_diff = float(outfit.outfit_chest - user_measurements.chest)
                breakdown['chest'] = {
                    'user': float(user_measurements.chest),
                    'outfit': float(outfit.outfit_chest),
                    'diff': chest_diff,
                    'status': self._get_fit_status(chest_diff)
                }
            
            # Calculate waist difference
            if user_measurements.waist and outfit.outfit_waist:
                waist_diff = float(outfit.outfit_waist - user_measurements.waist)
                breakdown['waist'] = {
                    'user': float(user_measurements.waist),
                    'outfit': float(outfit.outfit_waist),
                    'diff': waist_diff,
                    'status': self._get_fit_status(waist_diff)
                }
            
            # Calculate hips difference
            if user_measurements.hips and outfit.outfit_hips:
                hips_diff = float(outfit.outfit_hips - user_measurements.hips)
                breakdown['hips'] = {
                    'user': float(user_measurements.hips),
                    'outfit': float(outfit.outfit_hips),
                    'diff': hips_diff,
                    'status': self._get_fit_status(hips_diff)
                }
            
            return breakdown if breakdown else None
        except Exception:
            return None
    
    def _get_fit_status(self, diff: float) -> str:
        """Determine fit status based on difference"""
        abs_diff = abs(diff)
        if abs_diff < 2:
            return 'perfect'
        elif abs_diff < 5:
            return 'acceptable'
        else:
            return 'poor'