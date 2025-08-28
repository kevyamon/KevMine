import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import bgImage from './assets/background.jpg'; // Étape 1: Importer l'image correctement

// Étape 2: Améliorer le thème pour une meilleure visibilité
const theme = createTheme({
  palette: {
    mode: 'dark', // Assure que les composants MUI utilisent des couleurs claires par défaut
    primary: {
      main: '#FFD700', // Or Kevium
    },
    secondary: {
      main: '#00BFFF', // Bleu Sci-fi
    },
    info: {
      // Ajout de la couleur 'info' qui manquait pour le bouton "Se connecter"
      main: '#00BFFF',
      dark: '#009acd',
    },
    background: {
      default: '#121212',
      paper: 'rgba(30, 30, 30, 0.85)', // Fond de "papier" semi-transparent pour les modales, etc.
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#BDBDBD',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const App = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  const appStyle = {
    minHeight: '100vh',
    width: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed', // Le fond reste fixe au scroll
    // Étape 3: Utiliser l'image importée
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