from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import FitResult
from .serializers import FitResultSerializer
from .utils import calculate_fit_score
from measurements.models import Measurement
from outfits.models import Outfit

class PredictFitView(APIView):
    def post(self, request):
        outfit_id = request.data.get('outfit_id')
        
        if not outfit_id:
            return Response(
                {'error': 'outfit_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            outfit = Outfit.objects.get(id=outfit_id, user=request.user)
            measurement = Measurement.objects.get(user=request.user)
        except Outfit.DoesNotExist:
            return Response(
                {'error': 'Outfit not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Measurement.DoesNotExist:
            return Response(
                {'error': 'Please add your measurements first'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get measurements as dict
        user_meas = {
            'chest': float(measurement.chest or 0),
            'waist': float(measurement.waist or 0),
            'hips': float(measurement.hips or 0),
        }
        
        outfit_meas = {
            'chest': float(outfit.outfit_chest or 0),
            'waist': float(outfit.outfit_waist or 0),
            'hips': float(outfit.outfit_hips or 0),
        }
        
        # Calculate fit
        score, fit_status, recommendations = calculate_fit_score(user_meas, outfit_meas)
        
        # Save result
        fit_result = FitResult.objects.create(
            user=request.user,
            outfit=outfit,
            fit_score=score,
            fit_status=fit_status,
            recommendations=recommendations
        )
        
        serializer = FitResultSerializer(fit_result)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class FitResultListView(generics.ListAPIView):
    serializer_class = FitResultSerializer
    
    def get_queryset(self):
        return FitResult.objects.filter(user=self.request.user).order_by('-created_at')