import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, TextField, Button,
  CircularProgress, Alert, FormControlLabel, Checkbox, Select,
  MenuItem, InputLabel, FormControl, Grid
} from '@mui/material';
import { toast } from 'react-toastify';
import {
  useGetRobotDetailsQuery,
  useUpdateRobotMutation,
} from '../../redux/slices/robotsApiSlice';
import { useGetCategoriesQuery } from '../../redux/slices/categoryApiSlice';
import { useUploadRobotImageMutation } from '../../redux/slices/uploadApiSlice'; // 1. Importer la nouvelle mutation

const RobotEditScreen = () => {
  const { id: robotId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    miningPower: 0,
    rarity: 'common',
    category: '',
    stock: 0,
    isSponsored: false,
    icon: '',
    levelUpFactor: 1.5,
    upgradeCost: 100,
  });

  const { data: robot, isLoading, error } = useGetRobotDetailsQuery(robotId);
  const { data: categories, isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const [updateRobot, { isLoading: isUpdating }] = useUpdateRobotMutation();
  const [uploadRobotImage, { isLoading: isUploading }] = useUploadRobotImageMutation(); // 2. Initialiser le hook

  useEffect(() => {
    if (robot) {
      setFormData({
        name: robot.name,
        price: robot.price,
        miningPower: robot.miningPower,
        rarity: robot.rarity,
        category: robot.category?._id || '',
        stock: robot.stock,
        isSponsored: robot.isSponsored,
        icon: robot.icon,
        levelUpFactor: robot.levelUpFactor,
        upgradeCost: robot.upgradeCost,
      });
    }
  }, [robot]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 3. Créer la fonction pour gérer l'upload
  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadRobotImage(formData).unwrap();
      toast.success(res.message);
      setFormData((prev) => ({ ...prev, icon: res.image }));
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateRobot({ robotId, ...formData }).unwrap();
      toast.success('Robot mis à jour avec succès');
      navigate('/admin/robotlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button component={Link} to="/admin/robotlist" sx={{ mb: 3 }}>
        Retour à la liste des robots
      </Button>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Modifier le Robot
        </Typography>
        {isLoading || isUpdating ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error?.data?.message || error.error}</Alert>
        ) : (
          <form onSubmit={submitHandler}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Nom" name="name" value={formData.name} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Prix (KVM)" name="price" type="number" value={formData.price} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Puissance de Minage (KVM/h)" name="miningPower" type="number" value={formData.miningPower} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
              </Grid>

              {/* 4. Remplacer l'ancien champ 'icon' par le nouveau système */}
              <Grid item xs={12}>
                <TextField fullWidth label="URL de l'icône" name="icon" value={formData.icon} onChange={handleChange} required />
                <Button component="label" variant="contained" sx={{mt: 1}}>
                  Choisir un fichier
                  <input type="file" hidden onChange={uploadFileHandler} />
                </Button>
                {isUploading && <CircularProgress />}
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Rareté</InputLabel>
                  <Select name="rarity" value={formData.rarity} label="Rareté" onChange={handleChange}>
                    <MenuItem value="common">Commun</MenuItem>
                    <MenuItem value="rare">Rare</MenuItem>
                    <MenuItem value="epic">Épique</MenuItem>
                    <MenuItem value="legendary">Légendaire</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Catégorie</InputLabel>
                  <Select name="category" value={formData.category} label="Catégorie" onChange={handleChange}>
                    <MenuItem value=""><em>Aucune</em></MenuItem>
                    {isLoadingCategories ? <CircularProgress /> : categories?.map(cat => (
                      <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Coût d'amélioration initial" name="upgradeCost" type="number" value={formData.upgradeCost} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Facteur d'amélioration" name="levelUpFactor" type="number" value={formData.levelUpFactor} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox name="isSponsored" checked={formData.isSponsored} onChange={handleChange} />}
                  label="Sponsorisé"
                />
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" sx={{ mt: 3 }}>
              Mettre à jour
            </Button>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default RobotEditScreen;