import React, { useEffect } from 'react'; // Importer useEffect
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography, Button, Container } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { keyframes } from '@emotion/react';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const LandingScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  // Étape 1: Ajouter la redirection si l'utilisateur est déjà connecté
  useEffect(() => {
    if (userInfo) {
      navigate('/home');
    }
  }, [userInfo, navigate]);

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
    px: { xs: 2, md: 0 },
  };

  const handlePlayClick = () => {
    navigate('/register');
  };

  return (
    <Box sx={backgroundStyle}>
      <Container maxWidth="md">
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            animation: `${fadeIn} 1s ease-out`,
            color: '#FFD700', // Couleur Or Kevium
          }}
        >
          Bienvenue sur KevMine
        </Typography>
        <Typography
          variant="h5"
          component="p"
          gutterBottom
          sx={{ mb: 4, animation: `${fadeIn} 1.5s ease-out`, color: 'text.secondary' }}
        >
          La meilleure plateforme pour miner de la crypto avec vos robots.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<PlayCircleOutlineIcon />}
            onClick={handlePlayClick}
            sx={{
              animation: `${fadeIn} 2s ease-out, ${pulse} 2s infinite 3s`,
              py: 1.5,
              px: 4,
              fontSize: '1.2rem',
            }}
          >
            Jouer
          </Button>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button
              variant="outlined"
              color="inherit"
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                mt: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'white',
                },
              }}
            >
              Déjà un compte ? Connectez-vous
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingScreen;