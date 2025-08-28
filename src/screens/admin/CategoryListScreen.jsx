import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Tooltip,
  CircularProgress, Alert, Button, Modal, TextField
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

  const deleteHandler = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await deleteCategory(id).unwrap();
        toast.success('Catégorie supprimée');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Gestion des Catégories
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

      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error?.data?.message || error.error}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>NOM</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>DESCRIPTION</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
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
                      <IconButton color="error" onClick={() => deleteHandler(category._id)}>
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

      <Modal open={modalOpen} onClose={closeModal}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            {currentCategory ? 'Modifier la Catégorie' : 'Créer une Catégorie'}
          </Typography>
          <Box component="form" onSubmit={submitHandler} sx={{ mt: 2 }}>
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
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
              multiline
              rows={3}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2 }}
              disabled={isCreating || isUpdating}
            >
              {currentCategory ? 'Mettre à jour' : 'Créer'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default CategoryListScreen;