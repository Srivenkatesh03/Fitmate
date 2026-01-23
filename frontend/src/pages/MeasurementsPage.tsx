import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  MenuItem,
  Divider,
  Card,
} from '@mui/material';
import { Save, ViewInAr } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { measurementsAPI, MeasurementData } from '../services/api';
import { BodyModel3D } from '../components/3d';

const MeasurementsPage = () => {
  const queryClient = useQueryClient();
  const [show3DModel, setShow3DModel] = useState(true);

  const { data: measurements, isLoading, error } = useQuery({
    queryKey: ['measurements'],
    queryFn: async () => {
      const response = await measurementsAPI.get();
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: MeasurementData) => {
      if (measurements) {
        return measurementsAPI.update(data);
      }
      return measurementsAPI.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurements'] });
    },
  });

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<MeasurementData>({
    defaultValues: {
      height: 0,
      weight: 0,
      chest: 0,
      waist: 0,
      hips: 0,
      shoulder: 0,
      gender: 'other',
    },
  });

  // Watch form values for real-time 3D model updates
  const formValues = watch();

  useEffect(() => {
    if (measurements) {
      reset(measurements);
    }
  }, [measurements, reset]);

  const onSubmit = (data: MeasurementData) => {
    mutation.mutate(data);
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

  return (
    <MainLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              My Body Measurements
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter your body measurements to get accurate fit predictions for your outfits.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ViewInAr />}
            onClick={() => setShow3DModel(!show3DModel)}
          >
            {show3DModel ? 'Hide' : 'Show'} 3D Model
          </Button>
        </Box>

        {show3DModel && (
          <Card sx={{ mb: 3, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              3D Body Visualization
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Interactive 3D model of your body based on your measurements. Use your mouse to rotate and zoom.
            </Typography>
            <Box sx={{ height: '500px', width: '100%' }}>
              <BodyModel3D
                height={formValues.height || measurements?.height || 170}
                chest={formValues.chest || measurements?.chest || 90}
                waist={formValues.waist || measurements?.waist || 75}
                hips={formValues.hips || measurements?.hips || 95}
                gender={formValues.gender || measurements?.gender || 'other'}
              />
            </Box>
          </Card>
        )}

        <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Failed to load measurements. Please try again.
            </Alert>
          )}

          {mutation.isSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Measurements saved successfully!
            </Alert>
          )}

          {mutation.isError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Failed to save measurements. Please try again.
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: 'Gender is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Gender"
                      error={!!errors.gender}
                      helperText={errors.gender?.message}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="height"
                  control={control}
                  rules={{
                    required: 'Height is required',
                    min: { value: 50, message: 'Height must be at least 50 cm' },
                    max: { value: 300, message: 'Height must be less than 300 cm' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      fullWidth
                      label="Height (cm)"
                      error={!!errors.height}
                      helperText={errors.height?.message}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="weight"
                  control={control}
                  rules={{
                    required: 'Weight is required',
                    min: { value: 20, message: 'Weight must be at least 20 kg' },
                    max: { value: 300, message: 'Weight must be less than 300 kg' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      fullWidth
                      label="Weight (kg)"
                      error={!!errors.weight}
                      helperText={errors.weight?.message}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Body Measurements (Optional)
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="chest"
                  control={control}
                  rules={{
                    min: { value: 0, message: 'Chest must be positive' },
                    max: { value: 200, message: 'Chest must be less than 200 cm' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      fullWidth
                      label="Chest (cm)"
                      error={!!errors.chest}
                      helperText={errors.chest?.message || 'Measure around the fullest part'}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="waist"
                  control={control}
                  rules={{
                    min: { value: 0, message: 'Waist must be positive' },
                    max: { value: 200, message: 'Waist must be less than 200 cm' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      fullWidth
                      label="Waist (cm)"
                      error={!!errors.waist}
                      helperText={errors.waist?.message || 'Measure at natural waistline'}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="hips"
                  control={control}
                  rules={{
                    min: { value: 0, message: 'Hips must be positive' },
                    max: { value: 200, message: 'Hips must be less than 200 cm' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      fullWidth
                      label="Hips (cm)"
                      error={!!errors.hips}
                      helperText={errors.hips?.message || 'Measure at fullest point'}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="shoulder"
                  control={control}
                  rules={{
                    min: { value: 0, message: 'Shoulder must be positive' },
                    max: { value: 100, message: 'Shoulder must be less than 100 cm' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      fullWidth
                      label="Shoulder (cm)"
                      error={!!errors.shoulder}
                      helperText={errors.shoulder?.message || 'Measure across shoulders'}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Save />}
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? 'Saving...' : 'Save Measurements'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default MeasurementsPage;
