from django.db import models
from django.contrib.auth import get_user_model
from outfits.models import Outfit

User = get_user_model()

class FitResult(models.Model):
    FIT_STATUS_CHOICES = [
        ('perfect', 'Perfect Fit'),
        ('good', 'Good Fit'),
        ('loose', 'Loose'),
        ('tight', 'Tight'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fit_results')
    outfit = models.ForeignKey(Outfit, on_delete=models.CASCADE, related_name='fit_results')
    fit_score = models.DecimalField(max_digits=5, decimal_places=2, help_text="Score out of 100")
    fit_status = models.CharField(max_length=20, choices=FIT_STATUS_CHOICES)
    recommendations = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.outfit.name} - {self.fit_status} ({self.fit_score}%)"