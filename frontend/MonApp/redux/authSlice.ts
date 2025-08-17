import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';


//initiale state
interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  email: string | null;
  name: string | null;
  id: string | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  email: null,
  name: null,
  id: null
};
//create slice
const authSlice = createSlice({
  name:'auth',
  initialState,
  reducers: {
    setLoginStatus: (state:AuthState, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      AsyncStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated));
    },
    setUserCredentials: (state:AuthState, action: PayloadAction<{ token: string }>) => {
      AsyncStorage.setItem('token', action.payload.token);
      state.token = action.payload.token;
    },
    setUserInfo: (state:AuthState, action: PayloadAction<{ email: string, name: string, id: string }>) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.id = action.payload.id;
      AsyncStorage.setItem('email', state.email);
      AsyncStorage.setItem('name', state.name);
      AsyncStorage.setItem('id', state.id);
    },
    logout: (state:AuthState) => {
      state.token = null;
      state.isAuthenticated = false;
      state.email = null;
      state.name = null;
      AsyncStorage.clear();

    }
  }
});

export const { setLoginStatus, setUserCredentials, setUserInfo, logout } = authSlice.actions;

export default authSlice.reducer;
