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
      // On convertit le taux (ex: 0.1) en pourcentage (ex: 10) pour le slider
      setCommissionRate(settings.salesCommissionRate * 100);
    }
  }, [settings]);

  const handleSliderChange = (event, newValue) => {
    setCommissionRate(newValue);
  };

  const submitHandler = async () => {
    try {
      // On reconvertit le pourcentage en décimal pour l'envoyer au backend
      const rateToSave = commissionRate / 100;
      await updateGameSettings({ salesCommissionRate: rateToSave }).unwrap();
      toast.success('Paramètres mis à jour avec succès !');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  
  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">Impossible de charger les paramètres du jeu.</Alert>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Paramètres du Jeu
        </Typography>

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
            max={50} // On définit un maximum de 50%
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={submitHandler}
          disabled={isUpdating}
          sx={{ mt: 3 }}
        >
          {isUpdating ? <CircularProgress size={24} /> : 'Sauvegarder les changements'}
        </Button>
      </Paper>
    </Container>
  );
};

export default GameSettingsScreen;