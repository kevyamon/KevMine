import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Tooltip,
  CircularProgress, Alert, Button, TextField, InputAdornment
} from '@mui/material';
import { toast } from 'react-toastify';
import { useGetRobotsQuery, useDeleteRobotMutation, useCreateRobotMutation } from '../../redux/slices/robotsApiSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search'; // 1. Importer l'icône

const RobotListScreen = () => {
  const { data: robots, refetch, isLoading, error } = useGetRobotsQuery();
  const [deleteRobot, { isLoading: isDeleting }] = useDeleteRobotMutation();
  const [createRobot, { isLoading: isCreating }] = useCreateRobotMutation();
  const navigate = useNavigate();

  // 2. Ajouter l'état et la logique de filtrage
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRobots = useMemo(() => {
    if (!robots) return [];
    return robots.filter(robot =>
      robot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.rarity.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [robots, searchTerm]);

  const deleteHandler = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce robot ?')) {
      try {
        await deleteRobot(id).unwrap();
        toast.success('Robot supprimé');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createRobotHandler = async () => {
    if (window.confirm('Voulez-vous créer un nouveau robot ?')) {
        try {
            const newRobot = await createRobot({
                name: 'Nouveau Robot',
                icon: '/images/placeholder.png',
                price: 0,
                miningPower: 1,
                rarity: 'common',
                stock: 0,
            }).unwrap();
            toast.success('Robot créé avec succès');
            navigate(`/admin/robot/${newRobot._id}/edit`);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={6} sx={{ p: 3, borderRadius: 4, background: 'linear-gradient(145deg, #1f2937, #111827)', color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            🤖 Gestion des Robots
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={createRobotHandler}
            disabled={isCreating}
          >
            Créer un Robot
          </Button>
        </Box>

        {/* 3. Ajouter la barre de recherche */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="🔍 Filtrer par nom ou rareté..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: '#111827' } }}
          InputProps={{
            startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: 'gray' }} /></InputAdornment>),
            style: { color: 'white' },
          }}
        />

        {isCreating && <CircularProgress />}
        {isDeleting && <CircularProgress />}
        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error?.data?.message || error.error}</Alert>
        ) : (
          // 4. Ajouter le conteneur scrollable
          <TableContainer component={Paper} sx={{ maxHeight: '65vh', backgroundColor: '#111827', borderRadius: 2 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>NOM</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>PRIX</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>PUISSANCE</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>RARETÉ</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>STOCK</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRobots.map((robot) => (
                  <TableRow key={robot._id} hover>
                    <TableCell>{robot._id}</TableCell>
                    <TableCell>{robot.name}</TableCell>
                    <TableCell align="right">{robot.price} KVM</TableCell>
                    <TableCell align="right">{robot.miningPower} KVM/h</TableCell>
                    <TableCell>{robot.rarity}</TableCell>
                    <TableCell align="right">{robot.stock}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Modifier">
                        <IconButton component={Link} to={`/admin/robot/${robot._id}/edit`} sx={{ mr: 1 }}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton color="error" onClick={() => deleteHandler(robot._id)}>
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

export default RobotListScreen;