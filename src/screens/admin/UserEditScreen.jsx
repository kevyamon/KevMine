import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, TextField, Button,
  CircularProgress, Alert, FormControlLabel, Checkbox, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { toast } from 'react-toastify';
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from '../../redux/slices/adminApiSlice';

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [status, setStatus] = useState('active');

  const { data: user, isLoading, error, refetch } = useGetUserDetailsQuery(userId);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
      setStatus(user.status);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isAdmin, status }).unwrap();
      toast.success('Utilisateur mis à jour avec succès');
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Button component={Link} to="/admin/userlist" sx={{ mb: 3 }}>
        Retour à la liste
      </Button>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Modifier l'Utilisateur
        </Typography>

        {isUpdating && <CircularProgress />}
        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error?.data?.message || error.error}</Alert>
        ) : (
          <Box component="form" onSubmit={submitHandler}>
            <TextField
              fullWidth
              label="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              type="email"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  disabled={user?.isSuperAdmin}
                />
              }
              label="Administrateur"
              sx={{ my: 2 }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Statut</InputLabel>
              <Select
                value={status}
                label="Statut"
                onChange={(e) => setStatus(e.target.value)}
                disabled={user?.isSuperAdmin}
              >
                <MenuItem value="active">Actif</MenuItem>
                <MenuItem value="banned">Banni</MenuItem>
                <MenuItem value="inactive">Inactif</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              disabled={isUpdating}
            >
              Mettre à jour
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default UserEditScreen;