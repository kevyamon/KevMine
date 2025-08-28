import React from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { useClaimQuestRewardMutation } from '../redux/slices/questApiSlice';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const QuestPaper = styled(Paper)(({ theme, completed, claimed }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderLeft: `5px solid ${
    claimed
      ? theme.palette.grey[700]
      : completed
      ? theme.palette.success.main
      : theme.palette.primary.main
  }`,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
  opacity: claimed ? 0.6 : 1,
}));

const QuestItem = ({ userQuest }) => {
  const { quest, progress, isCompleted, isClaimed } = userQuest;
  const [claimQuestReward, { isLoading: isClaiming }] =
    useClaimQuestRewardMutation();

  const handleClaim = async () => {
    try {
      const res = await claimQuestReward(userQuest._id).unwrap();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const progressPercentage = (progress / quest.target) * 100;

  return (
    <QuestPaper completed={isCompleted} claimed={isClaimed}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
            {quest.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {quest.description}
          </Typography>
        </Box>
        <Chip
          icon={isClaimed ? <CheckCircleIcon /> : <EmojiEventsIcon />}
          label={`${quest.reward} KVM`}
          color={isCompleted ? 'success' : 'default'}
          variant="outlined"
        />
      </Box>

      <Box sx={{ my: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption">Progression</Typography>
          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
            {Math.floor(progress).toLocaleString()} / {quest.target.toLocaleString()}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          color={isCompleted ? 'success' : 'primary'}
          sx={{ height: 8, borderRadius: 5 }}
        />
      </Box>

      <Box sx={{ textAlign: 'right', mt: 2 }}>
        {isClaimed ? (
          <Chip label="Récompense réclamée" color="success" variant="outlined" icon={<CheckCircleIcon />} />
        ) : isCompleted ? (
          <Button
            variant="contained"
            color="success"
            onClick={handleClaim}
            disabled={isClaiming}
          >
            {isClaiming ? 'Réclamation...' : 'Réclamer'}
          </Button>
        ) : (
          <Button variant="contained" disabled>
            En cours
          </Button>
        )}
      </Box>
    </QuestPaper>
  );
};

export default QuestItem;