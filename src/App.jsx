import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import bgImage from './assets/background.jpg';

const theme = createTheme({
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
      // LA CORRECTION EST ICI : on passe le texte secondaire en blanc cassé
      secondary: '#E0E0E0',
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