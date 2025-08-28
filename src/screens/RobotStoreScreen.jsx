import React from 'react';
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { useGetRobotsQuery } from '../redux/slices/robotsApiSlice';
import RobotCard from '../components/RobotCard';

const RobotStoreScreen = () => {
  const { data: robots, isLoading, error } = useGetRobotsQuery();

  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        textAlign="center"
        sx={{ fontWeight: 'bold', color: 'primary.main' }}
      >
        Marché des Robots
      </Typography>
      <Typography
        variant="h6"
        component="p"
        gutterBottom
        textAlign="center"
        // Changement de couleur ici : de 'text.secondary' à 'white' ou une couleur plus claire
        sx={{ mb: 5, color: 'white' }}
      >
        Acquérez de nouveaux robots pour augmenter votre production de Kevium.
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 3 }}>
          Erreur de chargement des robots : {error?.data?.message || error.error}
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {robots.map((robot) => (
            <Grid item key={robot._id} xs={12} sm={6} md={4}>
              <RobotCard robot={robot} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default RobotStoreScreen;