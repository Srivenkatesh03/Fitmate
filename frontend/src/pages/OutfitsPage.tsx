import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  InputAdornment,
  Pagination,
  Paper,
} from '@mui/material';
import {
  Add,
  Favorite,
  FavoriteBorder,
  Visibility,
  Search,
  FilterList,
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { outfitsAPI } from '../services/api';

interface Outfit {
  id: number;
  name: string;
  category: string;
  occasion?: string;
  season?: string;
  image: string;
  is_favorite: boolean;
  times_worn: number;
  created_at: string;
}

const OutfitsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [occasion, setOccasion] = useState('');
  const [season, setSeason] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['outfits', page, search, category, occasion, season, showFavorites],
    queryFn: async () => {
      const params = {
        page,
        search: search || undefined,
        category: category || undefined,
        occasion: occasion || undefined,
        season: season || undefined,
        is_favorite: showFavorites || undefined,
      };
      const response = await outfitsAPI.list(params);
      return response.data;
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: (outfitId: number) => outfitsAPI.toggleFavorite(outfitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
    },
  });

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setOccasion('');
    setSeason('');
    setShowFavorites(false);
    setPage(1);
  };

  const totalPages = data?.count ? Math.ceil(data.count / 12) : 1;

  return (
    <MainLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">My Outfits</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/outfits/upload')}
          >
            Upload Outfit
          </Button>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterList sx={{ mr: 1 }} />
            <Typography variant="h6">Filters</Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="top">Top</MenuItem>
                <MenuItem value="bottom">Bottom</MenuItem>
                <MenuItem value="dress">Dress</MenuItem>
                <MenuItem value="outerwear">Outerwear</MenuItem>
                <MenuItem value="full_body">Full Body</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Occasion"
                value={occasion}
                onChange={(e) => {
                  setOccasion(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="formal">Formal</MenuItem>
                <MenuItem value="work">Work</MenuItem>
                <MenuItem value="party">Party</MenuItem>
                <MenuItem value="sport">Sport</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Season"
                value={season}
                onChange={(e) => {
                  setSeason(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="spring">Spring</MenuItem>
                <MenuItem value="summer">Summer</MenuItem>
                <MenuItem value="fall">Fall</MenuItem>
                <MenuItem value="winter">Winter</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant={showFavorites ? 'contained' : 'outlined'}
                startIcon={showFavorites ? <Favorite /> : <FavoriteBorder />}
                onClick={() => {
                  setShowFavorites(!showFavorites);
                  setPage(1);
                }}
                sx={{ height: '56px' }}
              >
                Favorites
              </Button>
            </Grid>

            <Grid item xs={12} sm={6} md={1}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClearFilters}
                sx={{ height: '56px' }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {isLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error">
            Failed to load outfits. Please try again.
          </Alert>
        )}

        {data && data.results && (
          <>
            {data.results.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No outfits found
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {showFavorites || search || category || occasion || season
                    ? 'Try adjusting your filters'
                    : 'Start by uploading your first outfit!'}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate('/outfits/upload')}
                >
                  Upload Outfit
                </Button>
              </Box>
            ) : (
              <>
                <Grid container spacing={3}>
                  {data.results.map((outfit: Outfit) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={outfit.id}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardMedia
                          component="img"
                          height="250"
                          image={outfit.image}
                          alt={outfit.name}
                          sx={{ objectFit: 'cover', cursor: 'pointer' }}
                          onClick={() => navigate(`/outfits/${outfit.id}`)}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" noWrap>
                            {outfit.name}
                          </Typography>
                          <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            <Chip label={outfit.category} size="small" />
                            {outfit.occasion && (
                              <Chip label={outfit.occasion} size="small" color="primary" />
                            )}
                            {outfit.season && (
                              <Chip label={outfit.season} size="small" color="secondary" />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Worn {outfit.times_worn} times
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <IconButton
                            size="small"
                            color={outfit.is_favorite ? 'error' : 'default'}
                            onClick={() => favoriteMutation.mutate(outfit.id)}
                            disabled={favoriteMutation.isPending}
                          >
                            {outfit.is_favorite ? <Favorite /> : <FavoriteBorder />}
                          </IconButton>
                          <Button
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => navigate(`/outfits/${outfit.id}`)}
                          >
                            View
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(_, value) => setPage(value)}
                      color="primary"
                    />
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </MainLayout>
  );
};

export default OutfitsPage;
