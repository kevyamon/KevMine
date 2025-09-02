import React, { useState, useMemo } from 'react';
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Tooltip,
  CircularProgress, Alert, Button, Modal, TextField, InputAdornment
} from '@mui/material';
import { toast } from 'react-toastify';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '../../redux/slices/categoryApiSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const CategoryListScreen = () => {
  const { data: categories, refetch, isLoading, error } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [confirmationCode, setConfirmationCode] = useState('');

  // --- NOUVEAU : Logique de recherche ---
  const [searchTerm, setSearchTerm] = useState('');
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [categories, searchTerm]);
  // --- FIN NOUVEAU ---

  const openModal = (category = null) => {
    setCurrentCategory(category);
    setName(category ? category.name : '');
    setDescription(category ? category.description : '');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentCategory(null);
    setName('');
    setDescription('');
  };

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
    setConfirmationCode('');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (currentCategory) {
        await updateCategory({ id: currentCategory._id, name, description }).unwrap();
        toast.success('Catégorie mise à jour');
      } else {
        await createCategory({ name, description }).unwrap();
        toast.success('Catégorie créée');
      }
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const confirmDeleteHandler = async () => {
    if (!categoryToDelete || !confirmationCode) {
      toast.error('Veuillez entrer le code de confirmation.');
      return;
    }
    try {
      await deleteCategory({ id: categoryToDelete._id, confirmationCode }).unwrap();
      toast.success('Catégorie et robots associés supprimés !');
      refetch();
      closeDeleteModal();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* NOUVEAU : Wrapper Paper pour le style unifié */}
      <Paper elevation={6} sx={{ p: 3, borderRadius: 4, background: 'linear-gradient(145deg, #1f2937, #111827)', color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            🗂️ Gestion des Catégories
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => openModal()}
          >
            Créer une Catégorie
          </Button>
        </Box>

        {/* NOUVEAU : Barre de recherche */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="🔍 Filtrer par nom ou description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: '#111827' } }}
          InputProps={{
            startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: 'gray' }} /></InputAdornment>),
            style: { color: 'white' },
          }}
        />

        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error?.data?.message || error.error}</Alert>
        ) : (
          // NOUVEAU : Conteneur scrollable
          <TableContainer component={Paper} sx={{ maxHeight: '65vh', backgroundColor: '#111827', borderRadius: 2 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>NOM</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>DESCRIPTION</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* On utilise les données filtrées */}
                {filteredCategories.map((category) => (
                  <TableRow key={category._id} hover>
                    <TableCell>{category._id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Modifier">
                        <IconButton onClick={() => openModal(category)} sx={{ mr: 1 }}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton color="error" onClick={() => openDeleteModal(category)}>
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

      {/* Modale pour Créer/Modifier */}
      <Modal open={modalOpen} onClose={closeModal}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            {currentCategory ? 'Modifier la Catégorie' : 'Créer une Catégorie'}
          </Typography>
          <Box component="form" onSubmit={submitHandler} sx={{ mt: 2 }}>
            <TextField fullWidth label="Nom" value={name} onChange={(e) => setName(e.target.value)} margin="normal" required />
            <TextField fullWidth label="Description" value={description} onChange={(e) => setDescription(e.target.value)} margin="normal" multiline rows={3}/>
            <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={isCreating || isUpdating}>
              {currentCategory ? 'Mettre à jour' : 'Créer'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modale pour Confirmer la Suppression */}
      <Modal open={deleteModalOpen} onClose={closeDeleteModal}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" color="error.main" sx={{ fontWeight: 'bold' }}>
            Suppression Définitive
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Vous êtes sur le point de supprimer la catégorie <strong>"{categoryToDelete?.name}"</strong> et <strong>tous les robots</strong> qui lui sont associés. Cette action est irréversible.
          </Typography>
          <TextField
            fullWidth
            label="Entrez le code de confirmation"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            margin="normal"
            required
            autoFocus
            sx={{mt: 2}}
          />
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant='outlined' onClick={closeDeleteModal}>Annuler</Button>
            <Button variant="contained" color="error" onClick={confirmDeleteHandler} disabled={isDeleting}>
              {isDeleting ? <CircularProgress size={24} /> : 'Confirmer la Suppression'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default CategoryListScreen;