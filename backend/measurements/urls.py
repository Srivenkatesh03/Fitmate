from django.urls import path
from .views import MeasurementViewSet

urlpatterns = [
    path('', MeasurementViewSet.as_view(), name='measurements'),
]