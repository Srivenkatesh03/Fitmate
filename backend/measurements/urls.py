from django.urls import path
from .views import MeasurementCreateView, MeasurementDetailView

urlpatterns = [
    path('create/', MeasurementCreateView.as_view(), name='measurement-create'),
    path('me/', MeasurementDetailView.as_view(), name='measurement-detail'),
]