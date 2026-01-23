import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import {
  Checkroom,
  Favorite,
  Timeline,
  TrendingUp,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import MainLayout from '../components/layout/MainLayout';
import { outfitsAPI, predictionsAPI } from '../services/api';

interface Prediction {
  id: number;
  outfit: {
    id: number;
    name: string;
  };
  fit_status: 'perfect_fit' | 'acceptable_fit' | 'poor_fit';
  confidence_score: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AnalyticsPage = () => {
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['outfit-stats'],
    queryFn: async () => {
      const response = await outfitsAPI.stats();
      return response.data;
    },
  });

  const { data: predictions, isLoading: predictionsLoading } = useQuery({
    queryKey: ['predictions-analytics'],
    queryFn: async () => {
      const response = await predictionsAPI.history();
      return response.data;
    },
  });

  const isLoading = statsLoading || predictionsLoading;

  // Process prediction data for charts
  const fitStatusData = predictions ? [
    { name: 'Perfect Fit', value: predictions.filter((p: Prediction) => p.fit_status === 'perfect_fit').length },
    { name: 'Acceptable Fit', value: predictions.filter((p: Prediction) => p.fit_status === 'acceptable_fit').length },
    { name: 'Poor Fit', value: predictions.filter((p: Prediction) => p.fit_status === 'poor_fit').length },
  ].filter(item => item.value > 0) : [];

  // Process category data
  const categoryData = stats?.by_category ? Object.entries(stats.by_category).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value as number,
  })) : [];

  // Process occasion data
  const occasionData = stats?.by_occasion ? Object.entries(stats.by_occasion).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value as number,
  })) : [];

  // Process season data
  const seasonData = stats?.by_season ? Object.entries(stats.by_season).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value as number,
  })) : [];

  if (isLoading) {
    return (
      <MainLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (statsError) {
    return (
      <MainLayout>
        <Alert severity="error">
          Failed to load analytics. Please try again.
        </Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Wardrobe Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Get insights into your wardrobe and outfit predictions.
        </Typography>

        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Checkroom sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats?.total_outfits || 0}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Outfits
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Favorite sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats?.favorite_count || 0}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Favorites
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Timeline sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{predictions?.length || 0}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Predictions Made
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats?.total_times_worn || 0}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Times Worn
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Charts */}
          {categoryData.length > 0 && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Outfits by Category
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          )}

          {fitStatusData.length > 0 && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Fit Predictions Distribution
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={fitStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {fitStatusData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          )}

          {occasionData.length > 0 && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Outfits by Occasion
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={occasionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          )}

          {seasonData.length > 0 && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Outfits by Season
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={seasonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          )}

          {/* Most Worn Outfits */}
          {stats?.most_worn && stats.most_worn.length > 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Most Worn Outfits
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  {stats.most_worn.map((outfit: any) => (
                    <Grid item xs={12} sm={6} md={3} key={outfit.id}>
                      <Card>
                        <CardContent>
                          <Typography variant="subtitle1" noWrap gutterBottom>
                            {outfit.name}
                          </Typography>
                          <Chip
                            label={`Worn ${outfit.times_worn} times`}
                            color="primary"
                            size="small"
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          )}

          {/* Empty State */}
          {(!stats || stats.total_outfits === 0) && (
            <Grid item xs={12}>
              <Paper sx={{ p: 6, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No data available yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload some outfits to see your wardrobe analytics!
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default AnalyticsPage;
