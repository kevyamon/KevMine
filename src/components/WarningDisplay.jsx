import React from 'react';
import { useDismissWarningMutation } from '../redux/slices/adminApiSlice';
// 1. Importer les hooks nécessaires pour les notifications
import { useGetNotificationsQuery, useMarkOneAsReadMutation } from '../redux/slices/notificationApiSlice';
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

const WarningDisplay = ({ activeWarning, onClose }) => {
  const [dismissWarning, { isLoading: isDismissing }] = useDismissWarningMutation();
  // 2. Préparer les outils pour gérer les notifications
  const { data: notifications } = useGetNotificationsQuery();
  const [markOneAsRead, { isLoading: isMarkingRead }] = useMarkOneAsReadMutation();

  const isLoading = isDismissing || isMarkingRead;

  const handleDismiss = async () => {
    if (!activeWarning) return;
    try {
      // Rejeter l'avertissement
      await dismissWarning(activeWarning._id).unwrap();

      // 3. Chercher et marquer la notification correspondante comme lue
      if (notifications) {
        const relatedNotification = notifications.find(
          (notif) => notif.link === activeWarning._id && !notif.isRead
        );
        if (relatedNotification) {
          await markOneAsRead(relatedNotification._id).unwrap();
        }
      }

      onClose();
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