import { createAsyncThunk, createSlice  } from "@reduxjs/toolkit";
import api from "../api";

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await api.get('/api/auth/allUser');
  return response.data;
});
interface ListState {
  items: Array<any>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ListState = {
  items: [],
  status: 'idle'
};

const fetchUser = createSlice({
  name: 'listUsers',
  initialState,
  reducers: {},
  extraReducers(builder) {
      builder
          .addCase(fetchUsers.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(fetchUsers.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.items = action.payload;
          })
          .addCase(fetchUsers.rejected, (state) => {
              state.status = 'failed';
          });
  }
});

export default fetchUser.reducer;
