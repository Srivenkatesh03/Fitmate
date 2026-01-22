from django.contrib import admin
from .models import Outfit, OutfitTag, UserPreferences

@admin.register(Outfit)
class OutfitAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'category', 'occasion', 'is_favorite', 'times_worn', 'uploaded_at']
    list_filter = ['category', 'occasion', 'season', 'is_favorite', 'is_public']
    search_fields = ['name', 'user__username', 'brand', 'color']
    readonly_fields = ['uploaded_at', 'updated_at']


@admin.register(OutfitTag)
class OutfitTagAdmin(admin.ModelAdmin):
    list_display = ['outfit', 'tag']
    search_fields = ['outfit__name', 'tag']


@admin.register(UserPreferences)
class UserPreferencesAdmin(admin.ModelAdmin):
    list_display = ['user', 'theme', 'notification_enabled']
    search_fields = ['user__username']