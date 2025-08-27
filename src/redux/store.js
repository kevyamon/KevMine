import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import authReducer from './slices/authSlice';
import { usersApiSlice } from './slices/usersApiSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [usersApiSlice.reducerPath]: usersApiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;