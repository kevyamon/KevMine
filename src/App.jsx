import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box } from '@mui/material';

const App = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  const backgroundImageStyle = {
    minHeight: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: isLandingPage ? 'none' : 'url(/src/assets/background.jpg)',
  };

  return (
    <Box sx={backgroundImageStyle}>
      <Header />
      <ToastContainer />
      <main className="py-3">
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </main>
    </Box>
  );
};

export default App;