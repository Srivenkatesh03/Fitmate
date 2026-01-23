# Fitmate Frontend

React + TypeScript + Vite application for Fitmate outfit fit prediction platform.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Application will run on `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── auth/        # Authentication components
│   └── layout/      # Layout components (MainLayout)
├── pages/           # Page components
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── MeasurementsPage.tsx
│   ├── OutfitsPage.tsx
│   ├── OutfitUploadPage.tsx
│   ├── OutfitDetailPage.tsx
│   ├── PredictionsPage.tsx
│   ├── HistoryPage.tsx
│   └── AnalyticsPage.tsx
├── services/        # API services
│   └── api.ts
├── context/         # React context providers
│   └── AuthContext.tsx
└── styles/          # Global styles
```

## Pages

### Authentication
- **LoginPage** - User login with JWT authentication
- **RegisterPage** - New user registration

### Dashboard
- **DashboardPage** - Overview with quick stats and action buttons

### Measurements
- **MeasurementsPage** - Form to enter/update body measurements with validation
  - Height, Weight, Chest, Waist, Hips, Shoulder
  - Gender selection
  - Required for fit predictions

### Outfits
- **OutfitsPage** - Gallery view of user's outfits
  - Search functionality
  - Filter by category, occasion, season
  - Favorites filter
  - Pagination
  
- **OutfitUploadPage** - Upload new outfit
  - Drag-and-drop image upload
  - Outfit details (name, category, size, brand, color)
  - Optional garment measurements
  - Form validation

- **OutfitDetailPage** - View single outfit details
  - Full image display
  - Outfit metadata
  - Actions: Favorite, Delete, Mark as Worn
  - Quick predict fit button

### Predictions
- **PredictionsPage** - Create AI-powered fit predictions
  - Select outfit from gallery
  - View user measurements
  - Get instant fit prediction
  - Categories: Perfect Fit, Acceptable Fit, Poor Fit

- **HistoryPage** - View prediction history
  - Table/Card views (responsive)
  - Filter by fit status
  - View confidence scores
  - Link to outfit details

### Analytics
- **AnalyticsPage** - Wardrobe statistics and insights
  - Summary cards (total outfits, favorites, predictions, times worn)
  - Pie charts (category distribution, fit predictions)
  - Bar charts (occasions, seasons)
  - Most worn outfits

## Features

- ✅ User Authentication (Login/Register)
- ✅ Protected Routes
- ✅ JWT Token Management with Auto-refresh
- ✅ Body Measurements Management
- ✅ Outfit Management (Upload, View, Edit, Delete)
- ✅ Image Upload with Drag-and-Drop
- ✅ Fit Predictions with AI
- ✅ Prediction History
- ✅ Analytics Dashboard with Charts
- ✅ Responsive Design (Mobile, Tablet, Desktop)
- ✅ Loading States and Error Handling
- ✅ Form Validation

## Environment Variables

Create a `.env` file based on `.env.example`:

```
VITE_API_URL=http://localhost:8000/api
```

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material-UI v5** - Component library
- **React Router v6** - Navigation
- **React Query (TanStack Query)** - Data fetching and caching
- **Axios** - HTTP client with interceptors
- **React Hook Form** - Form management and validation
- **React Dropzone** - File upload with drag-and-drop
- **Recharts** - Data visualization
- **date-fns** - Date formatting

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
