import React, { useEffect } from 'react';
import {
  Typography,
  Container,
  Box,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Button,
  LinearProgress,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useGetProfileQuery } from '../redux/slices/usersApiSlice';
import { useGetUserGameStatusQuery, useClaimKeviumMutation } from '../redux/slices/gameApiSlice'; // 1. Importer les hooks de jeu
import RobotCard from '../components/RobotCard';

const ProfileScreen = () => {
  const { data: user, isLoading: isLoadingUser, error: userError } = useGetProfileQuery();
  
  // 2. Utiliser le polling pour rafraîchir les gains toutes les 10 secondes
  const { data: gameStatus, error: gameError } = useGetUserGameStatusQuery(undefined, {
    pollingInterval: 10000, // 10 secondes
  });

  const [claimKevium, { isLoading: isClaiming }] = useClaimKeviumMutation();

  const handleClaim = async () => {
    try {
      const res = await claimKevium().unwrap();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoadingUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (userError || gameError) {
    const error = userError || gameError;
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 3 }}>
          Erreur de chargement des données : {error?.data?.message || error.error}
        </Alert>
      </Container>
    );
  }

  const unclaimed = gameStatus?.unclaimedKevium || 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, px: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 4 },
          backgroundColor: 'rgba(30, 30, 30, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
          Profil de {user?.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
          Email: {user?.email}
        </Typography>
        {user?.phone && (
          <Typography variant="body1" color="text.secondary" sx={{ wordBreak: 'break-word', mt: 1 }}>
            Téléphone: {user.phone}
          </Typography>
        )}
        <Typography
          variant="h5"
          component="h2"
          color="primary.main"
          sx={{ mt: 2, fontWeight: 'bold', wordBreak: 'break-all' }}
        >
          Solde : {user?.keviumBalance.toLocaleString()} KVM
        </Typography>
      </Paper>

      {/* 3. NOUVELLE SECTION DE MINAGE */}
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 4 },
          mt: 4,
          backgroundColor: 'rgba(30, 30, 30, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Minage en Cours
        </Typography>
        <Typography variant="h4" color="secondary.main" sx={{ my: 2 }}>
          {unclaimed.toFixed(8)} KVM
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Gains non réclamés
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleClaim}
          disabled={isClaiming || unclaimed < 0.00000001}
        >
          {isClaiming ? <CircularProgress size={26} /> : 'Réclamer mes KVM'}
        </Button>
      </Paper>
      
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Mon Hangar à Robots
        </Typography>
        {user?.inventory?.length > 0 ? (
          <Grid container spacing={4}>
            {user.inventory.map((robot) => (
              <Grid item key={robot._id} xs={12} sm={6} md={4}>
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