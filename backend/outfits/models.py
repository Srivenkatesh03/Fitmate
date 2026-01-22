from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Outfit(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='outfits')
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='outfits/')
    outfit_length = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    outfit_chest = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    outfit_waist = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    outfit_hips = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.user.username}"