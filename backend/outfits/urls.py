from django.urls import path
from .views import (
    OutfitListCreateView, 
    OutfitDetailView,
    FavoriteOutfitsView,
    ToggleFavoriteView,
    MarkAsWornView,
    OutfitStatsView
)

urlpatterns = [
    path('', OutfitListCreateView.as_view(), name='outfit-list-create'),
    path('favorites/', FavoriteOutfitsView.as_view(), name='outfit-favorites'),
    path('stats/', OutfitStatsView.as_view(), name='outfit-stats'),
    path('<int:pk>/', OutfitDetailView.as_view(), name='outfit-detail'),
    path('<int:pk>/favorite/', ToggleFavoriteView.as_view(), name='outfit-toggle-favorite'),
    path('<int:pk>/worn/', MarkAsWornView.as_view(), name='outfit-mark-worn'),
]