import React, { useState, useMemo } from 'react';
import {
  Modal, Box, Typography, TextField, Button, Autocomplete, CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import { useGetUsersQuery, useGrantBonusMutation } from '../redux/slices/adminApiSlice';

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

const BonusModal = ({ open, handleClose }) => {
  const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery();
  const [grantBonus, { isLoading: isGranting }] = useGrantBonusMutation();

  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  // Filtrer pour n'inclure que les joueurs (non-admins)
  const players = useMemo(() => users?.filter(u => !u.isAdmin) || [], [users]);

  const handleGrantBonus = async () => {
    if (!selectedUser || !amount || !reason) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }
    try {
      await grantBonus({
        userId: selectedUser._id,
        amount: Number(amount),
        reason,
      }).unwrap();
      toast.success(`Bonus accordé à ${selectedUser.name} !`);
      handleClose();
      setSelectedUser(null);
      setAmount('');
      setReason('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleRandomUser = () => {
    if (players.length > 0) {
      const randomIndex = Math.floor(Math.random() * players.length);
      setSelectedUser(players[randomIndex]);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
          Accorder un Bonus en KVM
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Autocomplete
            value={selectedUser}
            onChange={(event, newValue) => {
              setSelectedUser(newValue);
            }}
            options={players}
            getOptionLabel={(option) => `${option.name} (${option.email})`}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderInput={(params) => (
              <TextField {...params} label="Rechercher un joueur" />
            )}
            loading={isLoadingUsers}
            fullWidth
          />
          <Button onClick={handleRandomUser} sx={{ mt: 1 }}>
            Choisir au hasard
          </Button>
          <TextField
            label="Montant du bonus (KVM)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Motif du bonus"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleGrantBonus}
            disabled={isGranting}
            sx={{ mt: 2 }}
          >
            {isGranting ? <CircularProgress size={24} /> : 'Accorder le Bonus'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BonusModal;