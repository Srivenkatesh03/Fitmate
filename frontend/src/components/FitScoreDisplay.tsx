import { Box, Typography, LinearProgress, Chip, Paper, Grid } from '@mui/material';
import { CheckCircle, Warning, Cancel } from '@mui/icons-material';

interface FitScoreDisplayProps {
  fitScore: number;
  fitStatus: string;
  recommendations?: string;
  measurements?: {
    chest?: { status: string; diff: number };
    waist?: { status: string; diff: number };
    hips?: { status: string; diff: number };
  };
}

const FitScoreDisplay = ({ fitScore, fitStatus, recommendations, measurements }: FitScoreDisplayProps) => {
  // Determine color based on score
  const getScoreColor = (score: number): 'success' | 'info' | 'warning' | 'error' => {
    if (score >= 90) return 'success';
    if (score >= 75) return 'info';
    if (score >= 50) return 'warning';
    return 'error';
  };

  const getFitIcon = (status: string) => {
    switch (status) {
      case 'perfect':
        return <CheckCircle color="success" />;
      case 'good':
        return <CheckCircle color="info" />;
      case 'loose':
        return <Warning color="warning" />;
      case 'tight':
        return <Cancel color="error" />;
      default:
        return <Warning color="action" />;
    }
  };

  const getStatusText = (status: string) => {
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

  const getMeasurementStatus = (diff: number): { text: string; color: 'success' | 'info' | 'warning' | 'error' } => {
    if (Math.abs(diff) < 2) return { text: 'Perfect Fit ✓', color: 'success' };
    if (diff >= 2 && diff <= 5) return { text: 'Slightly Loose', color: 'info' };
    if (diff > 5) return { text: 'Loose', color: 'warning' };
    if (diff <= -2 && diff >= -5) return { text: 'Slightly Tight', color: 'warning' };
    return { text: 'Too Tight', color: 'error' };
  };

  const scoreColor = getScoreColor(fitScore);

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {getFitIcon(fitStatus)}
            <Typography variant="h5">
              {Math.round(fitScore)}% Fit Accuracy
            </Typography>
          </Box>
          <Chip 
            label={getStatusText(fitStatus)} 
            color={scoreColor}
            size="medium"
          />
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={fitScore} 
          color={scoreColor}
          sx={{ height: 10, borderRadius: 1 }}
        />
      </Box>

      {measurements && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Detailed Breakdown
          </Typography>
          <Grid container spacing={2}>
            {measurements.chest && (
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Chest
                  </Typography>
                  <Chip 
                    label={getMeasurementStatus(measurements.chest.diff).text}
                    color={getMeasurementStatus(measurements.chest.diff).color}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                  {Math.abs(measurements.chest.diff) > 0.5 && (
                    <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                      {measurements.chest.diff > 0 ? '+' : ''}{measurements.chest.diff.toFixed(1)} cm
                    </Typography>
                  )}
                </Box>
              </Grid>
            )}
            
            {measurements.waist && (
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Waist
                  </Typography>
                  <Chip 
                    label={getMeasurementStatus(measurements.waist.diff).text}
                    color={getMeasurementStatus(measurements.waist.diff).color}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                  {Math.abs(measurements.waist.diff) > 0.5 && (
                    <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                      {measurements.waist.diff > 0 ? '+' : ''}{measurements.waist.diff.toFixed(1)} cm
                    </Typography>
                  )}
                </Box>
              </Grid>
            )}
            
            {measurements.hips && (
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Hips
                  </Typography>
                  <Chip 
                    label={getMeasurementStatus(measurements.hips.diff).text}
                    color={getMeasurementStatus(measurements.hips.diff).color}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                  {Math.abs(measurements.hips.diff) > 0.5 && (
                    <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                      {measurements.hips.diff > 0 ? '+' : ''}{measurements.hips.diff.toFixed(1)} cm
                    </Typography>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {recommendations && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Recommendations
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
            {recommendations}
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Overall Assessment
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {fitScore >= 90 && 'Excellent fit! This outfit matches your measurements perfectly.'}
          {fitScore >= 75 && fitScore < 90 && 'Good fit! This outfit should work well for you with minor adjustments.'}
          {fitScore >= 50 && fitScore < 75 && 'Acceptable fit, but you may want to consider alterations.'}
          {fitScore < 50 && 'This outfit may not be the best fit. Consider trying a different size.'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default FitScoreDisplay;
