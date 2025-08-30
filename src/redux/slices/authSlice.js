import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  showWelcome: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      if (typeof action.payload.isNewUser !== 'undefined') {
        state.showWelcome = true;
      }
    },
    // NOUVEAU : Réducteur dédié aux mises à jour partielles du profil
    updateUserInfo: (state, action) => {
      // On fusionne les nouvelles données avec les infos existantes
      state.userInfo = { ...state.userInfo, ...action.payload };
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.clear();
      state.showWelcome = false;
    },
    hideWelcome: (state) => {
      state.showWelcome = false;
    },
  },
});

// Exporter la nouvelle action
export const { setCredentials, logout, hideWelcome, updateUserInfo } = authSlice.actions;

export default authSlice.reducer;