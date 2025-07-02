
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/organization-units";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Helper function to handle errors
const handleApiError = (error, rejectWithValue) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    return rejectWithValue(error.response.data);
  } else if (error.request) {
    // The request was made but no response was received
    return rejectWithValue("No response from server");
  } else {
    // 
    // Something happened in setting up the request
    return rejectWithValue(error.message);
  }
};
// Async Thunks
export const fetchOrganizationUnits = createAsyncThunk(
  "organizationUnits/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      let token=JSON.parse(localStorage.getItem('token'));
      const response = await api.get("/",{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

export const getOrganiztionUnitInfo = createAsyncThunk(
  "organizationUnits/getInfo",
  async (id, { rejectWithValue }) => {
    try {
      let token=JSON.parse(localStorage.getItem('token'));
      const response = await api.get(`/${id}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

export const addOrganizationUnit = createAsyncThunk(
  "organizationUnits/add",
  async (formData, { rejectWithValue }) => {
    try {
      let token=JSON.parse(localStorage.getItem('token'));
      const response = await api.post("/", formData,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
       console.error("Full API error:", error.response?.data);
      return handleApiError(error, rejectWithValue);
    }
  }
);

export const updateOrganizationUnit = createAsyncThunk(
  "organizationUnits/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      let token=JSON.parse(localStorage.getItem('token'));
      const response = await api.put(`/${id}`, formData,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

export const deleteOrganizationUnit = createAsyncThunk(
  "organizationUnits/delete",
  async (id, { rejectWithValue }) => {
    try {
      let token=JSON.parse(localStorage.getItem('token'));
      await api.delete(`/${id}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      return id;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

export const deleteBunchUnits = createAsyncThunk(
  "organizationUnits/deleteBunch",
  async (ids, { rejectWithValue }) => {
    try {
      await Promise.all(ids.map(id => api.delete(`/${id}`)));
      return ids;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);


// Slice Configuration
const organizationUnitSlice = createSlice({
  name: "organizationUnits",
  initialState: {
    items: [],
    organizationInfo: {},
    status: "idle",
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchOrganizationUnits.pending, state => {
        state.status = "loading";
      })
      .addCase(fetchOrganizationUnits.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = Array.isArray(action.payload.data)
        ? action.payload.data
        : [];
      })
      .addCase(fetchOrganizationUnits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getOrganiztionUnitInfo.pending, state => {
        state.status = "loading";
      })
      .addCase(getOrganiztionUnitInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.organizationInfo = action.payload;
      })
      .addCase(getOrganiztionUnitInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addOrganizationUnit.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateOrganizationUnit.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          item => item.id === action.payload.id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteOrganizationUnit.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteBunchUnits.fulfilled, (state, action) => {
        state.items = state.items.filter(
          item => !action.payload.includes(item.id)
        );
      })
      .addMatcher(
        action => action.type.endsWith("/pending"),
        state => {
          state.status = "loading";
          state.error = null;
        }
      )
      .addMatcher(
        action => action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );
  }
});

// Selectors
export const selectAllOrganizationUnits = (state) => 
  state?.organizationUnits?.items || [];
export const selectOrganizationInfo = state =>
  state.organizationUnits.organizationInfo;

export default organizationUnitSlice.reducer;