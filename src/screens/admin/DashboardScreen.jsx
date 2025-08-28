import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useGetStatsQuery } from '../../redux/slices/dashboardApiSlice';

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%',
      backgroundColor: 'background.paper',
    }}
  >
    <Box>
      <Typography color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" component="p" sx={{ fontWeight: 'bold' }}>
        {value.toLocaleString()}
      </Typography>
    </Box>
    <Box sx={{ color: color, fontSize: 40 }}>{icon}</Box>
  </Paper>
);

const DashboardScreen = () => {
  const { data: stats, isLoading, error } = useGetStatsQuery(undefined, {
      pollingInterval: 30000, // Rafraîchir toutes les 30 secondes
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">Impossible de charger les statistiques.</Alert>;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
            Tableau de Bord
        </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Joueurs Actifs" value={stats.totalPlayers} icon={<PeopleIcon sx={{fontSize: 50}} />} color="secondary.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Robots en Circulation" value={stats.robotsInCirculation} icon={<SmartToyIcon sx={{fontSize: 50}} />} color="primary.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Kevium Total" value={Math.round(stats.totalKevium)} icon={<MonetizationOnIcon sx={{fontSize: 50}} />} color="success.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Robots en Vente" value={stats.playerSaleRobots} icon={<StorefrontIcon sx={{fontSize: 50}} />} color="warning.main" />
        </Grid>

        {/* Espace pour de futurs graphiques */}
        <Grid item xs={12}>
            <Paper sx={{p: 2, mt: 4}}>
                <Typography variant="h6">Activité Récente (Prochainement)</Typography>
            </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardScreen;