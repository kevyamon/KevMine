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
import BannedScreen from './screens/BannedScreen.jsx';
import NotificationsScreen from './screens/NotificationsScreen.jsx';
import MessagesScreen from './screens/MessagesScreen.jsx';
// NOUVEAU : Importer l'écran des succès
import AchievementsScreen from './screens/AchievementsScreen.jsx';

// Route Guards
import PrivateRoutes from './components/PrivateRoutes.jsx';
import AdminRoutes from './components/AdminRoutes.jsx';

// Admin Screens
import DashboardScreen from './screens/admin/DashboardScreen.jsx';
import UserListScreen from './screens/admin/UserListScreen.jsx';
import UserEditScreen from './screens/admin/UserEditScreen.jsx';
import RobotListScreen from './screens/admin/RobotListScreen.jsx';
import RobotEditScreen from './screens/admin/RobotEditScreen.jsx';
import CategoryListScreen from './screens/admin/CategoryListScreen.jsx';
import GameSettingsScreen from './screens/admin/GameSettingsScreen.jsx';
import LogScreen from './screens/admin/LogScreen.jsx';
// NOUVEAU : Importer les écrans de gestion des quêtes
import QuestListScreen from './screens/admin/QuestListScreen.jsx';
import QuestEditScreen from './screens/admin/QuestEditScreen.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        {/* Routes Publiques */}
        <Route index={true} path="/" element={<LandingScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />

        {/* Routes Privées */}
        <Route path="" element={<PrivateRoutes />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/store" element={<RobotStoreScreen />} />
          <Route path="/leaderboard" element={<LeaderboardScreen />} />
          <Route path="/notifications" element={<NotificationsScreen />} />
          <Route path="/messages" element={<MessagesScreen />} />
          {/* NOUVEAU : Route pour les succès du joueur */}
          <Route path="/achievements" element={<AchievementsScreen />} />
        </Route>

        {/* Routes Admin */}
        <Route path="" element={<AdminRoutes />}>
          <Route path="/admin/dashboard" element={<DashboardScreen />} />
          <Route path="/admin/userlist" element={<UserListScreen />} />
          <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
          <Route path="/admin/robotlist" element={<RobotListScreen />} />
          <Route path="/admin/robot/:id/edit" element={<RobotEditScreen />} />
          <Route path="/admin/categorylist" element={<CategoryListScreen />} />
          <Route path="/admin/settings" element={<GameSettingsScreen />} />
          <Route path="/admin/logs" element={<LogScreen />} />
          {/* NOUVEAU : Routes pour la gestion des quêtes */}
          <Route path="/admin/questlist" element={<QuestListScreen />} />
          <Route path="/admin/quest/:id/edit" element={<QuestEditScreen />} />
        </Route>
      </Route>
      
      <Route path="/banned" element={<BannedScreen />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);