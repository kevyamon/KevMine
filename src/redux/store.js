import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import authReducer from './slices/authSlice';
// Cet import est nécessaire pour que l'injection des endpoints s'exécute
import { usersApiSlice } from './slices/usersApiSlice';

const store = configureStore({
  reducer: {
    // Seul le reducer de la slice principale est nécessaire ici
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  // Le middleware de apiSlice gère automatiquement les requêtes de tous les endpoints injectés
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;