import React, { useState } from 'react';
import {
  Modal, Box, Typography, TextField, Button, CircularProgress, Divider, FormGroup, FormControlLabel, Checkbox
} from '@mui/material';
import { toast } from 'react-toastify';
import { useSendWarningMutation } from '../redux/slices/adminApiSlice';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const WarningModal = ({ open, handleClose, user }) => {
  const [sendWarning, { isLoading }] = useSendWarningMutation();
  const [message, setMessage] = useState('');
  // NOUVEAU : État pour les actions suggérées
  const [suggestedActions, setSuggestedActions] = useState({
    contactSupport: false,
    checkProfile: false,
  });

  if (!user) return null;

  // NOUVEAU : Gérer le changement des cases à cocher
  const handleCheckboxChange = (event) => {
    setSuggestedActions({
      ...suggestedActions,
      [event.target.name]: event.target.checked,
    });
  };

  const resetState = () => {
    setMessage('');
    setSuggestedActions({ contactSupport: false, checkProfile: false });
  };

  const handleSendWarning = async () => {
    if (!message.trim()) {
      toast.error('Le message ne peut pas être vide.');
      return;
    }

    // NOUVEAU : Construire le tableau des actions à envoyer
    const actionsToSend = Object.entries(suggestedActions)
      .filter(([key, value]) => value)
      .map(([key, value]) => {
        if (key === 'contactSupport') return 'Contacter le support';
        if (key === 'checkProfile') return 'Vérifier mon profil';
        return null;
      }).filter(Boolean);

    try {
      await sendWarning({ userId: user._id, message, suggestedActions: actionsToSend }).unwrap();
      toast.success(`Avertissement envoyé à ${user.name}`);
      resetState();
      handleClose();
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de l'envoi de l'avertissement.");
    }
  };
  
  const handleModalClose = () => {
    resetState();
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
          Envoyer un Avertissement à {user.name}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <TextField
          label="Message de l'avertissement"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          required
          autoFocus
        />
        {/* NOUVEAU : Ajout des cases à cocher pour les actions */}
        <FormGroup sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Actions Suggérées :</Typography>
            <FormControlLabel
                control={<Checkbox checked={suggestedActions.contactSupport} onChange={handleCheckboxChange} name="contactSupport" />}
                label="Suggérer de contacter le support"
            />
            <FormControlLabel
                control={<Checkbox checked={suggestedActions.checkProfile} onChange={handleCheckboxChange} name="checkProfile" />}
                label="Suggérer de vérifier son profil"
            />
        </FormGroup>
        <Button
          variant="contained"
          color="warning"
          onClick={handleSendWarning}
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Envoyer l\'Avertissement'}
        </Button>
      </Box>
    </Modal>
  );
};

export default WarningModal;