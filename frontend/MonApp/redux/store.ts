import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Import du reducer d'authentification
import fetchUser from './listSlice'; // Import du reducer de la liste des utilisateurs


const store = configureStore({
  reducer: {
    auth: authReducer,
    listUsers: fetchUser,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;