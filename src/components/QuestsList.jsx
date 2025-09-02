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
    pollingInterval: 60000, 
  });

  const sortedQuests = React.useMemo(() => {
    if (!userQuests) return [];
    // On filtre pour s'assurer que la quête associée existe bien avant de trier
    return [...userQuests]
      .filter(userQuest => userQuest.quest) // <-- CORRECTION AJOUTÉE ICI
      .sort((a, b) => {
        if (a.isClaimed !== b.isClaimed) {
          return a.isClaimed ? 1 : -1;
        }
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? -1 : 1;
        }
        return 0;
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