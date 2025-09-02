import React from 'react';
import { useDismissWarningMutation } from '../redux/slices/adminApiSlice';
import { Modal, Box, Typography, Button, Paper, List, ListItem, ListItemIcon, ListItemText, Divider, CircularProgress } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { toast } from 'react-toastify';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: 500 },
  bgcolor: 'background.paper',
  border: '2px solid',
  borderColor: 'error.main',
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
  outline: 'none',
};

// Le composant reçoit maintenant l'avertissement à afficher et une fonction pour se fermer
const WarningDisplay = ({ activeWarning, onClose }) => {
  const [dismissWarning, { isLoading }] = useDismissWarningMutation();

  const handleDismiss = async () => {
    if (!activeWarning) return;
    try {
      await dismissWarning(activeWarning._id).unwrap();
      onClose(); // Appelle la fonction du parent pour réinitialiser l'état
      toast.info("L'avertissement a été acquitté.");
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de l'acquittement de l'avertissement.");
    }
  };

  const renderSuggestedAction = (action) => {
    if (action === 'Contacter le support') {
      return (
        <ListItem key={action}>
          <ListItemIcon sx={{ minWidth: 36 }}><ContactSupportIcon color="info" /></ListItemIcon>
          <ListItemText primary={action} />
        </ListItem>
      );
    }
    if (action === 'Vérifier mon profil') {
        return (
          <ListItem key={action}>
            <ListItemIcon sx={{ minWidth: 36 }}><AccountCircleIcon color="info" /></ListItemIcon>
            <ListItemText primary={action} />
          </ListItem>
        );
      }
    return null;
  };

  // Si aucun avertissement n'est actif, le composant ne rend rien.
  if (!activeWarning) {
    return null;
  }

  return (
    <Modal open={true} aria-labelledby="warning-modal-title">
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'error.main' }}>
          <WarningAmberIcon sx={{ fontSize: 40 }} />
          <Typography id="warning-modal-title" variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
            Avertissement de l'Administration
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 0, 0, 0.05)', maxHeight: '30vh', overflowY: 'auto' }}>
            <Typography variant="body1">{activeWarning.message}</Typography>
        </Paper>
        
        {activeWarning.suggestedActions && activeWarning.suggestedActions.length > 0 && (
            <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontWeight: 'bold' }}>Actions suggérées :</Typography>
                <List dense>
                    {activeWarning.suggestedActions.map(action => renderSuggestedAction(action))}
                </List>
            </Box>
        )}

        <Button
          variant="contained"
          color="error"
          onClick={handleDismiss}
          disabled={isLoading}
          fullWidth
          sx={{ mt: 3, fontWeight: 'bold' }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "J'ai compris"}
        </Button>
      </Box>
    </Modal>
  );
};

export default WarningDisplay;