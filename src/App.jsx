import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, createTheme, ThemeProvider, CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFD700', // Kevium gold
    },
    secondary: {
      main: '#00BFFF', // Sci-fi blue
    },
    background: {
      default: '#121212',
    },
    text: {
      primary: '#E0E0E0',
      secondary: '#BDBDBD',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const App = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  const backgroundImageStyle = {
    minHeight: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: isLandingPage ? 'none' : 'url(/src/assets/background.jpg)',
    backgroundColor: isLandingPage ? 'none' : '#000', // Added a fallback color
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ ...backgroundImageStyle, width: '100vw' }}>
        <Header />
        <ToastContainer />
        <main style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ p: 3, color: 'text.primary', width: '100%', maxWidth: '100vw' }}>
            <Outlet />
          </Box>
        </main>
      </Box>
    </ThemeProvider>
  );
};

export default App;