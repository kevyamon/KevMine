import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Button,
  Chip
} from '@mui/material';
import { useGetLogsQuery, useClearLogsMutation } from '../../redux/slices/logApiSlice';
import { toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const LogScreen = () => {
  const { data: logs, isLoading, error, refetch } = useGetLogsQuery();
  const [clearLogs, { isLoading: isClearing }] = useClearLogsMutation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = useMemo(() => {
    if (!logs) return [];
    return logs.filter(log =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.user?._id && log.user._id.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [logs, searchTerm]);

  const handleClearLogs = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer TOUS les logs ? Cette action est irréversible.')) {
      try {
        await clearLogs().unwrap();
        toast.success('Tous les logs ont été effacés.');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || 'Erreur lors de la suppression des logs.');
      }
    }
  };
  
  const getChipColor = (action) => {
    if (action.includes('fail')) return 'error';
    if (action.includes('success') || action.includes('granted')) return 'success';
    if (action.includes('banned') || action.includes('suspended')) return 'warning';
    return 'info';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={6} sx={{ p: 3, borderRadius: 4, background: 'linear-gradient(145deg, #1f2937, #111827)', color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            📜 Console des Logs
          </Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            onClick={handleClearLogs}
            disabled={isClearing}
          >
            {isClearing ? <CircularProgress size={24} /> : 'Tout Effacer'}
          </Button>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="🔍 Filtrer les logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: '#111827' } }}
          InputProps={{
            startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: 'gray' }} /></InputAdornment>),
            style: { color: 'white' },
          }}
        />

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error?.data?.message || error.error}</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: '65vh', backgroundColor: '#111827', borderRadius: 2 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>IP</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log._id} hover>
                    <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip label={log.action} color={getChipColor(log.action)} size="small" />
                    </TableCell>
                    <TableCell>{log.description}</TableCell>
                    <TableCell>{log.ip}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default LogScreen;