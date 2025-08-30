import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, createTheme, ThemeProvider, CssBaseline, responsiveFontSizes } from '@mui/material';
import bgImage from './assets/background.jpg';
import io from 'socket.io-client';
import { apiSlice } from './redux/slices/apiSlice';
import { setCredentials, logout } from './redux/slices/authSlice';

// ... (le thème reste inchangé)
let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#FFD700' },
    secondary: { main: '#00BFFF' },
    info: { main: '#00BFFF', dark: '#009acd' },
    background: { default: '#121212', paper: 'rgba(30, 30, 30, 0.85)' },
    text: { primary: '#FFFFFF', secondary: '#E0E0E0' },
  },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
});
theme = responsiveFontSizes(theme);


const App = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    let socket;
    if (userInfo) {
      socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', {
        auth: {
          userId: userInfo._id,
          isAdmin: userInfo.isAdmin,
        },
      });

      socket.on('robots_updated', () => {
        dispatch(apiSlice.util.invalidateTags(['Robot']));
        toast.info('Le marché des robots a été mis à jour !');
      });
      
      socket.on('settings_updated', (data) => {
        dispatch(apiSlice.util.invalidateTags(['Settings']));
        const newRatePercent = (data.newRate * 100).toFixed(0);
        toast.success(`Annonce : La commission sur les ventes est maintenant de ${newRatePercent}% !`);
      });

      socket.on('status_update', ({ status }) => {
        const newUserInfo = { ...userInfo, status };
        dispatch(setCredentials(newUserInfo));

        if (status === 'banned' || status === 'suspended') {
          toast.error(`Votre compte a été ${status === 'banned' ? 'banni' : 'suspendu'}.`);
        } else if (status === 'active') {
          toast.success('Votre compte a été réactivé ! Vous allez être déconnecté pour appliquer les changements.');
          setTimeout(() => {
            dispatch(logout());
            window.location.href = '/login';
          }, 5000);
        }
      });
      
      // NOUVEAU : Listener pour le classement
      socket.on('leaderboard_updated', () => {
        console.log('Leaderboard update received from server.');
        // Invalider le cache force RTK Query à re-fetch les données
        dispatch(apiSlice.util.invalidateTags(['Leaderboard', 'PlayerRank']));
        // On peut ajouter une notification discrète si on le souhaite
        // toast.info('Le classement a été mis à jour !');
      });

    }
    
    return () => {
      if (socket) socket.disconnect();
    };
  }, [userInfo, dispatch]);

  const appStyle = {
    minHeight: '100vh',
    width: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    backgroundImage: isLandingPage ? 'none' : `url(${bgImage})`,
    backgroundColor: '#000',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={appStyle}>
        <Header />
        <ToastContainer theme="dark" position="bottom-right" />
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
      </Box>
    </ThemeProvider>
  );
};

export default App;