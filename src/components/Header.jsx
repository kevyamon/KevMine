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

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        boxShadow: 'none',
        px: { xs: 2, md: 8 },
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
          }}
        >
          KevMine
        </Typography>
        <Box>
          {userInfo ? (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/profile"
                startIcon={<AccountCircleIcon />}
              >
                {userInfo.name}
              </Button>
              <Button
                color="inherit"
                onClick={logoutHandler}
                startIcon={<LogoutIcon />}
              >
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button
                color="info"
                variant="contained"
                component={Link}
                to="/login"
                startIcon={<LockIcon />}
                sx={{ mr: 2 }}
              >
                Se Connecter
              </Button>
              <Button
                color="primary"
                variant="contained"
                component={Link}
                to="/register"
                startIcon={<PersonAddIcon />}
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