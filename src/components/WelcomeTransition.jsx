import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';
import { hideWelcome } from '../redux/slices/authSlice';

// Animations
const backgroundFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const textSlideIn = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const WelcomeTransition = ({ isNewUser, userName }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(hideWelcome());
    }, 4000); // La transition dure 4 secondes

    return () => clearTimeout(timer);
  }, [dispatch]);

  const welcomeMessage = isNewUser ? 'Bienvenue dans la mine !' : `Bon retour parmi nous,`;
  const nameDisplay = isNewUser ? userName : '';

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
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 9998,
        animation: `${backgroundFadeIn} 0.5s ease-out`,
        color: 'white',
        textAlign: 'center',
        p: 2,
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontWeight: '300',
          opacity: 0,
          animation: `${textSlideIn} 0.8s 0.2s cubic-bezier(0.25, 1, 0.5, 1) forwards`,
        }}
      >
        {welcomeMessage}
      </Typography>
      <Typography
        variant="h2"
        component="p"
        sx={{
          fontWeight: 'bold',
          color: 'primary.main',
          opacity: 0,
          animation: `${textSlideIn} 0.8s 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards`,
          mt: 1,
        }}
      >
        {userName}
      </Typography>
    </Box>
  );
};

export default WelcomeTransition;