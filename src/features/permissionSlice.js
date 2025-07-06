// features/permissionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// Async thunk for fetching permissions
export const fetchPermissions = createAsyncThunk(
  'permissions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/permissions');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const permissionSlice = createSlice({
  name: 'permissions',
  initialState: {
    list: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || action.error.message;
      });
  }
});

// Export the reducer as default
export default permissionSlice.reducer; // This is the key fix

// Named exports for selectors and actions
export const selectAllPermissions = (state) => state.permissions.list;
export const selectPermissionsStatus = (state) => state.permissions.status;
export const selectPermissionsError = (state) => state.permissions.error;