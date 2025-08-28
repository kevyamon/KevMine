import React, { useState } from 'react';
import {
  Card, CardContent, CardMedia, Typography, Box, Chip, Button,
  CircularProgress, Modal, TextField, InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import {
  usePurchaseRobotMutation,
  useUpgradeRobotMutation,
  useSellRobotMutation, // 1. Importer le hook de vente
} from '../redux/slices/robotsApiSlice';
import SellIcon from '@mui/icons-material/Sell';
import UpgradeIcon from '@mui/icons-material/Upgrade';

const RarityChip = styled(Chip)(({ theme, rarity }) => {
  const rarityColors = {
    common: { backgroundColor: theme.palette.grey[700], color: theme.palette.common.white },
    rare: { backgroundColor: theme.palette.info.main, color: theme.palette.common.white },
    epic: { backgroundColor: theme.palette.secondary.main, color: theme.palette.common.white },
    legendary: { backgroundColor: theme.palette.primary.main, color: theme.palette.common.black },
  };
  return rarityColors[rarity] || rarityColors.common;
});

const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: theme.palette.background.paper,
  border: '2px solid #000',
  boxShadow: 24,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  textAlign: 'center',
}));

const RobotCard = ({ robot }) => {
  const [purchaseRobot, { isLoading: isPurchasing }] = usePurchaseRobotMutation();
  const [upgradeRobot, { isLoading: isUpgrading }] = useUpgradeRobotMutation();
  const [sellRobot, { isLoading: isSelling }] = useSellRobotMutation(); // 2. Initialiser le hook de vente

  const [isSellModalOpen, setSellModalOpen] = useState(false);
  const [salePrice, setSalePrice] = useState('');

  const isInInventory = !!robot.owner;
  const isPlayerSale = robot.isPlayerSale;

  const handleOpenSellModal = () => setSellModalOpen(true);
  const handleCloseSellModal = () => setSellModalOpen(false);

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

  // 3. Logique pour la vente
  const sellHandler = async () => {
    if (!salePrice || Number(salePrice) <= 0) {
      toast.error('Veuillez entrer un prix de vente valide.');
      return;
    }
    try {
      const res = await sellRobot({ robotId: robot._id, salePrice: Number(salePrice) }).unwrap();
      toast.success(res.message);
      handleCloseSellModal();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const isLoading = isPurchasing || isUpgrading || isSelling;
  const price = isPlayerSale ? robot.salePrice : robot.price;

  return (
    <>
      <Card
        sx={{
          display: 'flex', flexDirection: 'column', height: '100%',
          backgroundColor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.12)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': { transform: 'translateY(-5px)', boxShadow: `0 8px 20px 0 rgba(0, 0, 0, 0.3)` },
        }}
      >
        <CardMedia component="img" sx={{ height: 200, objectFit: 'contain', p: 2, backgroundColor: 'rgba(0,0,0,0.2)' }} image={robot.icon || '/placeholder-robot.png'} alt={robot.name} />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography gutterBottom variant="h5" component="div" fontWeight="bold">{robot.name}</Typography>
            {isInInventory && <Chip label={`Niv. ${robot.level}`} color="secondary" />}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2, gap: 1, flexWrap: 'wrap' }}>
            <RarityChip label={robot.rarity} rarity={robot.rarity} size="small" />
            {robot.category && <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{robot.category.name}</Typography>}
            {isPlayerSale && <Chip label="Revente Joueur" color="warning" size="small" variant="outlined" />}
            {robot.isSponsored && <Chip label="Sponsorisé" color="primary" size="small" variant="outlined" sx={{ ml: 'auto' }} />}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Puissance de minage : {robot.miningPower} KVM/h</Typography>
          {isInInventory ? (
            <Typography variant="body2" color="text.secondary">Prochaine amélioration : {robot.upgradeCost} KVM</Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">{!isPlayerSale && `Stock restant : ${robot.stock}`}</Typography>
          )}
        </CardContent>
        <Box sx={{ p: 2, pt: 0 }}>
          {isInInventory ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button fullWidth variant="contained" color="secondary" startIcon={<UpgradeIcon />} onClick={() => upgradeHandler(robot._id)} disabled={isLoading}>
                {isUpgrading ? <CircularProgress size={24} /> : 'Améliorer'}
              </Button>
              <Button fullWidth variant="outlined" color="warning" startIcon={<SellIcon />} onClick={handleOpenSellModal} disabled={isLoading}>
                Vendre
              </Button>
            </Box>
          ) : (
            <Button fullWidth variant="contained" color="primary" sx={{ fontWeight: 'bold' }} onClick={() => purchaseHandler(robot._id)} disabled={isLoading || robot.stock === 0}>
              {isLoading ? <CircularProgress size={24} /> : robot.stock === 0 ? 'Rupture de stock' : `Acheter pour ${price} KVM`}
            </Button>
          )}
        </Box>
      </Card>

      {/* --- MODALE DE VENTE --- */}
      <Modal open={isSellModalOpen} onClose={handleCloseSellModal}>
        <ModalBox>
          <Typography variant="h6" component="h2">Mettre en vente {robot.name}</Typography>
          <Typography sx={{ mt: 2 }}>Définissez un prix de vente. Une commission sera prélevée sur le montant final.</Typography>
          <TextField
            fullWidth
            label="Prix de vente"
            variant="outlined"
            type="number"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            sx={{ mt: 3 }}
            InputProps={{ endAdornment: <InputAdornment position="end">KVM</InputAdornment> }}
          />
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Button variant="outlined" color="inherit" onClick={handleCloseSellModal}>Annuler</Button>
            <Button variant="contained" color="primary" onClick={sellHandler} disabled={isSelling}>
              {isSelling ? <CircularProgress size={24} /> : 'Confirmer la vente'}
            </Button>
          </Box>
        </ModalBox>
      </Modal>
    </>
  );
};

export default RobotCard;