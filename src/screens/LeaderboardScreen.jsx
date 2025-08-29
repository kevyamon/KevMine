import React, { useState, useMemo } from 'react'; // Importer useMemo
import { useSelector } from 'react-redux';
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, Alert,
  TextField, InputAdornment, Grid, Card, CardContent, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider
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
  const { data: player, isLoading } = useGetPlayerRankQuery(userId, {
    skip: !userId,
  });

  if (isLoading) return <CircularProgress size={20} />;
  
  if (!player) return null;

  return (
    <Card sx={{ backgroundColor: 'rgba(0, 191, 255, 0.1)', mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Votre Position</Typography>
        <Typography variant="h4" component="p" sx={{ fontWeight: 'bold' }}>
          Rang #{player.rank > 0 ? player.rank : 'Non classé'}
        </Typography>
        <Typography color="text.secondary">{player.keviumBalance.toLocaleString()} KVM</Typography>
      </CardContent>
    </Card>
  );
};

// --- Sous-composant pour la liste du Top 10 ---
const TopTenList = ({ players }) => (
    <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{textAlign: 'center', fontWeight: 'bold'}}>Top 10</Typography>
        <List sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {players.map((player, index) => (
                <React.Fragment key={player._id}>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: player.rank === 1 ? 'primary.main' : 'secondary.main' }}>
                                {player.rank === 1 ? <EmojiEventsIcon /> : player.rank}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={player.name} secondary={`${player.keviumBalance.toLocaleString()} KVM`} />
                    </ListItem>
                    {index < players.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
            ))}
        </List>
    </Paper>
);


const LeaderboardScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { userInfo } = useSelector((state) => state.auth);

  const { data: leaderboard = [], isLoading, error } = useGetLeaderboardQuery(searchTerm);

  // CORRECTION : Le surlignage est retiré, seule la couleur pour le N°1 reste
  const getRankStyle = (player) => {
    if (player.rank === 1) {
      return { color: '#FFD700' }; // Or pour le premier
    }
    return {};
  };

  const topTen = useMemo(() => leaderboard.slice(0, 10), [leaderboard]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4 }}>
        Classement Mondial
      </Typography>

      <Grid container spacing={4} alignItems="flex-start">
        {/* Colonne de gauche: Classement principal et recherche */}
        <Grid item xs={12} md={8}>
          {userInfo && <PlayerRankCard userId={userInfo._id} />}
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
            // CORRECTION : Ajout du conteneur scrollable
            <TableContainer component={Paper} sx={{ maxHeight: '70vh', overflowY: 'auto', backgroundColor: 'background.paper' }}>
              <Table stickyHeader aria-label="classement des joueurs">
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
                          {`#${player.rank}`}
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

        {/* Colonne de droite: Top 10 (visible uniquement sur les écrans larges) */}
        <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
             {!isLoading && !error && topTen.length > 0 && <TopTenList players={topTen} />}
        </Grid>
      </Grid>
    </Container>
  );
};

export default LeaderboardScreen;