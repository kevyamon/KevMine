import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../redux/slices/usersApiSlice';
import { logout, setCredentials } from '../redux/slices/authSlice';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import io from 'socket.io-client';

const BannedScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall, { isLoading: isLoggingOut }] = useLogoutMutation();

  const [isReactivated, setIsReactivated] = useState(false);
  const [countdown, setCountdown] = useState(20);

  // --- NOUVEAU : Logique Socket.io dédiée à cette page ---
  useEffect(() => {
    // Si l'utilisateur est déjà actif en arrivant ici, on déclenche la réactivation
    if (userInfo?.status === 'active') {
      setIsReactivated(true);
      return;
    }

    // On établit une connexion socket pour écouter les changements
    const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', {
      auth: {
        userId: userInfo?._id,
      },
    });

    socket.on('status_update', ({ status }) => {
      if (status === 'active') {
        // Mettre à jour le statut dans Redux
        dispatch(setCredentials({ ...userInfo, status: 'active' }));
        // L'autre useEffect se chargera de la logique de réactivation
      }
    });

    // Nettoyer la connexion en quittant la page
    return () => {
      socket.disconnect();
    };
  }, [userInfo, dispatch]);

  useEffect(() => {
    let timer;
    if (isReactivated) {
      if (countdown <= 0) {
        logoutHandler();
      } else {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      }
    }
    return () => clearTimeout(timer);
  }, [isReactivated, countdown]);


  const statusMessages = {
    banned: {
      title: 'Accès Banni',
      message: 'Votre compte a été banni. Si vous pensez qu\'il s\'agit d\'une erreur, vous pouvez nous contacter.',
    },
    suspended: {
      title: 'Accès Suspendu',
      message: 'Votre compte a été temporairement suspendu. Si vous pensez qu\'il s\'agit d\'une erreur, vous pouvez nous contacter.',
    }
  };

  const currentStatus = userInfo?.status || 'banned';
  const { title, message } = statusMessages[currentStatus] || statusMessages.banned;

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const commonPaperStyles = {
    p: { xs: 3, sm: 4 },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '16px',
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
  };
  
  // Vue pour le compte réactivé
  if (isReactivated) {
    return (
      <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', height: '100vh', backgroundColor: '#f0fdf4' }}>
        <Paper elevation={12} sx={{ ...commonPaperStyles, background: 'linear-gradient(145deg, #16a34a, #22c55e)' }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: 'white', mb: 2 }} />
          <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>
            Compte Réactivé !
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.9)' }}>
            Bonne nouvelle ! Votre compte a été réactivé. Vous allez être redirigé dans {countdown} secondes.
          </Typography>
          <Button
            variant="contained"
            onClick={logoutHandler}
            disabled={isLoggingOut}
            sx={{
              background: '#ffffff', color: '#166534', fontWeight: 'bold', borderRadius: '50px',
              px: 4, py: 1.5, '&:hover': { background: '#f1f1f1' }
            }}
          >
            Se reconnecter maintenant
          </Button>
        </Paper>
      </Container>
    );
  }

  // Vue pour le compte banni/suspendu
  return (
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', height: '100vh', backgroundColor: '#fdf2f8' }}>
      <Paper elevation={12} sx={{ ...commonPaperStyles, background: 'linear-gradient(145deg, #9d174d, #be185d)' }}>
        <ReportProblemIcon sx={{ fontSize: 60, color: 'white', mb: 2 }} />
        <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.9)' }}>
          {message}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          <Button variant="contained" href="mailto:support@kev-mine.com" sx={{ background: '#ffffff', color: '#831843', fontWeight: 'bold', borderRadius: '50px', px: 4, py: 1.5, '&:hover': { background: '#f1f1f1' } }}>
            Faire une réclamation
          </Button>
          <Button variant="outlined" color="inherit" onClick={logoutHandler} disabled={isLoggingOut} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', borderRadius: '50px', px: 4, py: 1.5, '&:hover': { borderColor: 'white', background: 'rgba(255,255,255,0.1)' } }}>
            Se déconnecter
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BannedScreen;