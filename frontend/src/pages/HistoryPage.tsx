import { useState } from 'react';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Card,
  CardMedia,
  Grid,
  IconButton,
  Tooltip,
  Collapse,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Cancel,
  Visibility,
  FilterList,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import FitScoreDisplay from '../components/FitScoreDisplay';
import { predictionsAPI } from '../services/api';
import { format } from 'date-fns';

interface Prediction {
  id: number;
  outfit: {
    id: number;
    name: string;
    image: string;
    category: string;
  };
  fit_status: string;
  fit_score: number;
  recommendations?: string;
  created_at: string;
  measurement_breakdown?: {
    chest?: { user: number; outfit: number; diff: number; status: string };
    waist?: { user: number; outfit: number; diff: number; status: string };
    hips?: { user: number; outfit: number; diff: number; status: string };
  };
}

const HistoryPage = () => {
  const navigate = useNavigate();
  const [fitStatusFilter, setFitStatusFilter] = useState('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const { data: predictions, isLoading, error } = useQuery({
    queryKey: ['prediction-history', fitStatusFilter],
    queryFn: async () => {
      const params = fitStatusFilter ? { fit_status: fitStatusFilter } : undefined;
      const response = await predictionsAPI.history(params);
      return response.data;
    },
  });

  const getFitStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' | 'info' => {
    switch (status) {
      case 'perfect':
        return 'success';
      case 'good':
        return 'info';
      case 'loose':
        return 'warning';
      case 'tight':
        return 'error';
      default:
        return 'default';
    }
  };

  const getFitStatusIcon = (status: string) => {
    switch (status) {
      case 'perfect':
        return <CheckCircle />;
      case 'good':
        return <CheckCircle />;
      case 'loose':
        return <Warning />;
      case 'tight':
        return <Cancel />;
      default:
        return null;
    }
  };

  const getFitStatusLabel = (status: string) => {
    switch (status) {
      case 'perfect':
        return 'Perfect Fit';
      case 'good':
        return 'Good Fit';
      case 'loose':
        return 'Loose Fit';
      case 'tight':
        return 'Tight Fit';
      default:
        return status;
    }
  };

  return (
    <MainLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Prediction History</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/predictions')}
          >
            New Prediction
          </Button>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FilterList />
            <TextField
              select
              label="Filter by Fit Status"
              value={fitStatusFilter}
              onChange={(e) => setFitStatusFilter(e.target.value)}
              sx={{ minWidth: 200 }}
              size="small"
            >
              <MenuItem value="">All Predictions</MenuItem>
              <MenuItem value="perfect">Perfect Fit</MenuItem>
              <MenuItem value="good">Good Fit</MenuItem>
              <MenuItem value="loose">Loose Fit</MenuItem>
              <MenuItem value="tight">Tight Fit</MenuItem>
            </TextField>
            {fitStatusFilter && (
              <Button size="small" onClick={() => setFitStatusFilter('')}>
                Clear Filter
              </Button>
            )}
          </Box>
        </Paper>

        {isLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error">
            Failed to load prediction history. Please try again.
          </Alert>
        )}

        {predictions && predictions.length === 0 && (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No predictions yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Start by creating your first fit prediction!
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/predictions')}
            >
              Create Prediction
            </Button>
          </Paper>
        )}

        {predictions && predictions.length > 0 && (
          <>
            {/* Mobile/Tablet View */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Grid container spacing={2}>
                {predictions.map((prediction: Prediction) => (
                  <Grid item xs={12} key={prediction.id}>
                    <Card>
                      <Box sx={{ display: 'flex', p: 2 }}>
                        <CardMedia
                          component="img"
                          sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }}
                          image={prediction.outfit.image}
                          alt={prediction.outfit.name}
                        />
                        <Box sx={{ ml: 2, flex: 1 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            {prediction.outfit.name}
                          </Typography>
                          <Chip
                            icon={getFitStatusIcon(prediction.fit_status) || undefined}
                            label={getFitStatusLabel(prediction.fit_status)}
                            color={getFitStatusColor(prediction.fit_status)}
                            size="small"
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Score: {Math.round(prediction.fit_score)}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(prediction.created_at), 'PPp')}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Button
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => navigate(`/outfits/${prediction.outfit.id}`)}
                            >
                              View Outfit
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                      {prediction.recommendations && (
                        <Box sx={{ px: 2, pb: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            Recommendations:
                          </Typography>
                          <Typography variant="body2">
                            {prediction.recommendations}
                          </Typography>
                        </Box>
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Desktop View */}
            <TableContainer component={Paper} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Outfit</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Fit Status</TableCell>
                    <TableCell>Fit Score</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {predictions.map((prediction: Prediction) => (
                    <React.Fragment key={prediction.id}>
                      <TableRow hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CardMedia
                              component="img"
                              sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                              image={prediction.outfit.image}
                              alt={prediction.outfit.name}
                            />
                            <Typography variant="body2">{prediction.outfit.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={prediction.outfit.category} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getFitStatusIcon(prediction.fit_status) || undefined}
                            label={getFitStatusLabel(prediction.fit_status)}
                            color={getFitStatusColor(prediction.fit_status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">
                              {Math.round(prediction.fit_score)}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={format(new Date(prediction.created_at), 'PPpp')}>
                            <Typography variant="body2" color="text.secondary">
                              {format(new Date(prediction.created_at), 'PP')}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => setExpandedRow(expandedRow === prediction.id ? null : prediction.id)}
                          >
                            {expandedRow === prediction.id ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/outfits/${prediction.outfit.id}`)}
                          >
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={6} sx={{ py: 0, border: 0 }}>
                          <Collapse in={expandedRow === prediction.id} timeout="auto" unmountOnExit>
                            <Box sx={{ py: 2 }}>
                              <FitScoreDisplay
                                fitScore={prediction.fit_score}
                                fitStatus={prediction.fit_status}
                                recommendations={prediction.recommendations}
                                measurements={prediction.measurement_breakdown}
                              />
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </MainLayout>
  );
};

export default HistoryPage;
