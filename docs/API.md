# Fitmate API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication

All endpoints except registration and login require JWT authentication.

### Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## Authentication Endpoints

### Register User
**POST** `/users/register/`

Create a new user account.

**Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### Login
**POST** `/users/login/`

Authenticate user and receive tokens.

**Request:**
```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### Refresh Token
**POST** `/users/token/refresh/`

Get a new access token using refresh token.

**Request:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response:** `200 OK`
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Get User Profile
**GET** `/users/profile/`

Get authenticated user's profile.

**Response:** `200 OK`
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "profile_picture": "/media/profiles/user1.jpg",
  "bio": "Fitness enthusiast",
  "is_email_verified": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

## Measurements Endpoints

### Get Measurements
**GET** `/measurements/`

Get authenticated user's body measurements.

**Response:** `200 OK`
```json
{
  "id": 1,
  "user": 1,
  "height": "175.00",
  "weight": "70.00",
  "chest": "95.00",
  "waist": "80.00",
  "hips": "98.00",
  "shoulder": "45.00",
  "gender": "male",
  "body_shape": "rectangle",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T15:45:00Z"
}
```

### Create/Update Measurements
**POST** `/measurements/`

Create or update user measurements.

**Request:**
```json
{
  "height": "175.00",
  "weight": "70.00",
  "chest": "95.00",
  "waist": "80.00",
  "hips": "98.00",
  "shoulder": "45.00",
  "gender": "male"
}
```

---

## Outfits Endpoints

### List Outfits
**GET** `/outfits/`

Get list of user's outfits with pagination, filtering, and search.

**Query Parameters:**
- `page` - Page number (default: 1)
- `category` - Filter by category (top, bottom, dress, full_outfit)
- `occasion` - Filter by occasion (casual, formal, sports, party, work)
- `search` - Search in name, description, brand
- `ordering` - Sort field (-uploaded_at, name, times_worn)

### Create Outfit
**POST** `/outfits/`

Upload a new outfit.

**Request:** `multipart/form-data`

### Get Outfit Detail
**GET** `/outfits/{id}/`

Get detailed information about a specific outfit.

---

## Predictions Endpoints

### Predict Fit
**POST** `/predictions/predict/`

Get fit prediction for an outfit.

**Request:**
```json
{
  "outfit_id": 1
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "outfit": {
    "id": 1,
    "name": "Blue Summer Dress"
  },
  "fit_score": "92.50",
  "fit_status": "perfect",
  "recommendations": "Great fit!",
  "created_at": "2024-01-20T15:45:00Z"
}
```

### Get Prediction History
**GET** `/predictions/history/`

Get user's fit prediction history.

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid data provided"
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```
