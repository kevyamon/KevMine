import React, { useState } from 'react';
import {
  Typography, Container, Box, Paper, Grid, CircularProgress,
  Alert, Button, List, ListItem, ListItemText, Divider, Avatar, IconButton,
  TextField, InputAdornment
} from '@mui/material';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useGetProfileQuery, useUpdateProfilePhotoMutation } from '../redux/slices/usersApiSlice';
import { useGetUserGameStatusQuery, useClaimKeviumMutation } from '../redux/slices/gameApiSlice';
import RobotCard from '../components/RobotCard';
import QuestsList from '../components/QuestsList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate

const ProfileScreen = () => {
  const { data: user, isLoading: isLoadingUser, error: userError } = useGetProfileQuery();
  const { data: gameStatus, error: gameError } = useGetUserGameStatusQuery(undefined, {
    pollingInterval: 10000,
  });
  const [claimKevium, { isLoading: isClaiming }] = useClaimKeviumMutation();
  const [updateProfilePhoto, { isLoading: isUploadingPhoto }] = useUpdateProfilePhotoMutation();

  const [hangarSearchTerm, setHangarSearchTerm] = useState('');
  const navigate = useNavigate(); // Initialiser useNavigate

  const uploadPhotoHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      await updateProfilePhoto(formData).unwrap();
      toast.success('Avatar mis à jour avec succès !');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleClaim = async () => {
    try {
      const res = await claimKevium().unwrap();
      toast.success(res.message);
    } catch (err) { toast.error(err?.data?.message || err.error); }
  };

  // Fonction pour naviguer vers le marché
  const goToStore = () => {
    navigate('/store');
  };

  if (isLoadingUser) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
  }

  const error = userError || gameError;
  if (error) {
    return <Container maxWidth="md"><Alert severity="error" sx={{ mt: 3 }}>Erreur: {error?.data?.message || error.error}</Alert></Container>;
  }

  const unclaimed = gameStatus?.unclaimedKevium || 0;
  const sortedPurchaseHistory = user?.purchaseHistory ? [...user.purchaseHistory].reverse() : [];
  const sortedSalesHistory = user?.salesHistory ? [...user.salesHistory].reverse() : [];

  const filteredInventory = user?.inventory?.filter(robot => 
    robot.name.toLowerCase().includes(hangarSearchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, px: { xs: 2, sm: 3 } }}>
      <Grid container spacing={4}>
        {/* Colonne de gauche: Infos joueur et Quêtes */}
        <Grid item xs={12} md={8}>
          <Paper elevation={6} sx={{ p: { xs: 2, sm: 4 }, backgroundColor: 'rgba(30, 30, 30, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 3,
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar src={user?.photo} sx={{ width: 100, height: 100, border: '2px solid', borderColor: 'primary.main' }}>
                  {user?.name.charAt(0)}
                </Avatar>
                <IconButton color="primary" component="label" sx={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <input type="file" hidden accept="image/*" onChange={uploadPhotoHandler} />
                  {isUploadingPhoto ? <CircularProgress size={24} /> : <PhotoCamera />}
                </IconButton>
              </Box>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>{user?.name}</Typography>
                <Typography variant="body1" color="text.secondary">Email: {user?.email}</Typography>
                {user?.phone && <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>Téléphone: {user.phone}</Typography>}
              </Box>
            </Box>
            <Typography variant="h5" component="h2" color="primary.main" sx={{ 
              mt: 3, 
              fontWeight: 'bold',
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              Solde : {user?.keviumBalance.toLocaleString()} KVM
            </Typography>
          </Paper>

          <Paper elevation={6} sx={{ p: { xs: 2, sm: 4 }, mt: 4, backgroundColor: 'rgba(30, 30, 30, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.12)', textAlign: 'center' }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>Minage en Cours</Typography>
            <Typography variant="h4" color="secondary.main" sx={{ my: 2 }}>{unclaimed.toFixed(8)} KVM</Typography>
            {/* TEXTE SECONDAIRE EN BLANC */}
            <Typography variant="body2" color="white" sx={{ mb: 2 }}>Gains non réclamés</Typography>
            <Button variant="contained" color="secondary" size="large" onClick={handleClaim} disabled={isClaiming || unclaimed < 0.00000001}>
              {isClaiming ? <CircularProgress size={26} /> : 'Réclamer mes KVM'}
            </Button>
          </Paper>

          <Box sx={{ mt: 4 }}>
            <QuestsList />
          </Box>
        </Grid>

        {/* Colonne de droite: Historique et Hangar */}
        <Grid item xs={12} md={4}>
          <Paper elevation={6} sx={{ p: { xs: 2, sm: 3 }, backgroundColor: 'rgba(30, 30, 30, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.12)', mb: 4 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>Historique des Transactions</Typography>
            <Box sx={{ maxHeight: '220px', overflowY: 'auto', pr: 1 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><ShoppingCartIcon /> Achats</Typography>
              <List dense>
                {sortedPurchaseHistory.length > 0 ? sortedPurchaseHistory.map((item, index) => (
                  <ListItem key={`purchase-${index}`} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <ListItemText primary={`${item.robotName} - ${item.price} KVM`} />
                    {/* TEXTE SECONDAIRE EN BLANC */}
                    <Typography variant="caption" color="white">{new Date(item.purchaseDate).toLocaleString()}</Typography>
                  </ListItem>
                )) : <Typography variant="body2" color="white" sx={{ p: 2 }}>Aucun achat récent.</Typography>} {/* TEXTE SECONDAIRE EN BLANC */}
              </List>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ maxHeight: '220px', overflowY: 'auto', pr: 1 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><PointOfSaleIcon /> Ventes</Typography>
              <List dense>
                {sortedSalesHistory.length > 0 ? sortedSalesHistory.map((item, index) => (
                  <ListItem key={`sale-${index}`} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <ListItemText primary={`${item.robotName} - Gain: ${item.userRevenue} KVM`} secondary={`(Vendu ${item.salePrice} KVM)`}/>
                    {/* TEXTE SECONDAIRE EN BLANC */}
                    <Typography variant="caption" color="white">{new Date(item.saleDate).toLocaleString()}</Typography>
                  </ListItem>
                )) : <Typography variant="body2" color="white" sx={{ p: 2 }}>Aucune vente récente.</Typography>} {/* TEXTE SECONDAIRE EN BLANC */}
              </List>
            </Box>
          </Paper>
          
          <Box>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>Mon Hangar à Robots</Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher un robot..."
              value={hangarSearchTerm}
              onChange={(e) => setHangarSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Paper elevation={3} sx={{ p: 2, maxHeight: '600px', overflowY: 'auto', backgroundColor: 'transparent', border: '1px solid rgba(255, 255, 255, 0.12)'}}>
              {filteredInventory && filteredInventory.length > 0 ? (
                <Grid container spacing={4}>
                  {filteredInventory.map((robot) => (
                    <Grid item key={robot._id} xs={12}>
                      <RobotCard robot={robot} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  {/* TEXTE SECONDAIRE EN BLANC */}
                  <Typography color="white" sx={{ mb: 2 }}>
                    {user?.inventory?.length > 0 ? 'Aucun robot ne correspond à votre recherche.' : 'Vous ne possédez aucun robot.'}
                  </Typography>
                  {/* BOUTON ROUGE POUR LE MARCHÉ */}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={goToStore}
                    sx={{
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: 'darkred',
                      },
                    }}
                  >
                    Visitez le marché !
                  </Button>
                </Box>
              )}
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfileScreen;