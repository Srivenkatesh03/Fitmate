from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Measurement

User = get_user_model()


class MeasurementViewSetTests(APITestCase):
    """Test MeasurementViewSet endpoint at /api/measurements/"""
    
    def setUp(self):
        """Set up test data"""
        self.url = '/api/measurements/'
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.measurement_data = {
            'height': 175.5,
            'weight': 70.0,
            'chest': 95.0,
            'waist': 80.0,
            'hips': 98.0,
            'shoulder': 45.0,
            'gender': 'male',
            'skin_tone': 'medium'
        }
    
    def test_get_measurements_not_found(self):
        """Test GET request when measurements don't exist returns null"""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNone(response.data)
    
    def test_post_create_measurements(self):
        """Test POST request creates new measurements"""
        response = self.client.post(self.url, self.measurement_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['height'], '175.50')
        self.assertEqual(response.data['weight'], '70.00')
        self.assertEqual(response.data['gender'], 'male')
        # Check that body_shape was auto-detected
        self.assertIsNotNone(response.data.get('body_shape'))
        
        # Verify measurement was created in database
        self.assertTrue(Measurement.objects.filter(user=self.user).exists())
    
    def test_post_duplicate_measurements(self):
        """Test POST request when measurements already exist returns error"""
        # Create initial measurements
        Measurement.objects.create(user=self.user, **self.measurement_data)
        
        # Try to create again
        response = self.client.post(self.url, self.measurement_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('already exist', response.data['error'])
    
    def test_get_measurements_success(self):
        """Test GET request returns user's measurements"""
        measurement = Measurement.objects.create(user=self.user, **self.measurement_data)
        
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['height']), float(measurement.height))
        self.assertEqual(float(response.data['weight']), float(measurement.weight))
        self.assertEqual(response.data['gender'], measurement.gender)
    
    def test_put_update_measurements(self):
        """Test PUT request updates existing measurements"""
        Measurement.objects.create(user=self.user, **self.measurement_data)
        
        updated_data = self.measurement_data.copy()
        updated_data['weight'] = 75.0
        updated_data['waist'] = 82.0
        
        response = self.client.put(self.url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['weight'], '75.00')
        self.assertEqual(response.data['waist'], '82.00')
    
    def test_put_measurements_not_found(self):
        """Test PUT request when measurements don't exist returns error"""
        response = self.client.put(self.url, self.measurement_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('not found', response.data['error'].lower())
    
    def test_patch_partial_update_measurements(self):
        """Test PATCH request performs partial update"""
        Measurement.objects.create(user=self.user, **self.measurement_data)
        
        partial_data = {'weight': 72.5}
        response = self.client.patch(self.url, partial_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['weight'], '72.50')
        # Other fields should remain unchanged
        self.assertEqual(response.data['height'], '175.50')
    
    def test_authentication_required(self):
        """Test that authentication is required for all methods"""
        self.client.force_authenticate(user=None)
        
        # Test GET
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Test POST
        response = self.client.post(self.url, self.measurement_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Test PUT
        response = self.client.put(self.url, self.measurement_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Test PATCH
        response = self.client.patch(self.url, {'weight': 75.0}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_body_shape_auto_detection(self):
        """Test that body shape is auto-detected when not provided"""
        data = self.measurement_data.copy()
        # Don't include body_shape
        data.pop('body_shape', None)
        
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Body shape should be auto-detected
        self.assertIsNotNone(response.data.get('body_shape'))
        self.assertIn(response.data['body_shape'], 
                     ['rectangle', 'triangle', 'inverted_triangle', 'hourglass', 'oval'])
    
    def test_measurements_isolation_between_users(self):
        """Test that users can only access their own measurements"""
        # Create measurements for first user
        Measurement.objects.create(user=self.user, **self.measurement_data)
        
        # Create second user and authenticate as them
        user2 = User.objects.create_user(
            username='testuser2',
            email='test2@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=user2)
        
        # Second user should get 200 with null (no measurements)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNone(response.data)


class MeasurementModelTests(TestCase):
    """Test Measurement model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_create_measurement(self):
        """Test creating a measurement"""
        measurement = Measurement.objects.create(
            user=self.user,
            height=175.5,
            weight=70.0,
            chest=95.0,
            waist=80.0,
            hips=98.0,
            gender='male'
        )
        self.assertEqual(measurement.user, self.user)
        self.assertEqual(float(measurement.height), 175.5)
        self.assertEqual(float(measurement.weight), 70.0)
    
    def test_measurement_string_representation(self):
        """Test measurement string representation"""
        measurement = Measurement.objects.create(
            user=self.user,
            height=175.5,
            weight=70.0,
            gender='male'
        )
        self.assertEqual(str(measurement), f"{self.user.username}'s measurements")
    
    def test_one_to_one_relationship(self):
        """Test that each user can have only one measurement"""
        Measurement.objects.create(
            user=self.user,
            height=175.5,
            weight=70.0,
            gender='male'
        )
        
        # Creating another measurement for the same user should raise an error
        with self.assertRaises(Exception):
            Measurement.objects.create(
                user=self.user,
                height=180.0,
                weight=75.0,
                gender='male'
            )

