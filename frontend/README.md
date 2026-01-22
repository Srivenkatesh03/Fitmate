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
│   ├── layout/      # Layout components
│   ├── outfits/     # Outfit-related components
│   └── common/      # Common/shared components
├── pages/           # Page components
├── services/        # API services
├── hooks/           # Custom React hooks
├── context/         # React context providers
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
└── styles/          # Global styles
```

## Features

- ✅ User Authentication (Login/Register)
- ✅ Protected Routes
- ✅ JWT Token Management with Auto-refresh
- ✅ Material-UI Components
- ✅ TypeScript Support
- ✅ React Query for Data Fetching
- 🚧 Outfit Management (Coming soon)
- 🚧 Fit Predictions (Coming soon)
- 🚧 Analytics Dashboard (Coming soon)

## Environment Variables

Create a `.env` file based on `.env.example`:

```
VITE_API_URL=http://localhost:8000/api
```

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Material-UI** - Component library
- **React Router** - Navigation
- **React Query** - Data fetching
- **Axios** - HTTP client
- **React Hook Form** - Form management

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
