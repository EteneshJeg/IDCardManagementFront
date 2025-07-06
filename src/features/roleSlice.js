import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchRoles = createAsyncThunk(
  'roles/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/roles');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addRole = createAsyncThunk(
  'roles/add',
  async (roleData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/roles', roleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateRole = createAsyncThunk(
  'roles/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/roles/${id}`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteRole = createAsyncThunk(
  'roles/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/roles/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const roleSlice = createSlice({
  name: 'roles',
  initialState: {
    list: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Roles
      .addCase(fetchRoles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Add Role
      .addCase(addRole.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addRole.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list.push(action.payload);
      })
      .addCase(addRole.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Update Role
      .addCase(updateRole.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.list.findIndex(role => role.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Delete Role
      .addCase(deleteRole.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = state.list.filter(role => role.id !== action.payload);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// SAFE SELECTORS WITH DEFAULT VALUES
export const selectAllRoles = (state) => state.roles?.list || [];
export const selectRolesStatus = (state) => state.roles?.status || 'idle';
export const selectRolesError = (state) => state.roles?.error || null;

// SAFE ROLE BY ID SELECTOR
export const selectRoleById = (state, roleId) => {
  return state.roles?.list?.find(role => role.id === roleId) || null;
};

export default roleSlice.reducer;