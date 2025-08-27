import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Container, Box, Paper } from '@mui/material';

const ProfileScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', color: 'white', width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Profil de l'utilisateur
        </Typography>
        {userInfo ? (
          <Box>
            <Typography variant="h6">Nom: {userInfo.name}</Typography>
            <Typography variant="body1">Email: {userInfo.email}</Typography>
          </Box>
        ) : (
          <Typography variant="body1">
            Veuillez vous connecter pour voir votre profil.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ProfileScreen;