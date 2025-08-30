import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // NOUVEAU : Vérification du statut
  if (userInfo.status === 'banned' || userInfo.status === 'suspended') {
    return <Navigate to="/banned" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;