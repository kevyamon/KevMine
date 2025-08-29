import React, { useState, useMemo } from 'react';
import {
  Card, CardContent, CardMedia, Typography, Box, Chip, Button,
  CircularProgress, Modal, Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import {
  usePurchaseRobotMutation,
  useUpgradeRobotMutation,
  useSellRobotMutation,
} from '../redux/slices/robotsApiSlice';
import { useGetGameSettingsQuery } from '../redux/slices/adminApiSlice';
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
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 400, backgroundColor: theme.palette.background.paper, border: '2px solid #000',
  boxShadow: 24, padding: theme.spacing(4), borderRadius: theme.shape.borderRadius,
}));

const RobotCard = ({ robot }) => {
  const [purchaseRobot, { isLoading: isPurchasing }] = usePurchaseRobotMutation();
  const [upgradeRobot, { isLoading: isUpgrading }] = useUpgradeRobotMutation();
  const [sellRobot, { isLoading: isSelling }] = useSellRobotMutation();
  const { data: settings } = useGetGameSettingsQuery();

  const [isSellModalOpen, setSellModalOpen] = useState(false);

  const isInInventory = !!robot.owner;
  const isPlayerSale = robot.isPlayerSale;

  const handleOpenSellModal = () => setSellModalOpen(true);
  const handleCloseSellModal = () => setSellModalOpen(false);

  const saleCalculations = useMemo(() => {
    if (!isInInventory || !settings) return null;
    const investedValue = robot.investedKevium;
    const salePrice = Math.floor(investedValue * 1.4);
    const commission = Math.floor(investedValue * settings.salesCommissionRate);
    const userTotalReturn = salePrice - commission;
    return { investedValue, salePrice, commission, userTotalReturn };
  }, [robot, settings, isInInventory]);

  const purchaseHandler = async (robotId) => {
    try {
      const res = await purchaseRobot(robotId).unwrap();
      toast.success(res.message);
    } catch (err) { toast.error(err?.data?.message || err.error); }
  };

  const upgradeHandler = async (robotId) => {
    try {
      const res = await upgradeRobot(robotId).unwrap();
      toast.success(res.message);
    } catch (err) { toast.error(err?.data?.message || err.error); }
  };

  const sellHandler = async () => {
    try {
      const res = await sellRobot(robot._id).unwrap();
      toast.success(res.message);
      handleCloseSellModal();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  
  const isLoading = isPurchasing || isUpgrading || isSelling;

  return (
    <>
      <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.12)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'translateY(-5px)', boxShadow: `0 8px 20px 0 rgba(0, 0, 0, 0.3)` } }}>
        <CardMedia component="img" sx={{ height: 200, objectFit: 'contain', p: 2, backgroundColor: 'rgba(0,0,0,0.2)' }} image={robot.icon || '/placeholder-robot.png'} alt={robot.name} />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography gutterBottom variant="h5" component="div" fontWeight="bold">{robot.name}</Typography>
            {/* CORRECTION : Affiche le niveau si le robot est dans l'inventaire OU si c'est une revente ET que le niveau > 1 */}
            {(isInInventory || isPlayerSale) && robot.level > 1 && <Chip label={`Niv. ${robot.level}`} color="secondary" />}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2, gap: 1, flexWrap: 'wrap' }}>
            <RarityChip label={robot.rarity} rarity={robot.rarity} size="small" />
            {robot.category && <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{robot.category.name}</Typography>}
            {isPlayerSale && <Chip label="Revente Joueur" color="warning" size="small" variant="outlined" />}
            {robot.isSponsored && !isPlayerSale && <Chip label="Sponsorisé" color="primary" size="small" variant="outlined" sx={{ ml: 'auto' }} />}
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
              {isLoading ? <CircularProgress size={24} /> : robot.stock === 0 ? 'Rupture de stock' : `Acheter pour ${robot.price} KVM`}
            </Button>
          )}
        </Box>
      </Card>

      <Modal open={isSellModalOpen} onClose={handleCloseSellModal}>
        <ModalBox>
          <Typography variant="h6" component="h2">Vendre {robot.name}</Typography>
          {saleCalculations && (
            <Box sx={{ my: 2, textAlign: 'left' }}>
              <Typography>Valeur investie : {saleCalculations.investedValue} KVM</Typography>
              <Typography>Prix de vente marché : {saleCalculations.salePrice} KVM (+40%)</Typography>
              <Typography color="error">Commission ({settings.salesCommissionRate * 100}%) : -{saleCalculations.commission} KVM</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="h6" color="primary.main">Retour total : {saleCalculations.userTotalReturn} KVM</Typography>
            </Box>
          )}
          <Typography sx={{ mt: 2, fontSize: '0.9rem' }}>Voulez-vous vraiment mettre ce robot en vente ?</Typography>
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