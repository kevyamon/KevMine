import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Création d'un Chip personnalisé pour la rareté avec des couleurs spécifiques
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
        image={robot.icon || '/placeholder-robot.png'} // Avoir un placeholder est une bonne pratique
        alt={robot.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div" fontWeight="bold">
          {robot.name}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
          <RarityChip label={robot.rarity} rarity={robot.rarity} size="small" />
          {robot.isSponsored && (
            <Chip label="Sponsorisé" color="primary" size="small" variant="outlined" />
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Puissance de minage : {robot.miningPower} KVM/h
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Stock restant : {robot.stock}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ fontWeight: 'bold' }}
        >
          Acheter pour {robot.price} KVM
        </Button>
      </Box>
    </Card>
  );
};

export default RobotCard;