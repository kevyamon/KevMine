import React, { useEffect } from 'react'; // Importer useEffect
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Importer useSelector et useDispatch
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, createTheme, ThemeProvider, CssBaseline, responsiveFontSizes } from '@mui/material';
import bgImage from './assets/background.jpg';
import io from 'socket.io-client'; // Importer socket.io-client
import { apiSlice } from './redux/slices/apiSlice'; // Importer apiSlice

// On garde le thème de base
let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFD700', // Or Kevium
    },
    secondary: {
      main: '#00BFFF', // Bleu Sci-fi
    },
    info: {
      main: '#00BFFF',
      dark: '#009acd',
    },
    background: {
      default: '#121212',
      paper: 'rgba(30, 30, 30, 0.85)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// On rend les polices du thème responsives
theme = responsiveFontSizes(theme);

const App = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // CORRECTION : Logique pour la mise à jour en temps réel
  useEffect(() => {
    let socket;
    if (userInfo) {
      // Se connecter au serveur socket avec les infos de l'utilisateur
      socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', {
        auth: {
          userId: userInfo._id,
          isAdmin: userInfo.isAdmin,
        },
      });

      // Écouter l'événement de mise à jour des robots
      socket.on('robots_updated', () => {
        // Invalider le cache pour le tag 'Robot'. RTK Query va automatiquement
        // rafraîchir toutes les requêtes qui fournissent ce tag.
        dispatch(apiSlice.util.invalidateTags(['Robot']));
        toast.info('Le marché des robots a été mis à jour !');
      });

    }
    
    // Nettoyer la connexion quand le composant est démonté ou l'utilisateur se déconnecte
    return () => {
      if (socket) {
        socket.disconnect();
      }
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
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={appStyle}>
        <Header />
        <ToastContainer theme="dark" />
        <main>
          <Outlet />
        </main>
      </Box>
    </ThemeProvider>
  );
};

export default App;