from django.urls import path
from .views import RecommendedOutfitsView, SimilarOutfitsView

urlpatterns = [
    path('outfits/', RecommendedOutfitsView.as_view(), name='recommended-outfits'),
    path('outfits/<int:pk>/similar/', SimilarOutfitsView.as_view(), name='similar-outfits'),
]
