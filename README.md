# Fitmate - AI-Powered Outfit Fit Prediction Platform

## Overview
Fitmate helps users predict how well outfits will fit based on their body measurements using AI and machine learning. Upload your outfits, enter your measurements, and get intelligent fit predictions to make better wardrobe decisions.

## Features
- 🔐 **User Authentication** - Secure JWT-based authentication with email verification
- 📏 **Body Measurement Tracking** - Store and manage your body measurements
- 🎯 **3D Body Visualization** - Interactive 3D model of your body based on your measurements
- 👔 **Outfit Management** - Upload and organize your wardrobe with images
- 🎨 **3D Outfit Preview** - View outfits in 3D with category-based visualizations
- 🤖 **AI-Powered Fit Prediction** - Smart predictions using machine learning
- 📊 **Analytics & Insights** - Track your wardrobe usage and preferences
- 💡 **Personalized Recommendations** - Get outfit suggestions based on body shape and preferences
- 🖼️ **Modern UI** - Responsive React frontend with Material-UI

## Tech Stack

### Backend
- **Framework:** Django 4.2.7 + Django REST Framework
- **Database:** MySQL 8.0
- **Authentication:** JWT (Simple JWT)
- **ML/AI:** scikit-learn, NumPy
- **Image Processing:** Pillow

### Frontend
- **Framework:** React 18+ with TypeScript
- **UI Library:** Material-UI (MUI)
- **3D Graphics:** React Three Fiber, Three.js, Drei
- **State Management:** React Query
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Build Tool:** Vite

### Deployment
- **Containerization:** Docker & Docker Compose
- **Web Server:** Nginx (frontend), Gunicorn (backend)
- **CI/CD:** GitHub Actions

## Prerequisites

- Python 3.11+
- Node.js 18+
- MySQL 8.0+
- Docker & Docker Compose (optional)

## Setup Instructions

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Srivenkatesh03/Fitmate.git
   cd Fitmate
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp ../.env.example .env
   # Edit .env with your configuration
   ```

5. **Set up database**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE fitmate_mvp;
   EXIT;
   
   # Run migrations
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run development server**
   ```bash
   python manage.py runserver
   ```

   Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env if needed
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:3000`

## 3D Visualization Features

Fitmate includes interactive 3D visualizations to help users better understand their body measurements and outfit fits.

### 3D Body Model
- **Real-time Updates:** The 3D body model updates instantly as you enter your measurements
- **Interactive Controls:** Rotate, zoom, and pan the model for a complete 360° view
- **Gender-based Styling:** Different colors and proportions for male, female, and other body types
- **Accurate Proportions:** Body parts scale based on your actual measurements (height, chest, waist, hips)

### 3D Outfit Visualization
- **Category-based Design:** Different 3D shapes for tops, bottoms, dresses, and outerwear
- **Auto-rotating Display:** Outfits automatically rotate for a full view
- **Color Coding:** Each category has distinctive colors for easy identification
- **Interactive Preview:** Click and drag to manually control the outfit view

![3D Models Demo](https://github.com/user-attachments/assets/47380e8e-28c3-4944-ae27-3a97500cba6f)

### Docker Setup

Run the entire stack with Docker:

```bash
docker-compose up --build
```

Services:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **MySQL:** localhost:3306

## API Documentation

See [docs/API.md](docs/API.md) for detailed API documentation.

### Quick API Reference

#### Authentication
- `POST /api/users/register/` - Register new user
- `POST /api/users/login/` - Login user
- `POST /api/users/token/refresh/` - Refresh JWT token

#### Measurements
- `GET /api/measurements/` - Get user measurements
- `POST /api/measurements/` - Create/update measurements

#### Outfits
- `GET /api/outfits/` - List user outfits
- `POST /api/outfits/` - Upload new outfit
- `GET /api/outfits/{id}/` - Get outfit details
- `PUT /api/outfits/{id}/` - Update outfit
- `DELETE /api/outfits/{id}/` - Delete outfit

#### Predictions
- `POST /api/predictions/predict/` - Get fit prediction
- `GET /api/predictions/history/` - Get prediction history

## Project Structure

```
Fitmate/
├── backend/
│   ├── fitmate/          # Django project settings
│   ├── users/            # User authentication
│   ├── measurements/     # Body measurements
│   ├── outfits/          # Outfit management
│   ├── predictions/      # Fit predictions
│   ├── recommendations/  # AI recommendations
│   ├── analytics/        # Wardrobe analytics
│   └── common/           # Shared utilities
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── hooks/        # Custom hooks
│   │   ├── context/      # Context providers
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
├── docs/                 # Documentation
├── .github/workflows/    # CI/CD pipelines
└── docker-compose.yml    # Docker configuration
```

## Development

### Running Tests

**Backend:**
```bash
cd backend
python manage.py test
# Or with pytest
pytest
```

**Frontend:**
```bash
cd frontend
npm test
```

### Code Quality

**Backend:**
```bash
# Linting
flake8 backend/

# Type checking (if using mypy)
mypy backend/
```

**Frontend:**
```bash
# Linting
npm run lint

# Type checking
npm run type-check
```

## Deployment

### Production Checklist

1. Set `DEBUG=False` in `.env`
2. Generate strong `SECRET_KEY`
3. Configure `ALLOWED_HOSTS`
4. Set up email backend
5. Configure AWS S3 for media storage (optional)
6. Set up SSL/TLS certificates
7. Configure database backups
8. Set up monitoring and logging

### Deploy with Docker

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@fitmate.com or open an issue in the repository.

## Acknowledgments

- Django REST Framework team
- React and Material-UI communities
- Contributors and testers
