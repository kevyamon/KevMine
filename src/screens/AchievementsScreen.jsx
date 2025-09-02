import React from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import { useGetAchievementsQuery } from '../redux/slices/achievementApiSlice';
import LockIcon from '@mui/icons-material/Lock';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Composant pour une carte de succès individuelle
const AchievementCard = ({ userAchievement }) => {
  const { achievement, isUnlocked, progress } = userAchievement;
  const progressPercent = isUnlocked ? 100 : Math.min((progress / achievement.target) * 100, 100);

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Paper
        sx={{
          p: 2.5,
          opacity: isUnlocked ? 1 : 0.7,
          border: '1px solid',
          borderColor: isUnlocked ? 'primary.main' : 'rgba(255, 255, 255, 0.12)',
          backgroundColor: 'background.paper',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.03)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isUnlocked ? (
            <EmojiEventsIcon sx={{ fontSize: 50, color: 'primary.main' }} />
          ) : (
            <LockIcon sx={{ fontSize: 50, color: 'grey.700' }} />
          )}
          <Box sx={{ textAlign: 'left', flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {achievement.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {achievement.description}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption">Progression</Typography>
            <Typography variant="caption">{`${Math.floor(progress).toLocaleString()} / ${achievement.target.toLocaleString()}`}</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            color={isUnlocked ? 'primary' : 'secondary'}
            sx={{ height: 8, borderRadius: 5 }}
          />
        </Box>
      </Paper>
    </Grid>
  );
};

const AchievementsScreen = () => {
  const { data: userAchievements, isLoading, error } = useGetAchievementsQuery();

  const sortedAchievements = React.useMemo(() => {
    if (!userAchievements) return [];
    return [...userAchievements].sort((a, b) => {
      if (a.isUnlocked !== b.isUnlocked) {
        return a.isUnlocked ? -1 : 1;
      }
      return (b.progress / b.achievement.target) - (a.progress / a.achievement.target);
    });
  }, [userAchievements]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4 }}>
        🏆 Succès
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">Impossible de charger les succès.</Alert>
      ) : (
        <Grid container spacing={3}>
          {sortedAchievements.map((ua) => (
            <AchievementCard key={ua._id} userAchievement={ua} />
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AchievementsScreen;