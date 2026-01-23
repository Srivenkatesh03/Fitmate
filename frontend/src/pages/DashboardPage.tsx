import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import {
  Checkroom,
  AddPhotoAlternate,
  Person,
  Timeline,
  Analytics,
  Favorite,
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { outfitsAPI, measurementsAPI } from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: measurements } = useQuery({
    queryKey: ['measurements'],
    queryFn: async () => {
      try {
        const response = await measurementsAPI.get();
        return response.data;
      } catch (error) {
        return null;
      }
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['outfit-stats'],
    queryFn: async () => {
      try {
        const response = await outfitsAPI.stats();
        return response.data;
      } catch (error) {
        return null;
      }
    },
  });

  const quickActions = [
    {
      title: 'Upload Outfit',
      description: 'Add a new outfit to your wardrobe',
      icon: <AddPhotoAlternate sx={{ fontSize: 40 }} />,
      action: () => navigate('/outfits/upload'),
      color: 'primary.main',
    },
    {
      title: 'My Measurements',
      description: 'Update your body measurements',
      icon: <Person sx={{ fontSize: 40 }} />,
      action: () => navigate('/measurements'),
      color: 'secondary.main',
    },
    {
      title: 'Get Prediction',
      description: 'Check if an outfit fits',
      icon: <Timeline sx={{ fontSize: 40 }} />,
      action: () => navigate('/predictions'),
      color: 'success.main',
    },
    {
      title: 'View Analytics',
      description: 'See your wardrobe insights',
      icon: <Analytics sx={{ fontSize: 40 }} />,
      action: () => navigate('/analytics'),
      color: 'warning.main',
    },
  ];

  return (
    <MainLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.first_name || user?.username}!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Your AI-Powered Outfit Fit Prediction Platform
        </Typography>

        {!measurements && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Start by adding your body measurements to get accurate fit predictions!
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Checkroom sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">{stats?.total_outfits || 0}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Outfits
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Favorite sx={{ fontSize: 48, color: 'error.main', mb: 1 }} />
              <Typography variant="h4">{stats?.favorite_count || 0}</Typography>
              <Typography variant="body2" color="text.secondary">
                Favorites
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Timeline sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
              <Typography variant="h4">{stats?.total_predictions || 0}</Typography>
              <Typography variant="body2" color="text.secondary">
                Predictions
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Checkroom sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4">{stats?.total_times_worn || 0}</Typography>
              <Typography variant="body2" color="text.secondary">
                Times Worn
              </Typography>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
              Quick Actions
            </Typography>
          </Grid>

          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ color: action.color, mb: 2 }}>
                    {action.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button fullWidth variant="outlined" onClick={action.action}>
                    Go
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}

          {/* Getting Started */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Getting Started
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Follow these steps to get the most out of Fitmate:
              </Typography>
              <Box component="ol" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Add your body measurements for accurate predictions
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Upload photos of your outfits with details
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Get AI-powered fit predictions for each outfit
                </Typography>
                <Typography component="li" variant="body2">
                  Track your wardrobe and analyze your style
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default DashboardPage;
