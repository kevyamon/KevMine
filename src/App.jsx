import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, createTheme, ThemeProvider, CssBaseline, responsiveFontSizes } from '@mui/material';
import bgImage from './assets/background.jpg';

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