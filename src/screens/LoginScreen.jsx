import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../redux/slices/usersApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Container,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LoginScreen = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      // Si l'utilisateur est déjà connecté, on le redirige
      // PrivateRoutes se chargera de l'envoyer vers /banned si nécessaire
      navigate('/home');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ identifier, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/home');
    } catch (err) {
      // --- DÉBUT DE LA CORRECTION ---
      // Si l'erreur est une erreur de statut (banni/suspendu)...
      if (err.status === 403 && err.data?.userInfo) {
        // 1. On stocke les infos de l'utilisateur banni dans l'état Redux
        dispatch(setCredentials(err.data.userInfo));
        // 2. On redirige vers la page de bannissement
        navigate('/banned');
      } else {
        // Pour toutes les autres erreurs, on affiche une notification
        toast.error(err?.data?.message || err.error);
      }
      // --- FIN DE LA CORRECTION ---
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'background.paper' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Se connecter
        </Typography>
        <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="identifier"
            label="Email, Nom d'utilisateur ou Téléphone"
            name="identifier"
            autoComplete="username"
            autoFocus
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Se Connecter'}
          </Button>
        </Box>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Nouveau sur KevMine ? <Link to="/register" style={{ color: '#FFD700' }}>S'inscrire</Link>
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <Link to="/forgot-password" style={{ color: '#00BFFF' }}>Mot de passe oublié ?</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginScreen;