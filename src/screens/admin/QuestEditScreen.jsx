import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, TextField, Button, Grid,
  CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox
} from '@mui/material';
import { toast } from 'react-toastify';
import { useGetAllQuestsQuery, useUpdateQuestMutation } from '../../redux/slices/questApiSlice';

const QuestEditScreen = () => {
  const { id: questId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questType: 'CLAIM_KVM',
    target: 0,
    reward: 0,
    isActive: true,
  });

  const { data: quests, isLoading: isLoadingQuests, refetch } = useGetAllQuestsQuery();
  const quest = quests?.find(q => q._id === questId);

  const [updateQuest, { isLoading: isUpdating }] = useUpdateQuestMutation();

  useEffect(() => {
    if (quest) {
      setFormData({
        title: quest.title,
        description: quest.description,
        questType: quest.questType,
        target: quest.target,
        reward: quest.reward,
        isActive: quest.isActive,
      });
    }
  }, [quest]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateQuest({ id: questId, ...formData }).unwrap();
      toast.success('Quête mise à jour avec succès');
      refetch();
      navigate('/admin/questlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const questTypes = ['MINE_KVM', 'CLAIM_KVM', 'PURCHASE_ROBOT', 'UPGRADE_ROBOT', 'SELL_ROBOT'];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button component={Link} to="/admin/questlist" sx={{ mb: 3 }}>
        Retour à la liste des quêtes
      </Button>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Modifier la Quête
        </Typography>
        {isLoadingQuests ? (
          <CircularProgress />
        ) : !quest ? (
          <Alert severity="error">Quête non trouvée</Alert>
        ) : (
          <Box component="form" onSubmit={submitHandler} sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField fullWidth label="Titre de la Quête" name="title" value={formData.title} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={4} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type de Quête</InputLabel>
                  <Select name="questType" value={formData.questType} label="Type de Quête" onChange={handleChange}>
                    {questTypes.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Objectif" name="target" type="number" value={formData.target} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Récompense (KVM)" name="reward" type="number" value={formData.reward} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={<Checkbox name="isActive" checked={formData.isActive} onChange={handleChange} />}
                  label="Quête Active"
                />
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" sx={{ mt: 4 }} disabled={isUpdating}>
              {isUpdating ? <CircularProgress size={24} /> : 'Sauvegarder les modifications'}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default QuestEditScreen;