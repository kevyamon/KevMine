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

// J'ai déplacé StatCard ici pour faciliter les ajustements de style
const StatCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={4}
    sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      backgroundColor: '#111827',
      color: 'white',
      borderRadius: 3,
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Typography color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ color: color }}>{icon}</Box>
    </Box>
    <Typography 
      component="p" 
      sx={{ 
        fontWeight: 'bold', 
        wordBreak: 'break-all', // Empêche le débordement
        fontSize: { xs: '1.5rem', sm: '2rem' } // Taille de police responsive
      }}
    >
      {value.toLocaleString()}
    </Typography>
  </Paper>
);

const DashboardScreen = () => {
  const { data: stats, isLoading, error } = useGetStatsQuery(undefined, {
      pollingInterval: 30000,
  });

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={6} sx={{ p: 3, borderRadius: 4, background: 'linear-gradient(145deg, #1f2937, #111827)', color: 'white' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          📊 Tableau de Bord
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">Impossible de charger les statistiques.</Alert>
        ) : stats ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Joueurs Actifs" value={stats.totalPlayers} icon={<PeopleIcon />} color="secondary.main" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Robots en Circulation" value={stats.robotsInCirculation} icon={<SmartToyIcon />} color="primary.main" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Kevium Total" value={Math.round(stats.totalKevium)} icon={<MonetizationOnIcon />} color="success.main" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Robots en Vente" value={stats.playerSaleRobots} icon={<StorefrontIcon />} color="warning.main" />
            </Grid>

            <Grid item xs={12}>
                <Paper sx={{p: 2, mt: 4, backgroundColor: '#111827', color: 'white', borderRadius: 3}}>
                    <Typography variant="h6">Activité Récente (Prochainement)</Typography>
                </Paper>
            </Grid>
          </Grid>
        ) : (
          <Typography>Aucune statistique à afficher.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default DashboardScreen;