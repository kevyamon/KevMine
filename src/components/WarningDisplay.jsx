import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetMyWarningsQuery, useDismissWarningMutation } from '../redux/slices/adminApiSlice';
import { Modal, Box, Typography, Button, Paper, List, ListItem, ListItemIcon, ListItemText, Divider, CircularProgress } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

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

const WarningDisplay = () => {
  const { userInfo } = useSelector((state) => state.auth);
  // CORRECTION : On utilise le hook renommé 'useGetMyWarningsQuery'
  const { data: initialWarnings } = useGetMyWarningsQuery(undefined, {
    skip: !userInfo,
  });
  const [activeWarning, setActiveWarning] = useState(null);
  const [dismissWarning, { isLoading }] = useDismissWarningMutation();

  useEffect(() => {
    // Affiche le premier avertissement actif trouvé au chargement
    if (initialWarnings && initialWarnings.length > 0) {
      setActiveWarning(initialWarnings[0]);
    }
  }, [initialWarnings]);

  // Écoute les nouveaux avertissements en temps réel
  useEffect(() => {
    let socket;
    if (userInfo) {
      socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', {
        auth: { userId: userInfo._id },
      });

      socket.on('new_warning', (warning) => {
        // Affiche la nouvelle modale instantanément
        setActiveWarning(warning);
      });
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [userInfo]);

  const handleDismiss = async () => {
    if (!activeWarning) return;
    try {
      await dismissWarning(activeWarning._id).unwrap();
      setActiveWarning(null); // Ferme la modale
      toast.info("L'avertissement a été acquitté.");
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de l'acquittement de l'avertissement.");
    }
  };

  const renderSuggestedAction = (action) => {
    // Pourrait être étendu pour ouvrir d'autres modales ou liens
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
    // CORRECTION : La modale est maintenant bloquante, comme demandé.
    <Modal open={true} backdrop="static" keyboard={false} aria-labelledby="warning-modal-title">
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
        
        {/* NOUVEAU : Affichage dynamique des actions suggérées */}
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