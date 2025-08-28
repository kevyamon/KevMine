import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoutes = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // L'utilisateur doit exister, être connecté, et avoir la propriété isAdmin à true
  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoutes;