import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Delete,
  Timeline,
  CheckCircle,
  ViewInAr,
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import AccessoryRecommendations from '../components/AccessoryRecommendations';
import StylingTips from '../components/StylingTips';
import { outfitsAPI, predictionsAPI, measurementsAPI } from '../services/api';
import { format } from 'date-fns';
import { OutfitModel3D } from '../components/3d';

interface Outfit {
  id: number;
  name: string;
  category: string;
  occasion?: string;
  season?: string;
  brand?: string;
  size?: string;
  color?: string;
  notes?: string;
  image: string;
  is_favorite: boolean;
  times_worn: number;
  garment_length?: number;
  garment_chest?: number;
  garment_waist?: number;
  garment_hips?: number;
  created_at: string;
  updated_at: string;
}

const OutfitDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [show3DModel, setShow3DModel] = useState(true);

  const { data: outfit, isLoading, error } = useQuery({
    queryKey: ['outfit', id],
    queryFn: async () => {
      const response = await outfitsAPI.get(Number(id));
      return response.data as Outfit;
    },
    enabled: !!id,
  });

  const { data: measurements } = useQuery({
    queryKey: ['measurements'],
    queryFn: async () => {
      const response = await measurementsAPI.get();
      return response.data;
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: () => outfitsAPI.toggleFavorite(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfit', id] });
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
    },
  });

  const wornMutation = useMutation({
    mutationFn: () => outfitsAPI.markAsWorn(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfit', id] });
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => outfitsAPI.delete(Number(id)),
    onSuccess: () => {
      navigate('/outfits');
    },
  });

  const predictMutation = useMutation({
    mutationFn: () => predictionsAPI.predict(Number(id)),
    onSuccess: () => {
      navigate('/history');
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
    setDeleteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error || !outfit) {
    return (
      <MainLayout>
        <Alert severity="error">
          Failed to load outfit details. Please try again.
        </Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">{outfit.name}</Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<ViewInAr />}
              onClick={() => setShow3DModel(!show3DModel)}
              sx={{ mr: 1 }}
            >
              {show3DModel ? 'Hide' : 'Show'} 3D
            </Button>
            <IconButton
              onClick={() => favoriteMutation.mutate()}
              color={outfit.is_favorite ? 'error' : 'default'}
              disabled={favoriteMutation.isPending}
            >
              {outfit.is_favorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <IconButton onClick={() => setDeleteDialogOpen(true)} color="error">
              <Delete />
            </IconButton>
          </Box>
        </Box>

        {show3DModel && (
          <Box sx={{ mb: 3 }}>
            <OutfitModel3D category={outfit.category} />
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                image={outfit.image}
                alt={outfit.name}
                sx={{ maxHeight: 600, objectFit: 'contain' }}
              />
            </Card>

            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<Timeline />}
                  onClick={() => predictMutation.mutate()}
                  disabled={predictMutation.isPending}
                >
                  {predictMutation.isPending ? 'Predicting...' : 'Predict Fit'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CheckCircle />}
                  onClick={() => wornMutation.mutate()}
                  disabled={wornMutation.isPending}
                >
                  Mark as Worn
                </Button>
              </Box>
              {predictMutation.isError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Failed to create prediction. Please ensure you have entered your measurements.
                </Alert>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={outfit.category} color="primary" />
                {outfit.occasion && <Chip label={outfit.occasion} />}
                {outfit.season && <Chip label={outfit.season} color="secondary" />}
              </Box>

              <Table size="small">
                <TableBody>
                  {outfit.brand && (
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Brand</TableCell>
                      <TableCell>{outfit.brand}</TableCell>
                    </TableRow>
                  )}
                  {outfit.size && (
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Size</TableCell>
                      <TableCell>{outfit.size}</TableCell>
                    </TableRow>
                  )}
                  {outfit.color && (
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Color</TableCell>
                      <TableCell>{outfit.color}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 'bold' }}>Times Worn</TableCell>
                    <TableCell>{outfit.times_worn}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 'bold' }}>Added</TableCell>
                    <TableCell>{format(new Date(outfit.created_at), 'PPP')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {outfit.notes && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Notes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {outfit.notes}
                  </Typography>
                </Box>
              )}
            </Paper>

            {(outfit.garment_length || outfit.garment_chest || outfit.garment_waist || outfit.garment_hips) && (
              <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Garment Measurements
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Table size="small">
                  <TableBody>
                    {outfit.garment_length && (
                      <TableRow>
                        <TableCell component="th" sx={{ fontWeight: 'bold' }}>Length</TableCell>
                        <TableCell>{outfit.garment_length} cm</TableCell>
                      </TableRow>
                    )}
                    {outfit.garment_chest && (
                      <TableRow>
                        <TableCell component="th" sx={{ fontWeight: 'bold' }}>Chest</TableCell>
                        <TableCell>{outfit.garment_chest} cm</TableCell>
                      </TableRow>
                    )}
                    {outfit.garment_waist && (
                      <TableRow>
                        <TableCell component="th" sx={{ fontWeight: 'bold' }}>Waist</TableCell>
                        <TableCell>{outfit.garment_waist} cm</TableCell>
                      </TableRow>
                    )}
                    {outfit.garment_hips && (
                      <TableRow>
                        <TableCell component="th" sx={{ fontWeight: 'bold' }}>Hips</TableCell>
                        <TableCell>{outfit.garment_hips} cm</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Paper>
            )}
          </Grid>
        </Grid>

        {/* Styling Recommendations Section */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <StylingTips
              bodyShape={measurements?.body_shape}
              occasion={outfit.occasion}
              category={outfit.category}
              color={outfit.color}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <AccessoryRecommendations
              outfitCategory={outfit.category}
              occasion={outfit.occasion}
            />
          </Grid>
        </Grid>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Outfit</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete "{outfit.name}"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDelete}
              color="error"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
};

export default OutfitDetailPage;
