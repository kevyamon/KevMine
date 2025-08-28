import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useGetLeaderboardQuery } from '../redux/slices/gameApiSlice';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // Icône pour les trophées

const LeaderboardScreen = () => {
  const { data: leaderboard, isLoading, error } = useGetLeaderboardQuery();

  const getRankIcon = (rank) => {
    if (rank === 0) return <EmojiEventsIcon sx={{ color: '#FFD700' }} />; // Or
    if (rank === 1) return <EmojiEventsIcon sx={{ color: '#C0C0C0' }} />; // Argent
    if (rank === 2) return <EmojiEventsIcon sx={{ color: '#CD7F32' }} />; // Bronze
    return null;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        textAlign="center"
        sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4 }}
      >
        Classement Mondial
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">
          Impossible de charger le classement : {error?.data?.message || error.error}
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: 'background.paper' }}>
          <Table aria-label="classement des joueurs">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Rang</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nom du Joueur</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  Kevium (KVM)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboard.map((player, index) => (
                <TableRow
                  key={player._id}
                  sx={{
                    '&:nth-of-type(odd)': { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {index + 1}
                      {getRankIcon(index)}
                    </Box>
                  </TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell align="right" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    {player.keviumBalance.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default LeaderboardScreen;