import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  // NOUVEAU : Ajout de l'état pour gérer l'affichage de la transition
  showWelcome: false, 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      // NOUVEAU : On déclenche l'affichage de la transition si un utilisateur se connecte
      state.showWelcome = true; 
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.clear();
      state.showWelcome = false;
    },
    // NOUVEAU : Action pour cacher la transition une fois qu'elle est terminée
    hideWelcome: (state) => {
      state.showWelcome = false;
    },
  },
});

export const { setCredentials, logout, hideWelcome } = authSlice.actions;

export default authSlice.reducer;