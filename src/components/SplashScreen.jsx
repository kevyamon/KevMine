import React from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';

// Définition des animations
const zoomIn = keyframes`
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const SplashScreen = ({ onFinished }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #0d1b2a 0%, #1b263b 100%)',
        zIndex: 9999,
        color: 'white',
      }}
    >
      <Box
        component="img"
        src="/vite.svg" // Tu pourras remplacer par ton vrai logo
        alt="KevMine Logo"
        sx={{
          width: 120,
          height: 120,
          animation: `${zoomIn} 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
        }}
      />
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontWeight: 'bold',
          mt: 2,
          color: 'primary.main',
          opacity: 0,
          animation: `${slideUp} 0.7s 0.5s ease-out forwards`,
        }}
      >
        KevMine
      </Typography>
      <Typography
        variant="body1"
        sx={{
          opacity: 0,
          animation: `${fadeIn} 0.9s 0.9s ease-in forwards`,
        }}
      >
        Le minage nouvelle génération.
      </Typography>
    </Box>
  );
};

export default SplashScreen;