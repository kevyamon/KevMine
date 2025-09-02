import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Slider,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { toast } from 'react-toastify';
import {
  useGetGameSettingsQuery,
  useUpdateGameSettingsMutation,
} from '../../redux/slices/adminApiSlice';

const GameSettingsScreen = () => {
  const { data: settings, isLoading, error } = useGetGameSettingsQuery();
  const [updateGameSettings, { isLoading: isUpdating }] = useUpdateGameSettingsMutation();

  const [commissionRate, setCommissionRate] = useState(10);

  useEffect(() => {
    if (settings) {
      setCommissionRate(settings.salesCommissionRate * 100);
    }
  }, [settings]);

  const handleSliderChange = (event, newValue) => {
    setCommissionRate(newValue);
  };

  const submitHandler = async () => {
    try {
      const rateToSave = commissionRate / 100;
      await updateGameSettings({ salesCommissionRate: rateToSave }).unwrap();
      toast.success('Paramètres mis à jour avec succès !');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* On applique le même style que les autres pages admin */}
      <Paper elevation={6} sx={{ p: 3, borderRadius: 4, background: 'linear-gradient(145deg, #1f2937, #111827)', color: 'white' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          ⚙️ Paramètres du Jeu
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">Impossible de charger les paramètres du jeu.</Alert>
        ) : (
          <>
            <Box sx={{ mt: 4 }}>
              <Typography gutterBottom sx={{ fontWeight: 'bold' }}>
                Commission sur les Ventes de Robots ({commissionRate}%)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Ceci est le pourcentage prélevé sur la vente d'un robot par un joueur sur le marché.
              </Typography>
              <Slider
                value={commissionRate}
                onChange={handleSliderChange}
                aria-labelledby="commission-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={50}
              />
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={submitHandler}
              disabled={isUpdating}
              sx={{ mt: 3, fontWeight: 'bold' }}
            >
              {isUpdating ? <CircularProgress size={24} /> : 'Sauvegarder les changements'}
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default GameSettingsScreen;