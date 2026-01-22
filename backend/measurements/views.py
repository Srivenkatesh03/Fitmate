from rest_framework import generics, status
from rest_framework.response import Response
from .models import Measurement
from .serializers import MeasurementSerializer
from .body_shape import detect_body_shape

class MeasurementCreateView(generics.CreateAPIView):
    serializer_class = MeasurementSerializer
    
    def create(self, request, *args, **kwargs):
        # Check if user already has measurements
        if Measurement.objects.filter(user=request.user).exists():
            return Response(
                {'error': 'Measurements already exist. Use PUT to update.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Auto-detect body shape if not provided
        if not request.data.get('body_shape'):
            body_shape = detect_body_shape(serializer.validated_data)
            if body_shape:
                serializer.validated_data['body_shape'] = body_shape
        
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class MeasurementDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = MeasurementSerializer
    
    def get_object(self):
        return Measurement.objects.get(user=self.request.user)
    
    def perform_update(self, serializer):
        # Auto-detect body shape if not provided
        if 'body_shape' not in self.request.data:
            body_shape = detect_body_shape(serializer.validated_data)
            if body_shape:
                serializer.validated_data['body_shape'] = body_shape
        
        serializer.save()