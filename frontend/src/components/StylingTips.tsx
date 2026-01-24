import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import { 
  Lightbulb, 
  Palette, 
  CheckCircle, 
  Star,
  TipsAndUpdates
} from '@mui/icons-material';

interface StylingTipsProps {
  bodyShape?: string;
  occasion?: string;
  category?: string;
  color?: string;
}

const StylingTips = ({ 
  bodyShape = 'rectangle',
  occasion = 'casual',
  category = 'dress',
  color = ''
}: StylingTipsProps) => {
  
  // Generate body shape specific tips
  const getBodyShapeTips = () => {
    switch (bodyShape) {
      case 'hourglass':
        return [
          'Emphasize your balanced proportions with fitted clothing',
          'Wrap dresses and belted styles work wonderfully',
          'V-necklines and scoop necks complement your shape',
        ];
      case 'triangle':
        return [
          'Balance wider hips with detailed or structured tops',
          'A-line skirts and wide-leg pants are flattering',
          'Boat necks and off-shoulder styles draw attention upward',
        ];
      case 'inverted_triangle':
        return [
          'Balance broader shoulders with A-line or flared bottoms',
          'V-necks and vertical details create a slimming effect',
          'Darker colors on top, lighter on bottom create balance',
        ];
      case 'rectangle':
        return [
          'Create curves with peplum tops and belted dresses',
          'Layering adds dimension to your silhouette',
          'Ruffles and details at bust or hips add definition',
        ];
      case 'oval':
        return [
          'Empire waist and A-line cuts are very flattering',
          'V-necks elongate the torso beautifully',
          'Structured fabrics and vertical lines create a streamlined look',
        ];
      default:
        return [
          'Focus on what makes you feel confident and comfortable',
          'Experiment with different styles to find your favorites',
          'The best outfit is one that makes you feel amazing',
        ];
    }
  };

  // Generate occasion-specific tips
  const getOccasionTips = () => {
    switch (occasion) {
      case 'formal':
        return [
          'Stick to classic silhouettes and quality fabrics',
          'Opt for neutral or jewel tones for elegance',
          'Keep accessories sophisticated and coordinated',
        ];
      case 'party':
        return [
          'Bold colors and statement pieces are perfect',
          'Metallic accents and sequins add festive flair',
          'Don\'t shy away from trendy styles and accessories',
        ];
      case 'work':
        return [
          'Choose structured, professional pieces',
          'Neutral colors with subtle patterns work best',
          'Ensure proper fit for a polished appearance',
        ];
      case 'casual':
        return [
          'Comfort is key - choose breathable fabrics',
          'Mix and match pieces for versatile looks',
          'Add personality with fun accessories',
        ];
      case 'sport':
        return [
          'Prioritize moisture-wicking, stretchy fabrics',
          'Ensure proper fit for freedom of movement',
          'Layer strategically for temperature control',
        ];
      default:
        return [];
    }
  };

  // Generate color coordination tips
  const getColorTips = () => {
    const tips = [
      'Monochromatic looks create a sophisticated appearance',
      'Complementary colors make outfits pop',
      'Neutral bases allow for bold accent pieces',
    ];
    
    if (color) {
      const colorLower = color.toLowerCase();
      if (colorLower.includes('black')) {
        tips.push('Black is versatile - add colorful accessories to brighten');
      } else if (colorLower.includes('white') || colorLower.includes('cream')) {
        tips.push('White/cream creates a fresh canvas for statement accessories');
      } else if (colorLower.includes('blue')) {
        tips.push('Blue pairs beautifully with neutrals and warm metallics');
      } else if (colorLower.includes('red')) {
        tips.push('Red makes a bold statement - keep other elements simple');
      }
    }
    
    return tips.slice(0, 3);
  };

  // Category-specific tips
  const getCategoryTips = () => {
    switch (category) {
      case 'dress':
        return [
          'The right undergarments make all the difference',
          'Consider the dress length appropriate for the occasion',
        ];
      case 'top':
        return [
          'Tuck or leave untucked based on your proportions',
          'Consider layering for added interest',
        ];
      case 'bottom':
        return [
          'Ensure the rise flatters your body type',
          'Hem length should complement your footwear choice',
        ];
      default:
        return [];
    }
  };

  const bodyShapeTips = getBodyShapeTips();
  const occasionTips = getOccasionTips();
  const colorTips = getColorTips();
  const categoryTips = getCategoryTips();

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <TipsAndUpdates color="primary" />
        <Typography variant="h6">
          Styling Tips
        </Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Personalized styling advice based on your body shape and outfit details
      </Typography>

      {/* Body Shape Tips */}
      {bodyShape && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Chip 
              label={bodyShape.replace('_', ' ').charAt(0).toUpperCase() + bodyShape.slice(1).replace('_', ' ')} 
              size="small" 
              color="primary"
            />
            <Typography variant="subtitle2">Body Shape Tips</Typography>
          </Box>
          <List dense>
            {bodyShapeTips.map((tip, index) => (
              <ListItem key={index}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircle color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={tip}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Occasion Tips */}
      {occasionTips.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Chip 
              label={occasion.charAt(0).toUpperCase() + occasion.slice(1)} 
              size="small" 
              color="secondary"
            />
            <Typography variant="subtitle2">Occasion Styling</Typography>
          </Box>
          <List dense>
            {occasionTips.map((tip, index) => (
              <ListItem key={index}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Star color="warning" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={tip}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Color Tips */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Palette fontSize="small" color="action" />
          <Typography variant="subtitle2">Color Coordination</Typography>
        </Box>
        <List dense>
          {colorTips.map((tip, index) => (
            <ListItem key={index}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Lightbulb color="info" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={tip}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Category Specific Tips */}
      {categoryTips.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            {category.charAt(0).toUpperCase() + category.slice(1)} Specific Tips
          </Typography>
          <List dense>
            {categoryTips.map((tip, index) => (
              <ListItem key={index}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircle color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={tip}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* General Tip */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.50', borderRadius: 1, borderLeft: 4, borderColor: 'primary.main' }}>
        <Typography variant="subtitle2" gutterBottom color="primary.main">
          💡 Pro Tip
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Confidence is your best accessory! Wear what makes you feel comfortable and expresses your unique style.
        </Typography>
      </Box>
    </Paper>
  );
};

export default StylingTips;
