from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import Outfit
from .serializers import OutfitSerializer
from common.utils.image_processing import create_thumbnail, compress_image, validate_image
from django.core.exceptions import ValidationError

class OutfitListCreateView(generics.ListCreateAPIView):
    serializer_class = OutfitSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'occasion', 'season', 'is_favorite', 'brand']
    search_fields = ['name', 'description', 'brand', 'color']
    ordering_fields = ['uploaded_at', 'updated_at', 'name', 'times_worn']
    ordering = ['-uploaded_at']
    
    def get_queryset(self):
        return Outfit.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Validate and process image
        image = self.request.FILES.get('image')
        if image:
            try:
                validate_image(image)
                # Compress image
                compressed_image = compress_image(image)
                # Create thumbnail
                thumbnail = create_thumbnail(image)
                serializer.save(user=self.request.user, image=compressed_image, thumbnail=thumbnail)
            except ValidationError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer.save(user=self.request.user)

class OutfitDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OutfitSerializer
    
    def get_queryset(self):
        return Outfit.objects.filter(user=self.request.user)