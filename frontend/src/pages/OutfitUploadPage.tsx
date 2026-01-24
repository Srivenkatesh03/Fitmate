import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  Card,
  CardMedia,
  IconButton,
  Divider,
} from '@mui/material';
import { CloudUpload, Close, Save } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { outfitsAPI } from '../services/api';

interface OutfitFormData {
  name: string;
  category: string;
  occasion?: string;
  season?: string;
  brand?: string;
  size?: string;
  color?: string;
  notes?: string;
  garment_length?: number;
  garment_chest?: number;
  garment_waist?: number;
  garment_hips?: number;
}

const OutfitUploadPage = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: OutfitFormData) => {
      const formData = new FormData();
      
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value.toString());
        }
      });

      return outfitsAPI.create(formData);
    },
    onSuccess: (response) => {
      navigate(`/outfits/${response.data.id}`);
    },
  });

  const { control, handleSubmit, watch, formState: { errors } } = useForm<OutfitFormData>({
    defaultValues: {
      name: '',
      category: '',
      occasion: '',
      season: '',
      brand: '',
      size: '',
      color: '',
      notes: '',
    },
  });

  // Watch category to conditionally require measurements
  const selectedCategory = watch('category');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
  });

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = (data: OutfitFormData) => {
    if (!imageFile) {
      return;
    }
    mutation.mutate(data);
  };

  return (
    <MainLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Upload New Outfit
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Add a new outfit to your wardrobe with details and measurements.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Outfit Image
                </Typography>

                {!imagePreview ? (
                  <Box
                    {...getRootProps()}
                    sx={{
                      border: '2px dashed',
                      borderColor: isDragActive ? 'primary.main' : 'grey.400',
                      borderRadius: 2,
                      p: 4,
                      textAlign: 'center',
                      cursor: 'pointer',
                      bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <input {...getInputProps()} />
                    <CloudUpload sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      {isDragActive ? 'Drop image here' : 'Drag & drop outfit image'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      or click to browse files
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Supported: JPG, PNG, GIF, WebP
                    </Typography>
                  </Box>
                ) : (
                  <Card>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        image={imagePreview}
                        alt="Preview"
                        sx={{ maxHeight: 400, objectFit: 'contain' }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'background.paper',
                          '&:hover': { bgcolor: 'error.main', color: 'white' },
                        }}
                        onClick={handleRemoveImage}
                      >
                        <Close />
                      </IconButton>
                    </Box>
                  </Card>
                )}

                {!imageFile && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Please upload an image of your outfit
                  </Alert>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Outfit Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: 'Name is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Outfit Name"
                          error={!!errors.name}
                          helperText={errors.name?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: 'Category is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Category"
                          error={!!errors.category}
                          helperText={errors.category?.message}
                        >
                          <MenuItem value="top">Top</MenuItem>
                          <MenuItem value="bottom">Bottom</MenuItem>
                          <MenuItem value="dress">Dress</MenuItem>
                          <MenuItem value="outerwear">Outerwear</MenuItem>
                          <MenuItem value="full_body">Full Body</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="size"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} fullWidth label="Size (e.g., M, L, 32)" />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="occasion"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} select fullWidth label="Occasion">
                          <MenuItem value="">None</MenuItem>
                          <MenuItem value="casual">Casual</MenuItem>
                          <MenuItem value="formal">Formal</MenuItem>
                          <MenuItem value="work">Work</MenuItem>
                          <MenuItem value="party">Party</MenuItem>
                          <MenuItem value="sport">Sport</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="season"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} select fullWidth label="Season">
                          <MenuItem value="">None</MenuItem>
                          <MenuItem value="spring">Spring</MenuItem>
                          <MenuItem value="summer">Summer</MenuItem>
                          <MenuItem value="fall">Fall</MenuItem>
                          <MenuItem value="winter">Winter</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="brand"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} fullWidth label="Brand" />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="color"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} fullWidth label="Color" />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                      Garment Measurements {selectedCategory === 'dress' && <span style={{ color: 'red' }}>*</span>}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {selectedCategory === 'dress' 
                        ? 'Required for dress category to ensure accurate fit predictions'
                        : 'Optional: These help improve fit predictions'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="garment_length"
                      control={control}
                      rules={selectedCategory === 'dress' ? {
                        required: 'Length is required for dresses',
                        min: { value: 1, message: 'Length must be positive' }
                      } : undefined}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          fullWidth
                          label={`Length (cm)${selectedCategory === 'dress' ? ' *' : ''}`}
                          error={!!errors.garment_length}
                          helperText={errors.garment_length?.message}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="garment_chest"
                      control={control}
                      rules={selectedCategory === 'dress' ? {
                        required: 'Chest measurement is required for dresses',
                        min: { value: 1, message: 'Chest must be positive' }
                      } : undefined}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          fullWidth
                          label={`Chest (cm)${selectedCategory === 'dress' ? ' *' : ''}`}
                          error={!!errors.garment_chest}
                          helperText={errors.garment_chest?.message}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="garment_waist"
                      control={control}
                      rules={selectedCategory === 'dress' ? {
                        required: 'Waist measurement is required for dresses',
                        min: { value: 1, message: 'Waist must be positive' }
                      } : undefined}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          fullWidth
                          label={`Waist (cm)${selectedCategory === 'dress' ? ' *' : ''}`}
                          error={!!errors.garment_waist}
                          helperText={errors.garment_waist?.message}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="garment_hips"
                      control={control}
                      rules={selectedCategory === 'dress' ? {
                        required: 'Hips measurement is required for dresses',
                        min: { value: 1, message: 'Hips must be positive' }
                      } : undefined}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          fullWidth
                          label={`Hips (cm)${selectedCategory === 'dress' ? ' *' : ''}`}
                          error={!!errors.garment_hips}
                          helperText={errors.garment_hips?.message}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="notes"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={3}
                          label="Notes"
                          placeholder="Add any notes about this outfit..."
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                {mutation.isError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    Failed to upload outfit. Please try again.
                  </Alert>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/outfits')}
                    disabled={mutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={!imageFile || mutation.isPending}
                  >
                    {mutation.isPending ? 'Uploading...' : 'Upload Outfit'}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </Box>
    </MainLayout>
  );
};

export default OutfitUploadPage;
