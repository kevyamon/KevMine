import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CategoryIcon from '@mui/icons-material/Category';
import SettingsIcon from '@mui/icons-material/Settings';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'; // NOUVEAU : Importer l'icône

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const AdminNavModal = ({ open, handleClose, onBonusClick }) => { // 1. Accepter la prop onBonusClick
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };
  
  // 2. Créer les liens avec leurs actions
  const adminLinks = [
    { text: 'Tableau de Bord', icon: <DashboardIcon />, action: () => handleNavigate('/admin/dashboard') },
    { text: 'Gestion Utilisateurs', icon: <PeopleIcon />, action: () => handleNavigate('/admin/userlist') },
    { text: 'Gestion Robots', icon: <SmartToyIcon />, action: () => handleNavigate('/admin/robotlist') },
    { text: 'Gestion Catégories', icon: <CategoryIcon />, action: () => handleNavigate('/admin/categorylist') },
    { text: 'Paramètres du Jeu', icon: <SettingsIcon />, action: () => handleNavigate('/admin/settings') },
    { text: 'Offrir un Bonus', icon: <CardGiftcardIcon />, action: onBonusClick }, // 3. Lier l'action
  ];

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography id="admin-nav-modal-title" variant="h6" component="h2">
          Panneau d'Administration
        </Typography>
        <Divider sx={{ my: 2 }} />
        <List>
          {adminLinks.map((link) => (
            <ListItem key={link.text} disablePadding>
              <ListItemButton onClick={link.action}>
                <ListItemIcon>{link.icon}</ListItemIcon>
                <ListItemText primary={link.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Modal>
  );
};

export default AdminNavModal;