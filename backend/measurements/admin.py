from django.contrib import admin
from .models import Measurement

@admin.register(Measurement)
class MeasurementAdmin(admin.ModelAdmin):
    list_display = ['user', 'height', 'weight', 'gender', 'created_at']
    search_fields = ['user__username']