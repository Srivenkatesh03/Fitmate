from django.urls import path
from .views import MeasurementCreateView, MeasurementDetailView

urlpatterns = [
    path('', MeasurementDetailView.as_view(), name='measurement-detail'),
]