import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, IconButton, Tooltip,
  CircularProgress, Alert, Chip, TextField, InputAdornment, Divider,
  Modal, List, ListItem, ListItemText, ListItemAvatar, Avatar, ListItemButton, ListItemIcon
} from '@mui/material';
import { toast } from 'react-toastify';
import { useGetUsersQuery, useDeleteUserMutation } from '../../redux/slices/adminApiSlice';
import WarningModal from '../../components/WarningModal'; // 1. Importer la modale d'avertissement
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import BuildIcon from '@mui/icons-material/Build';
import WarningIcon from '@mui/icons-material/Warning'; // Importer l'icône d'avertissement

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

  const [selectedUser, setSelectedUser] = useState(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [actionsModalOpen, setActionsModalOpen] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(false); // 2. État pour la modale d'avertissement

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

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
  
  // 3. Fonctions pour la modale d'avertissement
  const handleOpenWarningModal = (user) => {
    setSelectedUser(user);
    setActionsModalOpen(false); // Fermer la modale d'actions
    setWarningModalOpen(true);
  };
  const handleCloseWarningModal = () => setWarningModalOpen(false);


  const deleteHandler = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      try {
        await deleteUser(id).unwrap();
        toast.success('Utilisateur supprimé avec succès');
        handleCloseActionsModal();
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
          <Paper sx={{ maxHeight: '65vh', overflow: 'auto', borderRadius: 3, backgroundColor: 'transparent', p: 1 }}>
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
                      primary={<Typography sx={{ fontWeight: 'bold', color: 'white' }}>{user.name}</Typography>}
                      secondary={<Typography sx={{ color: '#9ca3af' }}>{user.email}</Typography>}
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>
          </Paper>
        )}
      </Paper>

      {/* --- MODALES --- */}
      {selectedUser && (
        <>
          <Modal open={infoModalOpen} onClose={handleCloseInfoModal}>
            <Box sx={modalStyle}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                Détails de {selectedUser.name}
              </Typography>
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
              <Box sx={{ maxHeight: '60vh', overflowY: 'auto', pr: 2 }}>
                <List>
                  <ListItem><ListItemText primary="ID Utilisateur" secondary={selectedUser._id} secondaryTypographyProps={{ color: '#9ca3af' }} /></ListItem>
                  <ListItem><ListItemText primary="Nom" secondary={selectedUser.name} secondaryTypographyProps={{ color: '#9ca3af' }} /></ListItem>
                  <ListItem><ListItemText primary="Email" secondary={selectedUser.email} secondaryTypographyProps={{ color: '#9ca3af' }} /></ListItem>
                  <ListItem><ListItemText primary="Téléphone" secondary={selectedUser.phone || 'Non renseigné'} secondaryTypographyProps={{ color: '#9ca3af' }} /></ListItem>
                  <ListItem>
                    <ListItemText primary="Statut" />
                    <Chip label={selectedUser.status} sx={{ backgroundColor: selectedUser.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: selectedUser.status === 'active' ? '#10B981' : '#EF4444', fontWeight: 'bold', border: `1px solid ${selectedUser.status === 'active' ? '#10B981' : '#EF4444'}`}} size="small" />
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

          <Modal open={actionsModalOpen} onClose={handleCloseActionsModal}>
            <Box sx={modalStyle}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                Actions pour {selectedUser.name}
              </Typography>
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
              <List>
                {/* 4. Nouveau bouton d'action pour avertir */}
                <ListItemButton onClick={() => handleOpenWarningModal(selectedUser)}>
                  <ListItemIcon><WarningIcon sx={{ color: '#F59E0B' }}/></ListItemIcon>
                  <ListItemText primary="Envoyer un avertissement" />
                </ListItemButton>
                <ListItemButton component={Link} to={`/admin/user/${selectedUser._id}/edit`} onClick={handleCloseActionsModal}>
                  <ListItemIcon><EditIcon sx={{ color: '#3B82F6' }}/></ListItemIcon>
                  <ListItemText primary="Modifier l'utilisateur" />
                </ListItemButton>
                <ListItemButton onClick={() => deleteHandler(selectedUser._id)} disabled={selectedUser.isSuperAdmin || isDeleting}>
                  <ListItemIcon>{isDeleting ? <CircularProgress size={24} color='error' /> : <DeleteIcon sx={{ color: '#EF4444' }}/>}</ListItemIcon>
                  <ListItemText primary="Supprimer l'utilisateur" />
                </ListItemButton>
              </List>
            </Box>
          </Modal>
          
          {/* 5. Intégration de la modale d'avertissement */}
          <WarningModal 
            open={warningModalOpen}
            handleClose={handleCloseWarningModal}
            user={selectedUser}
          />
        </>
      )}
    </Container>
  );
};

export default UserListScreen;