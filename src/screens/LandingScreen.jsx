import React from 'react';
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
      <Container maxWidth="sm">
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            animation: `${fadeIn} 1s ease-out`,
          }}
        >
          Bienvenue sur KevMine
        </Typography>
        <Typography
          variant="h5"
          component="p"
          gutterBottom
          sx={{ mb: 4, animation: `${fadeIn} 1.5s ease-out` }}
        >
          La meilleure plateforme pour miner de la crypto avec vos robots.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: 'column',
            alignItems: 'center',
            animation: `${fadeIn} 2s ease-out, ${pulse} 2s infinite 3s`,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<PlayCircleOutlineIcon />}
            onClick={handlePlayClick}
          >
            Jouer
          </Button>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button
              variant="outlined"
              color="inherit"
              sx={{
                color: 'white',
                borderColor: 'white',
                mt: 1,
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