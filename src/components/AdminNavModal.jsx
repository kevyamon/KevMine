import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TextField,
  InputAdornment,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CategoryIcon from '@mui/icons-material/Category';
import SettingsIcon from '@mui/icons-material/Settings';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ArticleIcon from '@mui/icons-material/Article';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'; // 1. Importer une icône pour les quêtes

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
  display: 'flex',
  flexDirection: 'column',
};

const AdminNavModal = ({ open, handleClose, onBonusClick }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };
  
  const allAdminLinks = [
    { text: 'Tableau de Bord', icon: <DashboardIcon />, action: () => handleNavigate('/admin/dashboard') },
    { text: 'Gestion Utilisateurs', icon: <PeopleIcon />, action: () => handleNavigate('/admin/userlist') },
    { text: 'Gestion Robots', icon: <SmartToyIcon />, action: () => handleNavigate('/admin/robotlist') },
    { text: 'Gestion Catégories', icon: <CategoryIcon />, action: () => handleNavigate('/admin/categorylist') },
    // 2. Ajouter le lien vers l'éditeur de quêtes
    { text: 'Éditeur de Quêtes', icon: <AssignmentTurnedInIcon />, action: () => handleNavigate('/admin/questlist') },
    { text: 'Console des Logs', icon: <ArticleIcon />, action: () => handleNavigate('/admin/logs') },
    { text: 'Paramètres du Jeu', icon: <SettingsIcon />, action: () => handleNavigate('/admin/settings') },
    { text: 'Offrir un Bonus', icon: <CardGiftcardIcon />, action: onBonusClick },
  ];

  const filteredLinks = useMemo(() => {
    if (!searchTerm) {
      return allAdminLinks;
    }
    return allAdminLinks.filter(link =>
      link.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allAdminLinks]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography id="admin-nav-modal-title" variant="h6" component="h2">
          Panneau d'Administration
        </Typography>

        <TextField
          variant="outlined"
          fullWidth
          placeholder="Rechercher un outil..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ my: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ overflowY: 'auto', maxHeight: '60vh' }}>
          <List>
            {filteredLinks.map((link) => (
              <ListItem key={link.text} disablePadding>
                <ListItemButton onClick={link.action}>
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Modal>
  );
};

export default AdminNavModal;