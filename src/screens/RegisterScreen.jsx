import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setCredentials } from '../redux/slices/authSlice';
import { useRegisterMutation } from '../redux/slices/usersApiSlice';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  IconButton,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/home');
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    setPasswordValidations({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (Object.values(passwordValidations).some(v => !v)) {
      toast.error('Le mot de passe ne respecte pas toutes les conditions.');
      return;
    }

    try {
      const res = await register({ name, email, phone, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/home');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const validationRules = [
    { label: '8 caractères minimum', key: 'length' },
    { label: 'Une minuscule', key: 'lowercase' },
    { label: 'Une majuscule', key: 'uppercase' },
    { label: 'Un chiffre', key: 'number' },
    { label: 'Un caractère spécial', key: 'specialChar' },
  ];

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'background.paper' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          S'inscrire
        </Typography>
        <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 1, width: '100%' }}>
          {/* Correction du style pour le label flottant */}
          <style>
            {`
              .react-tel-input .special-label {
                color: rgba(255, 255, 255, 0.7) !important;
                background: #1e1e1e !important; 
              }
            `}
          </style>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nom d'utilisateur"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Adresse email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Box sx={{ my: 2 }}>
            <PhoneInput
              country={'ci'}
              masks={{ci: '.. .. .. .. ..'}}
              placeholder="07 01 02 03 04" // Ajout du placeholder pour guider
              value={phone}
              onChange={setPhone}
              inputStyle={{
                width: '100%',
                backgroundColor: 'transparent',
                color: '#FFD700',
                borderColor: 'rgba(255, 255, 255, 0.23)',
                boxShadow: 'none',
                height: '56px',
                fontSize: '1rem',
              }}
              buttonStyle={{
                backgroundColor: 'transparent',
                borderColor: 'rgba(255, 255, 255, 0.23)',
                boxShadow: 'none',
              }}
              dropdownStyle={{ backgroundColor: '#1e1e1e' }}
              searchStyle={{ backgroundColor: '#333' }}
              enableSearch={true}
              inputProps={{
                name: 'phone',
                id: 'phone',
              }}
            />
          </Box>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
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
          <List dense sx={{ width: '100%', bgcolor: 'background.default', my: 2, borderRadius: 1 }}>
            {validationRules.map((rule) => (
              <ListItem key={rule.key} sx={{py: 0.5}}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {passwordValidations[rule.key] ? (
                    <CheckCircleOutlineIcon color="success" />
                  ) : (
                    <ErrorOutlineIcon color="error" />
                  )}
                </ListItemIcon>
                <ListItemText primary={rule.label} />
              </ListItem>
            ))}
          </List>
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirmer le mot de passe"
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "S'inscrire"}
          </Button>
        </Box>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Déjà un compte ? <Link to="/login" style={{ color: '#FFD700' }}>Connectez-vous ici.</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterScreen;