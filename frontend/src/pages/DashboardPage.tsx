import { Container, Typography, Box, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Fitmate, {user?.first_name || user?.username}!
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Your AI-Powered Outfit Fit Prediction Platform
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            My Outfits
          </Button>
          <Button variant="outlined" color="primary" sx={{ mr: 2 }}>
            My Measurements
          </Button>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1">
            This is a basic dashboard. Full features coming soon!
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage;
