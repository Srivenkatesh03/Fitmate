import { Box, Typography, Grid, Card, CardContent, CardMedia, Chip, Paper } from '@mui/material';
import { Watch, ShoppingBag, Diamond, Checkroom } from '@mui/icons-material';

interface Accessory {
  type: string;
  name: string;
  description: string;
  image?: string;
}

interface AccessoryRecommendationsProps {
  outfitCategory?: string;
  outfitColor?: string;
  occasion?: string;
}

const AccessoryRecommendations = ({ 
  outfitCategory = 'casual',
  outfitColor = 'blue',
  occasion = 'casual'
}: AccessoryRecommendationsProps) => {
  
  // Generate recommendations based on outfit details
  const generateRecommendations = (): Accessory[] => {
    const recommendations: Accessory[] = [];
    
    // Footwear recommendations
    if (occasion === 'formal' || occasion === 'work') {
      recommendations.push({
        type: 'footwear',
        name: 'Classic Heels',
        description: 'Perfect for formal occasions and professional settings'
      });
    } else if (occasion === 'party') {
      recommendations.push({
        type: 'footwear',
        name: 'Stylish Heels or Dress Shoes',
        description: 'Elevate your party look with elegant footwear'
      });
    } else {
      recommendations.push({
        type: 'footwear',
        name: 'Comfortable Sneakers or Flats',
        description: 'Perfect for casual and everyday wear'
      });
    }
    
    // Jewelry recommendations
    if (occasion === 'formal' || occasion === 'party') {
      recommendations.push({
        type: 'jewelry',
        name: 'Statement Necklace & Earrings',
        description: 'Add sparkle with elegant jewelry pieces'
      });
    } else if (occasion === 'work') {
      recommendations.push({
        type: 'jewelry',
        name: 'Minimal Jewelry Set',
        description: 'Simple and professional jewelry for the workplace'
      });
    } else {
      recommendations.push({
        type: 'jewelry',
        name: 'Casual Accessories',
        description: 'Simple bracelets or earrings for everyday style'
      });
    }
    
    // Bag recommendations
    if (occasion === 'formal') {
      recommendations.push({
        type: 'bag',
        name: 'Clutch or Evening Bag',
        description: 'Elegant small bag for formal events'
      });
    } else if (occasion === 'work') {
      recommendations.push({
        type: 'bag',
        name: 'Professional Tote or Laptop Bag',
        description: 'Practical and stylish for the office'
      });
    } else if (occasion === 'party') {
      recommendations.push({
        type: 'bag',
        name: 'Stylish Crossbody or Clutch',
        description: 'Fashionable bag for social events'
      });
    } else {
      recommendations.push({
        type: 'bag',
        name: 'Casual Shoulder Bag or Backpack',
        description: 'Comfortable and practical for daily use'
      });
    }
    
    // Additional accessories
    if (outfitCategory === 'dress' && occasion !== 'casual') {
      recommendations.push({
        type: 'other',
        name: 'Belt',
        description: 'Cinch your waist for a more defined silhouette'
      });
    }
    
    if (occasion === 'casual' || occasion === 'sport') {
      recommendations.push({
        type: 'other',
        name: 'Watch or Fitness Tracker',
        description: 'Functional accessory for everyday wear'
      });
    }
    
    return recommendations;
  };

  const recommendations = generateRecommendations();

  const getIconForType = (type: string) => {
    switch (type) {
      case 'footwear':
        return <Checkroom />;
      case 'jewelry':
        return <Diamond />;
      case 'bag':
        return <ShoppingBag />;
      case 'other':
        return <Watch />;
      default:
        return <Checkroom />;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'footwear':
        return '#FF6B6B';
      case 'jewelry':
        return '#95E1D3';
      case 'bag':
        return '#FDCB6E';
      case 'other':
        return '#6C5CE7';
      default:
        return '#74B9FF';
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Accessory Recommendations
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Complete your look with these carefully selected accessories
      </Typography>

      <Grid container spacing={2}>
        {recommendations.map((accessory, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      bgcolor: getColorForType(accessory.type),
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {getIconForType(accessory.type)}
                  </Box>
                  <Box flex={1}>
                    <Chip 
                      label={accessory.type.charAt(0).toUpperCase() + accessory.type.slice(1)} 
                      size="small"
                      sx={{ mb: 0.5 }}
                    />
                    <Typography variant="subtitle1" fontWeight="bold">
                      {accessory.name}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {accessory.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Styling Tip
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {occasion === 'formal' 
            ? 'For formal events, keep accessories elegant and coordinated. Less is often more.'
            : occasion === 'party'
            ? 'Party outfits are perfect for bold accessories. Don\'t be afraid to make a statement!'
            : occasion === 'work'
            ? 'Keep work accessories professional and minimal to maintain a polished appearance.'
            : 'For casual wear, mix and match accessories to express your personal style!'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default AccessoryRecommendations;
