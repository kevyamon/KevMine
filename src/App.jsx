import React, { useEffect, useState } from 'react'; // 1. Importer useState
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
import BonusNotificationModal from './components/BonusNotificationModal'; // 2. Importer la nouvelle modale
import BonusModal from './components/BonusModal'; // Importer la modale de bonus admin

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

  // 3. États pour gérer les modales
  const [bonusData, setBonusData] = useState(null);
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);
  const [isAdminBonusModalOpen, setIsAdminBonusModalOpen] = useState(false);

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
      
      socket.on('leaderboard_updated', () => {
        dispatch(apiSlice.util.invalidateTags(['Leaderboard', 'PlayerRank']));
      });

      // 4. NOUVEAU : Listener pour les bonus
      socket.on('bonus_granted', (data) => {
        setBonusData(data);
        setIsBonusModalOpen(true);
        // Mettre à jour le solde dans le state Redux instantanément
        const updatedUserInfo = { ...userInfo, keviumBalance: data.keviumBalance };
        dispatch(setCredentials(updatedUserInfo));
        // Invalider le cache pour que le prochain fetch soit à jour
        dispatch(apiSlice.util.invalidateTags(['User']));
      });

    }
    
    return () => {
      if (socket) socket.disconnect();
    };
  }, [userInfo, dispatch]);
  
  const handleCloseBonusModal = () => {
    setIsBonusModalOpen(false);
    setBonusData(null);
  };
  
  const handleOpenAdminBonusModal = () => {
    setIsAdminBonusModalOpen(true);
  };
  
  const handleCloseAdminBonusModal = () => {
    setIsAdminBonusModalOpen(false);
  };

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
        <Header onBonusClick={handleOpenAdminBonusModal} /> {/* Passer la fonction d'ouverture */}
        <ToastContainer theme="dark" position="bottom-right" />
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
        {/* 5. Afficher les modales */}
        <BonusNotificationModal 
          open={isBonusModalOpen} 
          onClose={handleCloseBonusModal} 
          bonusData={bonusData} 
        />
        {userInfo?.isSuperAdmin && (
          <BonusModal
            open={isAdminBonusModalOpen}
            handleClose={handleCloseAdminBonusModal}
          />
        )}
      </Box>
    </ThemeProvider>
  );
};

export default App;