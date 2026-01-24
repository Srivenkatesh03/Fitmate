from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from .models import Measurement
from .serializers import MeasurementSerializer
from .body_shape import detect_body_shape


class MeasurementViewSet(generics.GenericAPIView):
    """
    Combined view for handling measurements at the root path.
    Handles GET, POST, PUT, and PATCH requests.
    """
    serializer_class = MeasurementSerializer
    
    def get(self, request):
        """Get user's measurements"""
        try:
            measurement = Measurement.objects.get(user=request.user)
            serializer = self.get_serializer(measurement)
            return Response(serializer.data)
        except Measurement.DoesNotExist:
            raise NotFound('Measurements not found. Please create measurements first.')
    
    def post(self, request):
        """Create new measurements"""
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
    
    def put(self, request):
        """Update existing measurements"""
        try:
            measurement = Measurement.objects.get(user=request.user)
        except Measurement.DoesNotExist:
            return Response(
                {'error': 'Measurements not found. Use POST to create.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = self.get_serializer(measurement, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        # Auto-detect body shape if not provided
        if 'body_shape' not in request.data:
            body_shape = detect_body_shape(serializer.validated_data)
            if body_shape:
                serializer.validated_data['body_shape'] = body_shape
        
        serializer.save()
        return Response(serializer.data)
    
    def patch(self, request):
        """Partial update of measurements"""
        return self.put(request)


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