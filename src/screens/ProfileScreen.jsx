import React from 'react';
import {
  Typography, Container, Box, Paper, Grid, CircularProgress,
  Alert, Button, List, ListItem, ListItemText, Divider,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useGetProfileQuery } from '../redux/slices/usersApiSlice';
import { useGetUserGameStatusQuery, useClaimKeviumMutation } from '../redux/slices/gameApiSlice';
import RobotCard from '../components/RobotCard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

const ProfileScreen = () => {
  const { data: user, isLoading: isLoadingUser, error: userError } = useGetProfileQuery();
  const { data: gameStatus, error: gameError } = useGetUserGameStatusQuery(undefined, {
    pollingInterval: 10000,
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
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
  }

  const error = userError || gameError;
  if (error) {
    return <Container maxWidth="md"><Alert severity="error" sx={{ mt: 3 }}>Erreur: {error?.data?.message || error.error}</Alert></Container>;
  }

  const unclaimed = gameStatus?.unclaimedKevium || 0;
  
  // Trier les historiques par date, du plus récent au plus ancien
  const sortedPurchaseHistory = user?.purchaseHistory ? [...user.purchaseHistory].reverse() : [];
  const sortedSalesHistory = user?.salesHistory ? [...user.salesHistory].reverse() : [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, px: { xs: 2, sm: 3 } }}>
      <Grid container spacing={4}>
        {/* Colonne de gauche: Infos principales et Hangar */}
        <Grid item xs={12} md={8}>
          <Paper elevation={6} sx={{ p: { xs: 2, sm: 4 }, backgroundColor: 'rgba(30, 30, 30, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>Profil de {user?.name}</Typography>
            <Typography variant="body1" color="text.secondary">Email: {user?.email}</Typography>
            {user?.phone && <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>Téléphone: {user.phone}</Typography>}
            <Typography variant="h5" component="h2" color="primary.main" sx={{ mt: 2, fontWeight: 'bold' }}>Solde : {user?.keviumBalance.toLocaleString()} KVM</Typography>
          </Paper>

          <Paper elevation={6} sx={{ p: { xs: 2, sm: 4 }, mt: 4, backgroundColor: 'rgba(30, 30, 30, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.12)', textAlign: 'center' }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>Minage en Cours</Typography>
            <Typography variant="h4" color="secondary.main" sx={{ my: 2 }}>{unclaimed.toFixed(8)} KVM</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Gains non réclamés</Typography>
            <Button variant="contained" color="secondary" size="large" onClick={handleClaim} disabled={isClaiming || unclaimed < 0.00000001}>
              {isClaiming ? <CircularProgress size={26} /> : 'Réclamer mes KVM'}
            </Button>
          </Paper>

          <Box sx={{ mt: 5 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>Mon Hangar à Robots</Typography>
            {user?.inventory?.length > 0 ? (
              <Grid container spacing={4}>
                {user.inventory.map((robot) => (
                  <Grid item key={robot._id} xs={12} sm={6} lg={4}>
                    <RobotCard robot={robot} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography color="text.secondary">Vous ne possédez aucun robot. Visitez le <a href="/store" style={{ color: '#FFD700' }}>marché</a> !</Typography>
            )}
          </Box>
        </Grid>

        {/* Colonne de droite: Historique des transactions */}
        <Grid item xs={12} md={4}>
          <Paper elevation={6} sx={{ p: { xs: 2, sm: 3 }, backgroundColor: 'rgba(30, 30, 30, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>Historique des Transactions</Typography>
            
            {/* Historique des achats */}
            <Box>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><ShoppingCartIcon /> Achats</Typography>
              <List dense>
                {sortedPurchaseHistory.length > 0 ? sortedPurchaseHistory.map((item, index) => (
                  <ListItem key={`purchase-${index}`} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <ListItemText primary={`${item.robotName} - ${item.price} KVM`} />
                    <Typography variant="caption" color="text.secondary">{new Date(item.purchaseDate).toLocaleString()}</Typography>
                  </ListItem>
                )) : <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>Aucun achat récent.</Typography>}
              </List>
            </Box>
            
            <Divider sx={{ my: 2 }} />

            {/* Historique des ventes */}
            <Box>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><PointOfSaleIcon /> Ventes</Typography>
              <List dense>
                {sortedSalesHistory.length > 0 ? sortedSalesHistory.map((item, index) => (
                  <ListItem key={`sale-${index}`} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <ListItemText primary={`${item.robotName} - Gain: ${item.userRevenue} KVM`} secondary={`(Vendu ${item.salePrice} KVM)`}/>
                    <Typography variant="caption" color="text.secondary">{new Date(item.saleDate).toLocaleString()}</Typography>
                  </ListItem>
                )) : <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>Aucune vente récente.</Typography>}
              </List>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfileScreen;