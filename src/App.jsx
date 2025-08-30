import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, createTheme, ThemeProvider, CssBaseline, responsiveFontSizes } from '@mui/material';
import bgImage from './assets/background.jpg';
import io from 'socket.io-client';
import { apiSlice } from './redux/slices/apiSlice';
import { setCredentials, logout, hideWelcome } from './redux/slices/authSlice';
import BonusNotificationModal from './components/BonusNotificationModal';
import BonusModal from './components/BonusModal';
import SplashScreen from './components/SplashScreen';
import WelcomeTransition from './components/WelcomeTransition';

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
  const { userInfo, showWelcome } = useSelector((state) => state.auth);

  const [bonusData, setBonusData] = useState(null);
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);
  const [isAdminBonusModalOpen, setIsAdminBonusModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let socket;
    if (userInfo) {
      socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', {
        auth: {
          userId: userInfo._id,
          isAdmin: userInfo.isAdmin,
        },
      });

      socket.on('robots_updated', () => { dispatch(apiSlice.util.invalidateTags(['Robot'])); toast.info('Le marché des robots a été mis à jour !'); });
      socket.on('settings_updated', (data) => { dispatch(apiSlice.util.invalidateTags(['Settings'])); const newRatePercent = (data.newRate * 100).toFixed(0); toast.success(`Annonce : La commission sur les ventes est maintenant de ${newRatePercent}% !`); });
      socket.on('status_update', ({ status }) => { const newUserInfo = { ...userInfo, status }; dispatch(setCredentials(newUserInfo)); if (status === 'banned' || status === 'suspended') { toast.error(`Votre compte a été ${status === 'banned' ? 'banni' : 'suspendu'}.`); } else if (status === 'active') { toast.success('Votre compte a été réactivé ! Vous allez être déconnecté pour appliquer les changements.'); setTimeout(() => { dispatch(logout()); window.location.href = '/login'; }, 5000); } });
      socket.on('leaderboard_updated', () => { dispatch(apiSlice.util.invalidateTags(['Leaderboard', 'PlayerRank'])); });
      socket.on('bonus_granted', (data) => { setBonusData(data); setIsBonusModalOpen(true); const updatedUserInfo = { ...userInfo, keviumBalance: data.keviumBalance }; dispatch(setCredentials(updatedUserInfo)); dispatch(apiSlice.util.invalidateTags(['User'])); });
      
      // NOUVEAU : Listener pour les notifications
      socket.on('new_notification', (notification) => {
        toast.info(`🔔 Nouvelle notification : ${notification.message}`);
        // Invalider le cache des notifications pour forcer le rafraîchissement du compteur
        dispatch(apiSlice.util.invalidateTags(['Notification']));
      });
    }
    
    return () => {
      if (socket) socket.disconnect();
    };
  }, [userInfo, dispatch]);
  
  const handleCloseBonusModal = () => { setIsBonusModalOpen(false); setBonusData(null); };
  const handleOpenAdminBonusModal = () => { setIsAdminBonusModalOpen(true); };
  const handleCloseAdminBonusModal = () => { setIsAdminBonusModalOpen(false); };

  const appStyle = { minHeight: '100vh', width: '100%', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed', backgroundImage: isLandingPage ? 'none' : `url(${bgImage})`, backgroundColor: '#000', display: 'flex', flexDirection: 'column', opacity: showSplash ? 0 : 1, transition: 'opacity 0.5s ease-in-out' };
  
  if (showSplash) return <SplashScreen />;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={appStyle}>
        {showWelcome && userInfo && (<WelcomeTransition isNewUser={userInfo.isNewUser} userName={userInfo.name} />)}
        <Header onBonusClick={handleOpenAdminBonusModal} />
        <ToastContainer theme="dark" position="bottom-right" />
        <main style={{ flex: 1 }}><Outlet /></main>
        <BonusNotificationModal open={isBonusModalOpen} onClose={handleCloseBonusModal} bonusData={bonusData} />
        {userInfo?.isSuperAdmin && (<BonusModal open={isAdminBonusModalOpen} handleClose={handleCloseAdminBonusModal} />)}
      </Box>
    </ThemeProvider>
  );
};

export default App;