import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const LandingScreen = () => {
  const backgroundStyle = {
    minHeight: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(/src/assets/landing-background.jpg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textAlign: 'center',
  };

  return (
    <Box sx={backgroundStyle}>
      <Container maxWidth="sm">
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Bienvenue sur KevMine
        </Typography>
        <Typography variant="h5" component="p" gutterBottom sx={{ mb: 4 }}>
          La meilleure plateforme pour miner de la crypto avec vos robots.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/login"
            startIcon={<LockIcon />}
          >
            Se Connecter
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/register"
            startIcon={<PersonAddIcon />}
          >
            S'inscrire
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingScreen;