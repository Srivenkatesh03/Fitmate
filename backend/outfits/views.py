from rest_framework import generics
from .models import Outfit
from .serializers import OutfitSerializer

class OutfitListCreateView(generics.ListCreateAPIView):
    serializer_class = OutfitSerializer
    
    def get_queryset(self):
        return Outfit.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class OutfitDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OutfitSerializer
    
    def get_queryset(self):
        return Outfit.objects.filter(user=self.request.user)