from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Outfit
from io import BytesIO
from PIL import Image

User = get_user_model()


class OutfitAPITests(APITestCase):
    """Test outfit API endpoints"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        self.outfit_url = '/api/outfits/'
    
    def create_test_image(self):
        """Create a test image file"""
        file = BytesIO()
        image = Image.new('RGB', (100, 100), color='red')
        image.save(file, 'PNG')
        file.name = 'test.png'
        file.seek(0)
        return file
    
    def test_list_outfits(self):
        """Test listing user's outfits"""
        response = self.client.get(self.outfit_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_outfit_requires_authentication(self):
        """Test outfit endpoints require authentication"""
        self.client.force_authenticate(user=None)
        response = self.client.get(self.outfit_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class OutfitModelTests(TestCase):
    """Test Outfit model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_create_outfit(self):
        """Test creating an outfit"""
        outfit = Outfit.objects.create(
            user=self.user,
            name='Test Outfit',
            category='dress',
            occasion='casual'
        )
        self.assertEqual(outfit.name, 'Test Outfit')
        self.assertEqual(outfit.category, 'dress')
        self.assertEqual(outfit.user, self.user)
        self.assertEqual(outfit.is_favorite, False)
        self.assertEqual(outfit.times_worn, 0)
    
    def test_outfit_string_representation(self):
        """Test outfit string representation"""
        outfit = Outfit.objects.create(
            user=self.user,
            name='Blue Dress'
        )
        expected = f'Blue Dress - {self.user.username}'
        self.assertEqual(str(outfit), expected)

