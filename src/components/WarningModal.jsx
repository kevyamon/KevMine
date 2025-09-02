import React, { useState } from 'react';
import {
  Modal, Box, Typography, TextField, Button, CircularProgress, Divider
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

  if (!user) return null;

  const handleSendWarning = async () => {
    if (!message.trim()) {
      toast.error('Le message ne peut pas être vide.');
      return;
    }
    try {
      await sendWarning({ userId: user._id, message }).unwrap();
      toast.success(`Avertissement envoyé à ${user.name}`);
      handleClose();
      setMessage('');
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de l'envoi de l'avertissement.");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
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