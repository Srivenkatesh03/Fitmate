from django.urls import path
from .views import OutfitListCreateView, OutfitDetailView

urlpatterns = [
    path('', OutfitListCreateView.as_view(), name='outfit-list-create'),
    path('<int:pk>/', OutfitDetailView.as_view(), name='outfit-detail'),
]