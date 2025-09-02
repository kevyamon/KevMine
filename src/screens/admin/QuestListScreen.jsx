import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Tooltip,
  CircularProgress, Alert, Button, Chip, TextField, InputAdornment,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useGetAllQuestsQuery, useDeleteQuestMutation, useCreateQuestMutation } from '../../redux/slices/questApiSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';

const QuestListScreen = () => {
  const { data: quests, refetch, isLoading, error } = useGetAllQuestsQuery();
  const [deleteQuest, { isLoading: isDeleting }] = useDeleteQuestMutation();
  const [createQuest, { isLoading: isCreating }] = useCreateQuestMutation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuests = useMemo(() => {
    if (!quests) return [];
    return quests.filter(quest =>
      quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quest.questType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [quests, searchTerm]);

  const deleteHandler = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette quête ?')) {
      try {
        await deleteQuest(id).unwrap();
        toast.success('Quête supprimée');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createQuestHandler = async () => {
    if (window.confirm('Voulez-vous créer une nouvelle quête ?')) {
      try {
        const newQuest = await createQuest({
          title: 'Nouvelle Quête',
          description: 'Description de la quête',
          questType: 'CLAIM_KVM',
          target: 1000,
          reward: 100,
        }).unwrap();
        navigate(`/admin/quest/${newQuest._id}/edit`);
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
            📜 Éditeur de Quêtes
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={createQuestHandler}
            disabled={isCreating}
          >
            Créer une Quête
          </Button>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="🔍 Filtrer par titre ou type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: '#111827' } }}
          InputProps={{
            startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: 'gray' }} /></InputAdornment>),
            style: { color: 'white' },
          }}
        />

        {isLoading || isCreating || isDeleting ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error?.data?.message || error.error}</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: '65vh', backgroundColor: '#111827', borderRadius: 2 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Titre</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Objectif</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Récompense</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Active</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredQuests.map((quest) => (
                  <TableRow key={quest._id} hover>
                    <TableCell>{quest.title}</TableCell>
                    <TableCell>
                      <Chip label={quest.questType} size="small" variant="outlined" color="secondary" />
                    </TableCell>
                    <TableCell align="right">{quest.target.toLocaleString()}</TableCell>
                    <TableCell align="right">{quest.reward.toLocaleString()} KVM</TableCell>
                    <TableCell align="center">
                      {quest.isActive ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Modifier">
                        <IconButton onClick={() => navigate(`/admin/quest/${quest._id}/edit`)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton color="error" onClick={() => deleteHandler(quest._id)}>
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

export default QuestListScreen;