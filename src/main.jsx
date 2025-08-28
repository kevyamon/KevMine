import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store.js';

// Screens
import HomePage from './screens/HomePage.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import LandingScreen from './screens/LandingScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import RobotStoreScreen from './screens/RobotStoreScreen.jsx';
import LeaderboardScreen from './screens/LeaderboardScreen.jsx';

// Route Guards
import PrivateRoutes from './components/PrivateRoutes.jsx';
import AdminRoutes from './components/AdminRoutes.jsx';

// Admin Screens
import UserListScreen from './screens/admin/UserListScreen.jsx';
import UserEditScreen from './screens/admin/UserEditScreen.jsx';
import RobotListScreen from './screens/admin/RobotListScreen.jsx';
import RobotEditScreen from './screens/admin/RobotEditScreen.jsx';
import CategoryListScreen from './screens/admin/CategoryListScreen.jsx'; // 1. Importer

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route index={true} path="/" element={<LandingScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />

      {/* Private Routes */}
      <Route path="" element={<PrivateRoutes />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/store" element={<RobotStoreScreen />} />
        <Route path="/leaderboard" element={<LeaderboardScreen />} />
      </Route>

      {/* Admin Routes */}
      <Route path="" element={<AdminRoutes />}>
        <Route path="/admin/userlist" element={<UserListScreen />} />
        <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
        <Route path="/admin/robotlist" element={<RobotListScreen />} />
        <Route path="/admin/robot/:id/edit" element={<RobotEditScreen />} />
        {/* 2. Ajouter la nouvelle route */}
        <Route path="/admin/categorylist" element={<CategoryListScreen />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);