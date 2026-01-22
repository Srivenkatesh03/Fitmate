from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Outfit(models.Model):
    CATEGORY_CHOICES = [
        ('top', 'Top'),
        ('bottom', 'Bottom'),
        ('dress', 'Dress'),
        ('full_outfit', 'Full Outfit'),
    ]
    
    OCCASION_CHOICES = [
        ('casual', 'Casual'),
        ('formal', 'Formal'),
        ('sports', 'Sports'),
        ('party', 'Party'),
        ('work', 'Work'),
    ]
    
    SEASON_CHOICES = [
        ('spring', 'Spring'),
        ('summer', 'Summer'),
        ('fall', 'Fall'),
        ('winter', 'Winter'),
        ('all_season', 'All Season'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='outfits')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='outfits/')
    thumbnail = models.ImageField(upload_to='outfits/thumbnails/', null=True, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='full_outfit')
    occasion = models.CharField(max_length=20, choices=OCCASION_CHOICES, null=True, blank=True)
    brand = models.CharField(max_length=100, blank=True)
    color = models.CharField(max_length=50, blank=True)
    season = models.CharField(max_length=20, choices=SEASON_CHOICES, blank=True)
    
    # Measurements
    outfit_length = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    outfit_chest = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    outfit_waist = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    outfit_hips = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    outfit_shoulder = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    # Metadata
    is_favorite = models.BooleanField(default=False)
    is_public = models.BooleanField(default=False)
    times_worn = models.IntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.name} - {self.user.username}"


class OutfitTag(models.Model):
    """Tags for categorizing and organizing outfits"""
    outfit = models.ForeignKey(Outfit, on_delete=models.CASCADE, related_name='tags')
    tag = models.CharField(max_length=50)
    
    class Meta:
        unique_together = ('outfit', 'tag')
    
    def __str__(self):
        return f"{self.outfit.name} - {self.tag}"


class UserPreferences(models.Model):
    """User preferences for personalization"""
    THEME_CHOICES = [
        ('light', 'Light'),
        ('dark', 'Dark'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')
    preferred_colors = models.JSONField(default=list, blank=True)
    preferred_brands = models.JSONField(default=list, blank=True)
    preferred_styles = models.JSONField(default=list, blank=True)
    notification_enabled = models.BooleanField(default=True)
    theme = models.CharField(max_length=10, choices=THEME_CHOICES, default='light')
    
    def __str__(self):
        return f"{self.user.username}'s preferences"