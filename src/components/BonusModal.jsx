import React, { useState, useMemo } from 'react';
import {
  Modal, Box, Typography, TextField, Button, Autocomplete, CircularProgress, FormControlLabel, Checkbox
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

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [grantToAll, setGrantToAll] = useState(false);

  // Filtrer pour n'inclure que les joueurs (non-admins)
  const players = useMemo(() => users?.filter(u => !u.isAdmin) || [], [users]);

  const resetState = () => {
    setSelectedUsers([]);
    setAmount('');
    setReason('');
    setGrantToAll(false);
  };

  const handleGrantBonus = async () => {
    if (!amount || !reason) {
      toast.error('Veuillez spécifier un montant et un motif.');
      return;
    }
    if (!grantToAll && selectedUsers.length === 0) {
      toast.error('Veuillez sélectionner au moins un joueur ou cocher "Attribuer à tous".');
      return;
    }

    try {
      const payload = {
        amount: Number(amount),
        reason,
        grantToAll,
        userIds: grantToAll ? [] : selectedUsers.map(u => u._id),
      };
      await grantBonus(payload).unwrap();
      toast.success('Bonus accordé avec succès !');
      resetState();
      handleClose();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleRandomUser = () => {
    if (players.length > 0) {
      const randomIndex = Math.floor(Math.random() * players.length);
      setSelectedUsers([players[randomIndex]]);
      setGrantToAll(false);
    }
  };

  const handleCloseModal = () => {
    resetState();
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
          Accorder un Bonus en KVM
        </Typography>
        <Box sx={{ mt: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={grantToAll}
                onChange={(e) => {
                  setGrantToAll(e.target.checked);
                  if (e.target.checked) {
                    setSelectedUsers([]);
                  }
                }}
              />
            }
            label="Attribuer à tous les joueurs"
          />
          <Autocomplete
            multiple // Permet la sélection multiple
            value={selectedUsers}
            onChange={(event, newValue) => {
              setSelectedUsers(newValue);
            }}
            options={players}
            getOptionLabel={(option) => `${option.name} (${option.email})`}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderInput={(params) => (
              <TextField {...params} label="Rechercher un ou plusieurs joueurs" />
            )}
            loading={isLoadingUsers}
            disabled={grantToAll} // Désactivé si "tous les joueurs" est coché
            fullWidth
            sx={{ mt: 1 }}
          />
          <Button onClick={handleRandomUser} sx={{ mt: 1 }} disabled={grantToAll}>
            Choisir un joueur au hasard
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