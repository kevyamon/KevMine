import React from 'react';
import { useGetQuestsQuery } from '../redux/slices/questApiSlice';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import QuestItem from './QuestItem';
import AssignmentIcon from '@mui/icons-material/Assignment';

const QuestsList = () => {
  const {
    data: userQuests,
    isLoading,
    error,
    refetch,
  } = useGetQuestsQuery(undefined, {
    // Rafraîchir les quêtes toutes les 60 secondes pour garder les données à jour
    pollingInterval: 60000, 
  });

  // Trier les quêtes pour un meilleur affichage :
  // 1. Terminées et non réclamées
  // 2. En cours
  // 3. Réclamées
  const sortedQuests = React.useMemo(() => {
    if (!userQuests) return [];
    return [...userQuests].sort((a, b) => {
      if (a.isClaimed !== b.isClaimed) {
        return a.isClaimed ? 1 : -1;
      }
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? -1 : 1;
      }
      return 0; // Garder l'ordre original si les statuts sont identiques
    });
  }, [userQuests]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Impossible de charger les quêtes : {error?.data?.message || error.error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: 'bold',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <AssignmentIcon /> Quêtes Quotidiennes
      </Typography>
      {sortedQuests.length > 0 ? (
        sortedQuests.map((userQuest) => (
          <QuestItem key={userQuest._id} userQuest={userQuest} />
        ))
      ) : (
        <Typography color="text.secondary">
          Aucune quête disponible pour le moment. Revenez plus tard !
        </Typography>
      )}
    </Box>
  );
};

export default QuestsList;