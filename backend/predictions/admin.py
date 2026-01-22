from django.contrib import admin
from .models import FitResult

@admin.register(FitResult)
class FitResultAdmin(admin.ModelAdmin):
    list_display = ['outfit', 'user', 'fit_score', 'fit_status', 'created_at']
    list_filter = ['fit_status', 'created_at']
    search_fields = ['user__username', 'outfit__name']