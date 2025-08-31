import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../redux/slices/usersApiSlice';
import { logout } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import {
  AppBar, Toolbar, Typography, Box, IconButton, Drawer, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, InputAdornment, Tooltip, Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LockIcon from '@mui/icons-material/Lock';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SearchIcon from '@mui/icons-material/Search';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import AdminNavModal from './AdminNavModal';
import { useGetNotificationsQuery, useMarkAllAsReadMutation } from '../redux/slices/notificationApiSlice';
import { useGetConversationsQuery } from '../redux/slices/messageApiSlice'; // 1. Importer le hook des conversations

const Header = ({ onBonusClick }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: notifications } = useGetNotificationsQuery(undefined, {
    skip: !userInfo,
  });
  // 2. Récupérer les conversations
  const { data: conversations } = useGetConversationsQuery(undefined, {
    skip: !userInfo,
  });

  const [markAllAsRead] = useMarkAllAsReadMutation();

  // 3. Calculer le total des notifications ET des messages non lus
  const totalUnreadCount = useMemo(() => {
    const unreadNotifications = notifications?.filter(n => !n.isRead).length || 0;
    const unreadMessages = conversations?.reduce((acc, convo) => acc + (convo.unreadCount || 0), 0) || 0;
    return unreadNotifications + unreadMessages;
  }, [notifications, conversations]);

  const handleNotificationsClick = async () => {
    if ((notifications?.filter(n => !n.isRead).length || 0) > 0) {
      await markAllAsRead().unwrap();
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
      toast.error(err?.data?.message || err.error);
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
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

  const loggedInLinks = [
    { text: 'Profil', path: '/profile', icon: <AccountCircleIcon />, action: () => handleNavigate('/profile') },
    { text: 'Messagerie', path: '/messages', icon: <MailIcon />, action: () => handleNavigate('/messages') },
    { text: 'Classement', path: '/leaderboard', icon: <LeaderboardIcon />, action: () => handleNavigate('/leaderboard') },
    { text: 'Marché', path: '/store', icon: <StorefrontIcon />, action: () => handleNavigate('/store') },
    ...(userInfo && userInfo.isAdmin
      ? [{ text: 'Panel Admin', icon: <AdminPanelSettingsIcon />, action: openAdminModal }]
      : []),
    { text: 'Déconnexion', path: '/logout', icon: <LogoutIcon />, action: logoutHandler },
  ];

  const loggedOutLinks = [
    { text: 'Se Connecter', path: '/login', icon: <LockIcon />, action: () => handleNavigate('/login') },
    { text: 'S\'inscrire', path: '/register', icon: <PersonAddIcon />, action: () => handleNavigate('/register') },
  ];

  const links = userInfo ? loggedInLinks : loggedOutLinks;

  const filteredLinks = links.filter(link => 
    link.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const drawerContent = (
    <Box
      sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}
      role="presentation"
    >
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {filteredLinks.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={item.action}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          boxShadow: 'none',
          px: { xs: 1, md: 4 },
        }}
      >
        <Toolbar>
          {userInfo && (
            <Box>
              <Tooltip title="Retour">
                <IconButton color="inherit" onClick={() => navigate(-1)}>
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Accueil">
                <IconButton color="inherit" onClick={() => navigate('/home')}>
                  <HomeIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          <Typography
            variant="h6"
            component={Link}
            to={userInfo ? '/home' : '/'}
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'white',
              fontWeight: 'bold',
              ml: 2,
            }}
          >
            KevMine
          </Typography>

          {userInfo && (
            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={handleNotificationsClick}>
                {/* 4. Utiliser le nouveau total */}
                <Badge badgeContent={totalUnreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>
      
      <AdminNavModal 
        open={isAdminModalOpen} 
        handleClose={() => setIsAdminModalOpen(false)}
        onBonusClick={handleBonusClick} 
      />
    </>
  );
};

export default Header;