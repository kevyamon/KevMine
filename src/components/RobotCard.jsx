import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import {
  usePurchaseRobotMutation,
  useUpgradeRobotMutation,
} from '../redux/slices/robotsApiSlice';

const RarityChip = styled(Chip)(({ theme, rarity }) => {
  const rarityColors = {
    common: {
      backgroundColor: theme.palette.grey[700],
      color: theme.palette.common.white,
    },
    rare: {
      backgroundColor: theme.palette.info.main,
      color: theme.palette.common.white,
    },
    epic: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.common.white,
    },
    legendary: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.black,
    },
  };
  return rarityColors[rarity] || rarityColors.common;
});

const RobotCard = ({ robot }) => {
  const [purchaseRobot, { isLoading: isPurchasing }] = usePurchaseRobotMutation();
  const [upgradeRobot, { isLoading: isUpgrading }] = useUpgradeRobotMutation();

  const isInInventory = !!robot.owner;

  const purchaseHandler = async (robotId) => {
    try {
      const res = await purchaseRobot(robotId).unwrap();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const upgradeHandler = async (robotId) => {
    try {
      const res = await upgradeRobot(robotId).unwrap();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const isLoading = isPurchasing || isUpgrading;

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'background.paper',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 8px 20px 0 rgba(0, 0, 0, 0.3)`,
        },
      }}
    >
      <CardMedia
        component="img"
        sx={{
          height: 200,
          objectFit: 'contain',
          p: 2,
          backgroundColor: 'rgba(0,0,0,0.2)',
        }}
        image={robot.icon || '/placeholder-robot.png'}
        alt={robot.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography gutterBottom variant="h5" component="div" fontWeight="bold">
            {robot.name}
          </Typography>
          {isInInventory && (
             <Chip label={`Niv. ${robot.level}`} color="secondary" />
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2, gap: 1 }}>
          <RarityChip label={robot.rarity} rarity={robot.rarity} size="small" />
          
          {/* ---- AFFICHAGE DE LA CATÉGORIE ---- */}
          {robot.category && (
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
              {robot.category.name}
            </Typography>
          )}
          {/* ---------------------------------- */}
          
          {robot.isSponsored && (
            <Chip label="Sponsorisé" color="primary" size="small" variant="outlined" sx={{ ml: 'auto' }} />
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Puissance de minage : {robot.miningPower} KVM/h
        </Typography>
        
        {isInInventory ? (
          <Typography variant="body2" color="text.secondary">
            Prochaine amélioration : {robot.upgradeCost} KVM
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Stock restant : {robot.stock}
          </Typography>
        )}
        
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        {isInInventory ? (
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ fontWeight: 'bold' }}
            onClick={() => upgradeHandler(robot._id)}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : `Améliorer`}
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ fontWeight: 'bold' }}
            onClick={() => purchaseHandler(robot._id)}
            disabled={isLoading || robot.stock === 0}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : robot.stock === 0 ? (
              'Rupture de stock'
            ) : (
              `Acheter pour ${robot.price} KVM`
            )}
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default RobotCard;