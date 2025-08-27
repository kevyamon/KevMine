import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../redux/slices/usersApiSlice';
import { logout } from '../redux/slices/authSlice';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTheme } from '@mui/material/styles';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        boxShadow: 'none',
        [theme.breakpoints.up('md')]: {
          px: 8,
        },
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to={userInfo ? '/home' : '/'}
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'white',
            fontWeight: 'bold',
            letterSpacing: 1,
          }}
        >
          KevMine
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
          {userInfo ? (
            <>
              <Button color="inherit" component={Link} to="/profile" startIcon={<AccountCircleIcon />}>
                {userInfo.name}
              </Button>
              <Button color="inherit" onClick={logoutHandler} startIcon={<LogoutIcon />}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                startIcon={<LockIcon />}
                sx={{
                  backgroundColor: theme.palette.info.main,
                  '&:hover': {
                    backgroundColor: theme.palette.info.dark,
                  },
                }}
              >
                Se Connecter
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/register"
                startIcon={<PersonAddIcon />}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  ml: 2,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                S'inscrire
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;