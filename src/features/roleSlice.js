import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/roles';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const getAuthHeaders = () => {
  const token = JSON.parse(localStorage.getItem('token'));
  return {
    Authorization: `Bearer ${token}`,
  };
};

// ========== ASYNC THUNKS ==========

export const fetchRoles = createAsyncThunk(
  'roles/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/', {
        headers: getAuthHeaders(),
      });

      console.log("✅ [fetchRoles] API response:", response.data); // 🐞 log added

      return response.data;
    } catch (error) {
      console.error("❌ [fetchRoles] API error:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addRole = createAsyncThunk(
  'roles/add',
  async (roleData, { rejectWithValue }) => {
    try {
      const response = await api.post('/', roleData, {
        headers: getAuthHeaders(),
      });

      console.log("✅ [addRole] Added:", response.data); // 🐞 log added

      return response.data;
    } catch (error) {
      console.error("❌ [addRole] API error:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateRole = createAsyncThunk(
  'roles/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/${id}`, formData, {
        headers: getAuthHeaders(),
      });

      console.log("✅ [updateRole] Updated:", response.data); // 🐞 log added

      return response.data;
    } catch (error) {
      console.error("❌ [updateRole] API error:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteRole = createAsyncThunk(
  'roles/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/${id}`, {
        headers: getAuthHeaders(),
      });

      console.log("🗑️ [deleteRole] Deleted ID:", id); // 🐞 log added

      return id;
    } catch (error) {
      console.error("❌ [deleteRole] API error:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ========== SLICE ==========

const roleSlice = createSlice({
  name: 'roles',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Roles
      .addCase(fetchRoles.pending, (state) => {
        state.status = 'loading';
        console.log("🔄 [fetchRoles] Loading...");
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = Array.isArray(action.payload) ? action.payload : [];
        console.log("✅ [fetchRoles] Success, roles set:", state.list);
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.error("❌ [fetchRoles] Failed:", state.error);
      })

      // Add Role
      .addCase(addRole.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addRole.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list.push(action.payload);
        console.log("✅ [addRole] Role added:", action.payload);
      })
      .addCase(addRole.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.error("❌ [addRole] Failed:", state.error);
      })

      // Update Role
      .addCase(updateRole.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.list.findIndex((role) => role.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
          console.log("✅ [updateRole] Role updated at index", index, ":", action.payload);
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.error("❌ [updateRole] Failed:", state.error);
      })

      // Delete Role
      .addCase(deleteRole.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = state.list.filter((role) => role.id !== action.payload);
        console.log("🗑️ [deleteRole] Role removed from state, ID:", action.payload);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.error("❌ [deleteRole] Failed:", state.error);
      });
  },
});

// ========== SELECTORS ==========

export const selectAllRoles = (state) => state.roles?.list || [];
export const selectRolesStatus = (state) => state.roles?.status || 'idle';
export const selectRolesError = (state) => state.roles?.error || null;
export const selectRoleById = (state, roleId) =>
  state.roles?.list?.find((role) => role.id === roleId) || null;

export default roleSlice.reducer;
