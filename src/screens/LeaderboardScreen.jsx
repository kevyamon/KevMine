import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, Alert,
  TextField, InputAdornment, Grid, Card, CardContent,
} from '@mui/material';
import { useGetLeaderboardQuery, useGetPlayerRankQuery } from '../redux/slices/gameApiSlice';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';

// --- Sous-composant pour l'affichage de la progression ---
const RankProgression = ({ rank, previousRank }) => {
  if (!previousRank || previousRank === 0 || rank === previousRank) {
    return <RemoveIcon fontSize="small" color="disabled" />;
  }
  if (rank < previousRank) {
    return <ArrowUpwardIcon fontSize="small" color="success" />;
  }
  return <ArrowDownwardIcon fontSize="small" color="error" />;
};

// --- Sous-composant pour la carte du rang personnel ---
const PlayerRankCard = ({ userId }) => {
  const { data: player, isLoading } = useGetPlayerRankQuery(userId);

  if (isLoading || !player) return <CircularProgress size={20} />;

  return (
    <Card sx={{ backgroundColor: 'rgba(0, 191, 255, 0.1)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Votre Position</Typography>
        <Typography variant="h4" component="p" sx={{ fontWeight: 'bold' }}>
          Rang #{player.rank || 'Non classé'}
        </Typography>
        <Typography color="text.secondary">{player.keviumBalance.toLocaleString()} KVM</Typography>
      </CardContent>
    </Card>
  );
};


const LeaderboardScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { userInfo } = useSelector((state) => state.auth);

  const { data: leaderboard = [], isLoading, error } = useGetLeaderboardQuery(searchTerm);

  const getRankStyle = (player, index) => {
    const style = {};
    if (player.rank === 1) style.color = '#FFD700'; // Or pour le #1
    if (player._id === userInfo._id) {
      style.backgroundColor = 'rgba(255, 215, 0, 0.15)'; // Surlignage pour le joueur connecté
    }
    return style;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4 }}>
        Classement Mondial
      </Typography>

      <Grid container spacing={4} alignItems="flex-start">
        {/* Colonne de gauche: Rang personnel et Infos */}
        <Grid item xs={12} md={4}>
          <PlayerRankCard userId={userInfo._id} />
        </Grid>

        {/* Colonne de droite: Classement principal */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher un joueur ou un rang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
          ) : error ? (
            <Alert severity="error">Impossible de charger le classement : {error?.data?.message || error.error}</Alert>
          ) : (
            <TableContainer component={Paper} sx={{ backgroundColor: 'background.paper' }}>
              <Table aria-label="classement des joueurs">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Rang</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Nom du Joueur</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Kevium (KVM)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaderboard.map((player) => (
                    <TableRow key={player._id} sx={getRankStyle(player)}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {player.rank === 1 ? <EmojiEventsIcon /> : `#${player.rank}`}
                          <RankProgression rank={player.rank} previousRank={player.previousRank} />
                        </Box>
                      </TableCell>
                      <TableCell>{player.name}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {player.keviumBalance.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default LeaderboardScreen;