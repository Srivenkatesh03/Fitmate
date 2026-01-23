import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import {
  Timeline,
  CheckCircle,
  Warning,
  Cancel,
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { outfitsAPI, predictionsAPI, measurementsAPI } from '../services/api';

interface Outfit {
  id: number;
  name: string;
  image: string;
  category: string;
}

const PredictionsPage = () => {
  const navigate = useNavigate();
  const [selectedOutfit, setSelectedOutfit] = useState<number | null>(null);

  const { data: measurements } = useQuery({
    queryKey: ['measurements'],
    queryFn: async () => {
      const response = await measurementsAPI.get();
      return response.data;
    },
  });

  const { data: outfits, isLoading: outfitsLoading } = useQuery({
    queryKey: ['outfits-for-prediction'],
    queryFn: async () => {
      const response = await outfitsAPI.list({ page: 1 });
      return response.data.results;
    },
  });

  const predictMutation = useMutation({
    mutationFn: (outfitId: number) => predictionsAPI.predict(outfitId),
    onSuccess: () => {
      setSelectedOutfit(null);
      navigate('/history');
    },
  });

  const handlePredict = () => {
    if (selectedOutfit) {
      predictMutation.mutate(selectedOutfit);
    }
  };

  if (!measurements) {
    return (
      <MainLayout>
        <Box>
          <Typography variant="h4" gutterBottom>
            Fit Predictions
          </Typography>
          <Alert severity="warning" sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Measurements Required
            </Typography>
            <Typography variant="body2" paragraph>
              You need to enter your body measurements before you can get fit predictions.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/measurements')}
            >
              Add Measurements
            </Button>
          </Alert>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Fit Predictions
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Select an outfit to get an AI-powered fit prediction based on your measurements.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Select an Outfit
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {outfitsLoading && (
                <Box display="flex" justifyContent="center" p={4}>
                  <CircularProgress />
                </Box>
              )}

              {!outfitsLoading && outfits && outfits.length === 0 && (
                <Alert severity="info">
                  <Typography variant="body2">
                    You don't have any outfits yet. Upload your first outfit to get started!
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/outfits/upload')}
                    sx={{ mt: 2 }}
                  >
                    Upload Outfit
                  </Button>
                </Alert>
              )}

              {outfits && outfits.length > 0 && (
                <Grid container spacing={2}>
                  {outfits.map((outfit: Outfit) => (
                    <Grid item xs={6} sm={4} md={3} key={outfit.id}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: selectedOutfit === outfit.id ? 2 : 0,
                          borderColor: 'primary.main',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: 3,
                          },
                        }}
                        onClick={() => setSelectedOutfit(outfit.id)}
                      >
                        <CardMedia
                          component="img"
                          height="150"
                          image={outfit.image}
                          alt={outfit.name}
                          sx={{ objectFit: 'cover' }}
                        />
                        <CardContent sx={{ p: 1.5 }}>
                          <Typography variant="body2" noWrap>
                            {outfit.name}
                          </Typography>
                          <Chip label={outfit.category} size="small" sx={{ mt: 0.5 }} />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom>
                Prediction Settings
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Your Measurements
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Height: {measurements.height} cm
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Weight: {measurements.weight} kg
                </Typography>
                {measurements.chest && (
                  <Typography variant="body2" color="text.secondary">
                    Chest: {measurements.chest} cm
                  </Typography>
                )}
                <Button
                  size="small"
                  onClick={() => navigate('/measurements')}
                  sx={{ mt: 1 }}
                >
                  Update Measurements
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Fit Categories
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CheckCircle color="success" fontSize="small" />
                  <Typography variant="body2">Perfect Fit</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Warning color="warning" fontSize="small" />
                  <Typography variant="body2">Acceptable Fit</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Cancel color="error" fontSize="small" />
                  <Typography variant="body2">Poor Fit</Typography>
                </Box>
              </Box>

              {predictMutation.isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Failed to create prediction. Please try again.
                </Alert>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Timeline />}
                onClick={handlePredict}
                disabled={!selectedOutfit || predictMutation.isPending}
              >
                {predictMutation.isPending ? 'Processing...' : 'Get Prediction'}
              </Button>

              {!selectedOutfit && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                  Select an outfit to continue
                </Typography>
              )}

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/history')}
                sx={{ mt: 2 }}
              >
                View Prediction History
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default PredictionsPage;
