from django.urls import path
from .views import PredictFitView, FitResultListView

urlpatterns = [
    path('predict/', PredictFitView.as_view(), name='predict-fit'),
    path('results/', FitResultListView.as_view(), name='fit-results'),
]