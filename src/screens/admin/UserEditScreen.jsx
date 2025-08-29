import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Tooltip,
  CircularProgress, Alert, Chip, TextField, InputAdornment, Divider
} from '@mui/material';
import { toast } from 'react-toastify';
import { useGetUsersQuery, useDeleteUserMutation } from '../../redux/slices/adminApiSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const deleteHandler = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await deleteUser(id).unwrap();
        toast.success('Utilisateur supprimé avec succès');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={6}
        sx={{
          p: 3,
          borderRadius: 4,
          background: 'linear-gradient(145deg, #1f2937, #111827)',
          color: 'white',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          👤 Gestion des Utilisateurs
        </Typography>

        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Barre de recherche */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            backgroundColor: '#111827',
            boxShadow: 2,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="🔍 Rechercher un utilisateur par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'gray' }} />
                </InputAdornment>
              ),
              style: { color: 'white' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: '#1f2937',
              },
            }}
          />
        </Paper>

        {isDeleting && <CircularProgress />}
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error?.data?.message || error.error}</Alert>
        ) : (
          // Conteneur de tableau scrollable
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: '65vh',
              borderRadius: 3,
              overflow: 'auto',
              boxShadow: 4,
            }}
          >
            <Table stickyHeader aria-label="user list table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#1f2937' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>NOM</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>EMAIL</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: 'white' }}>ADMIN</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: 'white' }}>STATUT</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: 'white' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user._id}
                    hover
                    sx={{
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
                    }}
                  >
                    <TableCell sx={{ color: 'white' }}>{user._id}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{user.name}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{user.email}</TableCell>
                    <TableCell align="center">
                      {user.isAdmin ? (
                        <CheckCircleIcon sx={{ color: '#10B981' }} />
                      ) : (
                        <CancelIcon sx={{ color: '#EF4444' }} />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={user.status}
                        sx={{
                          backgroundColor: user.status === 'active' ? '#10B981' : '#EF4444',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Modifier">
                        <IconButton
                          component={Link}
                          to={`/admin/user/${user._id}/edit`}
                          sx={{
                            mr: 1,
                            color: '#3B82F6',
                            '&:hover': { backgroundColor: 'rgba(59,130,246,0.1)' },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          color="error"
                          onClick={() => deleteHandler(user._id)}
                          disabled={user.isSuperAdmin}
                          sx={{
                            '&:hover': { backgroundColor: 'rgba(239,68,68,0.1)' },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default UserListScreen;
