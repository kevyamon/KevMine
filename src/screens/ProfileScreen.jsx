import React from 'react';
import {
  Typography,
  Container,
  Box,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useGetProfileQuery } from '../redux/slices/usersApiSlice';
import RobotCard from '../components/RobotCard'; // On réutilise la carte du marché !

const ProfileScreen = () => {
  const { data: user, isLoading, error } = useGetProfileQuery();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 3 }}>
          Erreur de chargement du profil : {error?.data?.message || error.error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          backgroundColor: 'rgba(30, 30, 30, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Profil de {user?.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Email: {user?.email}
        </Typography>
        <Typography
          variant="h5"
          color="primary.main"
          sx={{ mt: 2, fontWeight: 'bold' }}
        >
          Solde : {user?.keviumBalance.toLocaleString()} KVM
        </Typography>
      </Paper>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Mon Hangar à Robots
        </Typography>
        {user?.inventory?.length > 0 ? (
          <Grid container spacing={4}>
            {user.inventory.map((robot) => (
              <Grid item key={robot._id} xs={12} sm={6} md={4}>
                {/* On ne passe pas la prop 'robot' à RobotCard, car elle n'est pas conçue pour l'inventaire */}
                <RobotCard robot={robot} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">
            Vous ne possédez aucun robot pour le moment. Allez faire un tour au{' '}
            <a href="/store" style={{ color: '#FFD700' }}>
              marché
            </a>{' '}
            !
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default ProfileScreen;