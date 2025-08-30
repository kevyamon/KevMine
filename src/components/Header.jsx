import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../redux/slices/usersApiSlice';
import { logout } from '../redux/slices/authSlice';
import {
  AppBar, Toolbar, Typography, Box, IconButton, Drawer, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Badge, Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LockIcon from '@mui/icons-material/Lock';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AdminNavModal from './AdminNavModal';
import { useGetNotificationsQuery, useMarkAllAsReadMutation } from '../redux/slices/notificationApiSlice';

const Header = ({ onBonusClick }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const { data: notifications } = useGetNotificationsQuery(undefined, {
    skip: !userInfo,
    pollingInterval: 60000, // Rafraîchir toutes les 60 secondes
  });
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const unreadCount = useMemo(() => {
    return notifications?.filter(n => !n.isRead).length || 0;
  }, [notifications]);

  const handleNotificationsClick = async () => {
    if (unreadCount > 0) {
      try {
        await markAllAsRead().unwrap();
      } catch (error) {
        console.error('Failed to mark notifications as read:', error);
      }
    }
    navigate('/notifications');
  };
  
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setIsDrawerOpen(open);
  };
  
  const handleNavigate = (path) => {
    navigate(path);
    setIsDrawerOpen(false);
  };
  
  const openAdminModal = () => {
    setIsDrawerOpen(false);
    setIsAdminModalOpen(true);
  };

  const handleBonusClick = () => {
    setIsAdminModalOpen(false); 
    onBonusClick(); 
  };

  const drawerLinks = [
    { text: 'Profil', icon: <AccountCircleIcon />, action: () => handleNavigate('/profile') },
    { text: 'Classement', icon: <LeaderboardIcon />, action: () => handleNavigate('/leaderboard') },
    { text: 'Marché', icon: <StorefrontIcon />, action: () => handleNavigate('/store') },
    ...(userInfo?.isAdmin ? [{ text: 'Panel Admin', icon: <AdminPanelSettingsIcon />, action: openAdminModal }] : []),
    { text: 'Déconnexion', icon: <LogoutIcon />, action: logoutHandler },
  ];

  const publicLinks = [
    { text: 'Se Connecter', icon: <LockIcon />, action: () => handleNavigate('/login') },
    { text: 'S\'inscrire', icon: <PersonAddIcon />, action: () => handleNavigate('/register') },
  ];

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', boxShadow: 'none', px: { xs: 1, md: 4 } }}>
        <Toolbar>
          {userInfo && (
            <Box>
              <Tooltip title="Retour"><IconButton color="inherit" onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton></Tooltip>
              <Tooltip title="Accueil"><IconButton color="inherit" onClick={() => navigate('/home')}><HomeIcon /></IconButton></Tooltip>
            </Box>
          )}
          <Typography variant="h6" component={Link} to={userInfo ? '/home' : '/'} sx={{ flexGrow: 1, textDecoration: 'none', color: 'white', fontWeight: 'bold', ml: 2 }}>
            KevMine
          </Typography>
          
          {userInfo && (
            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={handleNotificationsClick}>
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          )}
          
          <IconButton size="large" edge="end" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {(userInfo ? drawerLinks : publicLinks).map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={item.action}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      
      <AdminNavModal open={isAdminModalOpen} handleClose={() => setIsAdminModalOpen(false)} onBonusClick={handleBonusClick} />
    </>
  );
};

export default Header;