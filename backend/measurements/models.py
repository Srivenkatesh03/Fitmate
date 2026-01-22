from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Measurement(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
    BODY_SHAPE_CHOICES = [
        ('rectangle', 'Rectangle'),
        ('triangle', 'Triangle'),
        ('inverted_triangle', 'Inverted Triangle'),
        ('hourglass', 'Hourglass'),
        ('oval', 'Oval'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='measurement')
    height = models.DecimalField(max_digits=5, decimal_places=2, help_text="Height in cm")
    weight = models.DecimalField(max_digits=5, decimal_places=2, help_text="Weight in kg")
    chest = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    waist = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hips = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    shoulder = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    body_shape = models.CharField(max_length=20, choices=BODY_SHAPE_CHOICES, null=True, blank=True)
    skin_tone = models.CharField(max_length=20, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s measurements"