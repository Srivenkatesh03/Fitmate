from django.contrib import admin
from .models import Outfit

@admin.register(Outfit)
class OutfitAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'uploaded_at']
    search_fields = ['name', 'user__username']