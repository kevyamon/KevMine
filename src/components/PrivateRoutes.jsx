import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useOutletContext } from 'react-router-dom';

const PrivateRoutes = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const context = useOutletContext(); // On récupère le contexte venant de App.jsx

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (userInfo.status === 'banned' || userInfo.status === 'suspended') {
    return <Navigate to="/banned" replace />;
  }

  // On passe le contexte récupéré aux routes enfants (comme NotificationsScreen)
  return <Outlet context={context} />;
};

export default PrivateRoutes;