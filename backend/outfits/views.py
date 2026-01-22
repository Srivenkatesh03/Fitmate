from rest_framework import generics, status, filters, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q, Count
from .models import Outfit
from .serializers import OutfitSerializer
from common.utils.image_processing import process_outfit_image


class OutfitListCreateView(generics.ListCreateAPIView):
    serializer_class = OutfitSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'brand', 'color']
    ordering_fields = ['uploaded_at', 'name', 'times_worn']
    ordering = ['-uploaded_at']
    
    def get_queryset(self):
        queryset = Outfit.objects.filter(user=self.request.user)
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by occasion
        occasion = self.request.query_params.get('occasion', None)
        if occasion:
            queryset = queryset.filter(occasion=occasion)
        
        # Filter by season
        season = self.request.query_params.get('season', None)
        if season:
            queryset = queryset.filter(season=season)
        
        # Filter favorites
        is_favorite = self.request.query_params.get('is_favorite', None)
        if is_favorite is not None:
            queryset = queryset.filter(is_favorite=is_favorite.lower() == 'true')
        
        return queryset
    
    def perform_create(self, serializer):
        # Get the uploaded image
        image = self.request.FILES.get('image')
        
        if image:
            # Process image (validate, compress, create thumbnail)
            compressed_image, thumbnail, error = process_outfit_image(image)
            
            if error:
                raise serializers.ValidationError({'image': error})
            
            # Save with processed images
            serializer.save(
                user=self.request.user,
                image=compressed_image,
                thumbnail=thumbnail
            )
        else:
            serializer.save(user=self.request.user)


class OutfitDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OutfitSerializer
    
    def get_queryset(self):
        return Outfit.objects.filter(user=self.request.user)
    
    def perform_update(self, serializer):
        # Check if image is being updated
        image = self.request.FILES.get('image')
        
        if image:
            # Process new image
            compressed_image, thumbnail, error = process_outfit_image(image)
            
            if error:
                raise serializers.ValidationError({'image': error})
            
            serializer.save(image=compressed_image, thumbnail=thumbnail)
        else:
            serializer.save()


class FavoriteOutfitsView(generics.ListAPIView):
    """List all favorite outfits"""
    serializer_class = OutfitSerializer
    
    def get_queryset(self):
        return Outfit.objects.filter(user=self.request.user, is_favorite=True)


class ToggleFavoriteView(APIView):
    """Toggle favorite status of an outfit"""
    
    def post(self, request, pk):
        try:
            outfit = Outfit.objects.get(pk=pk, user=request.user)
            outfit.is_favorite = not outfit.is_favorite
            outfit.save()
            
            return Response({
                'id': outfit.id,
                'is_favorite': outfit.is_favorite
            }, status=status.HTTP_200_OK)
        except Outfit.DoesNotExist:
            return Response(
                {'error': 'Outfit not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class MarkAsWornView(APIView):
    """Mark outfit as worn (increment counter)"""
    
    def post(self, request, pk):
        try:
            outfit = Outfit.objects.get(pk=pk, user=request.user)
            outfit.times_worn += 1
            outfit.save()
            
            return Response({
                'id': outfit.id,
                'times_worn': outfit.times_worn
            }, status=status.HTTP_200_OK)
        except Outfit.DoesNotExist:
            return Response(
                {'error': 'Outfit not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class OutfitStatsView(APIView):
    """Get statistics about user's wardrobe"""
    
    def get(self, request):
        outfits = Outfit.objects.filter(user=request.user)
        
        # Get category breakdown
        by_category = {}
        for choice in Outfit.CATEGORY_CHOICES:
            count = outfits.filter(category=choice[0]).count()
            if count > 0:
                by_category[choice[0]] = count
        
        # Get occasion breakdown
        by_occasion = {}
        for choice in Outfit.OCCASION_CHOICES:
            count = outfits.filter(occasion=choice[0]).count()
            if count > 0:
                by_occasion[choice[0]] = count
        
        # Get season breakdown
        by_season = {}
        for choice in Outfit.SEASON_CHOICES:
            count = outfits.filter(season=choice[0]).count()
            if count > 0:
                by_season[choice[0]] = count
        
        # Get most worn outfit
        most_worn = outfits.filter(times_worn__gt=0).order_by('-times_worn').first()
        most_worn_data = None
        if most_worn:
            most_worn_data = {
                'id': most_worn.id,
                'name': most_worn.name,
                'times_worn': most_worn.times_worn
            }
        
        return Response({
            'total_outfits': outfits.count(),
            'favorites_count': outfits.filter(is_favorite=True).count(),
            'by_category': by_category,
            'by_occasion': by_occasion,
            'by_season': by_season,
            'most_worn': most_worn_data
        })