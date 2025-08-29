import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, IconButton, Tooltip,
  CircularProgress, Alert, Chip, TextField, InputAdornment, Divider,
  Modal, List, ListItem, ListItemText, ListItemAvatar, Avatar
} from '@mui/material';
import { toast } from 'react-toastify';
import { useGetUsersQuery, useDeleteUserMutation } from '../../redux/slices/adminApiSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import BuildIcon from '@mui/icons-material/Build';

// Style pour les modales
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 450 },
  bgcolor: '#1f2937',
  border: '2px solid #374151',
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
  color: 'white',
};

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour gérer les modales et l'utilisateur sélectionné
  const [selectedUser, setSelectedUser] = useState(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [actionsModalOpen, setActionsModalOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Fonctions pour ouvrir et fermer les modales
  const handleOpenInfoModal = (user) => {
    setSelectedUser(user);
    setInfoModalOpen(true);
  };
  const handleCloseInfoModal = () => setInfoModalOpen(false);
  
  const handleOpenActionsModal = (user) => {
    setSelectedUser(user);
    setActionsModalOpen(true);
  };
  const handleCloseActionsModal = () => setActionsModalOpen(false);

  const deleteHandler = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      try {
        await deleteUser(id).unwrap();
        toast.success('Utilisateur supprimé avec succès');
        handleCloseActionsModal(); // Fermer la modale après la suppression
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={6} sx={{ p: 3, borderRadius: 4, background: 'linear-gradient(145deg, #1f2937, #111827)', color: 'white' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          👤 Gestion des Utilisateurs
        </Typography>
        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Barre de recherche */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 3, backgroundColor: '#111827', boxShadow: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="🔍 Rechercher un utilisateur par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: 'gray' }} /></InputAdornment>),
              style: { color: 'white' },
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: '#1f2937' } }}
          />
        </Paper>

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error?.data?.message || error.error}</Alert>
        ) : (
          // Nouvelle liste d'utilisateurs
          <Paper sx={{ maxHeight: '65vh', overflow: 'auto', borderRadius: 3, backgroundColor: '#111827', p: 1 }}>
            <List>
              {filteredUsers.map((user) => (
                <Paper key={user._id} sx={{ mb: 1.5, borderRadius: 2, background: '#1f2937' }}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <Tooltip title="Informations">
                          <IconButton onClick={() => handleOpenInfoModal(user)} sx={{ color: '#60a5fa' }}>
                            <InfoIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Actions">
                          <IconButton onClick={() => handleOpenActionsModal(user)} sx={{ color: '#a78bfa' }}>
                            <BuildIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={user.photo}>{user.name.charAt(0).toUpperCase()}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 'bold' }}>{user.name}</Typography>}
                      secondary={user.email}
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>
          </Paper>
        )}
      </Paper>

      {/* Modale d'informations */}
      {selectedUser && (
        <Modal open={infoModalOpen} onClose={handleCloseInfoModal}>
          <Box sx={modalStyle}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              Détails de {selectedUser.name}
            </Typography>
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
            <Box sx={{ maxHeight: '60vh', overflowY: 'auto', pr: 2 }}>
              <List>
                <ListItem><ListItemText primary="ID Utilisateur" secondary={selectedUser._id} /></ListItem>
                <ListItem><ListItemText primary="Nom" secondary={selectedUser.name} /></ListItem>
                <ListItem><ListItemText primary="Email" secondary={selectedUser.email} /></ListItem>
                <ListItem><ListItemText primary="Téléphone" secondary={selectedUser.phone || 'Non renseigné'} /></ListItem>
                <ListItem>
                  <ListItemText primary="Statut" />
                  <Chip label={selectedUser.status} sx={{ backgroundColor: selectedUser.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: selectedUser.status === 'active' ? '#10B981' : '#EF4444', fontWeight: 'bold' }} size="small" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Admin" />
                  {selectedUser.isAdmin ? <CheckCircleIcon sx={{ color: '#10B981' }} /> : <CancelIcon sx={{ color: '#EF4444' }} />}
                </ListItem>
                <ListItem>
                  <ListItemText primary="Super Admin" />
                  {selectedUser.isSuperAdmin ? <CheckCircleIcon sx={{ color: '#10B981' }} /> : <CancelIcon sx={{ color: '#EF4444' }} />}
                </ListItem>
              </List>
            </Box>
          </Box>
        </Modal>
      )}

      {/* Modale d'actions */}
      {selectedUser && (
        <Modal open={actionsModalOpen} onClose={handleCloseActionsModal}>
          <Box sx={modalStyle}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              Actions pour {selectedUser.name}
            </Typography>
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
            <List>
              <ListItemButton component={Link} to={`/admin/user/${selectedUser._id}/edit`} onClick={handleCloseActionsModal}>
                <ListItemIcon><EditIcon sx={{ color: '#3B82F6' }}/></ListItemIcon>
                <ListItemText primary="Modifier l'utilisateur" />
              </ListItemButton>
              <ListItemButton onClick={() => deleteHandler(selectedUser._id)} disabled={selectedUser.isSuperAdmin || isDeleting}>
                <ListItemIcon>{isDeleting ? <CircularProgress size={24} /> : <DeleteIcon sx={{ color: '#EF4444' }}/>}</ListItemIcon>
                <ListItemText primary="Supprimer l'utilisateur" />
              </ListItemButton>
            </List>
          </Box>
        </Modal>
      )}
    </Container>
  );
};

export default UserListScreen;