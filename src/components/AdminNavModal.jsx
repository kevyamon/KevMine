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

const adminLinks = [
  { text: 'Tableau de Bord', path: '/admin/dashboard', icon: <DashboardIcon /> },
  { text: 'Gestion Utilisateurs', path: '/admin/userlist', icon: <PeopleIcon /> },
  { text: 'Gestion Robots', path: '/admin/robotlist', icon: <SmartToyIcon /> },
  { text: 'Gestion Catégories', path: '/admin/categorylist', icon: <CategoryIcon /> },
];

const AdminNavModal = ({ open, handleClose }) => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };

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
              <ListItemButton onClick={() => handleNavigate(link.path)}>
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