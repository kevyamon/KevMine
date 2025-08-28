import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../redux/slices/usersApiSlice';
import { logout } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import {
  AppBar, Toolbar, Typography, Box, IconButton, Drawer, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, InputAdornment,
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
import AdminNavModal from './AdminNavModal'; // 1. Importer la nouvelle modale

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false); // 2. Ajouter l'état pour la modale
  const [searchTerm, setSearchTerm] = useState('');

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
  
  // 3. Nouvelle action pour ouvrir la modale
  const openAdminModal = () => {
    setIsDrawerOpen(false); // Ferme le tiroir
    setIsAdminModalOpen(true); // Ouvre la modale
  };

  const loggedInLinks = [
    { text: 'Profil', path: '/profile', icon: <AccountCircleIcon />, action: () => handleNavigate('/profile') },
    { text: 'Classement', path: '/leaderboard', icon: <LeaderboardIcon />, action: () => handleNavigate('/leaderboard') },
    { text: 'Marché', path: '/store', icon: <StorefrontIcon />, action: () => handleNavigate('/store') },
    ...(userInfo && userInfo.isAdmin
      // 4. Mettre à jour l'action du bouton
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
          <Typography
            variant="h6"
            component={Link}
            to={userInfo ? '/home' : '/'}
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            KevMine
          </Typography>
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
      
      {/* 5. Ajouter la modale ici pour qu'elle soit rendue */}
      <AdminNavModal open={isAdminModalOpen} handleClose={() => setIsAdminModalOpen(false)} />
    </>
  );
};

export default Header;