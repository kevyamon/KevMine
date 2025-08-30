import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { keyframes } from '@emotion/react';

// Animation pour faire "respirer" l'icône
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 },
  bgcolor: 'background.paper',
  border: '2px solid #FFD700',
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
  textAlign: 'center',
  outline: 'none',
};

const BonusNotificationModal = ({ open, onClose, bonusData }) => {
  if (!bonusData) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography 
          variant="h1" 
          sx={{ animation: `${pulse} 1.5s ease-in-out infinite`, mb: 2 }}
        >
          🎁
        </Typography>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Bonus Reçu !
        </Typography>
        <Typography variant="h5" sx={{ my: 2 }}>
          Vous avez reçu <span style={{ color: '#00BFFF', fontWeight: 'bold' }}>{bonusData.amount.toLocaleString()} KVM</span> !
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          <strong>Motif :</strong> {bonusData.reason}
        </Typography>
        <Button variant="contained" color="primary" onClick={onClose}>
          Génial !
        </Button>
      </Box>
    </Modal>
  );
};

export default BonusNotificationModal;