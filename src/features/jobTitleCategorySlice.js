import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/job-title-categories";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Helper for error handling
const handleApiError = (error, rejectWithValue) => {
  if (error.response) {
    return rejectWithValue(error.response.data);
  } else if (error.request) {
    return rejectWithValue("No response from server");
  } else {
    return rejectWithValue(error.message);
  }
};

// ========== ASYNC THUNKS ==========
export const fetchJobTitleCategories = createAsyncThunk(
  "jobTitleCategories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      let token=JSON.parse(localStorage.getItem('token'));
      const response = await api.get("/",{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      console.log(response.data.data)
      return response.data.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

export const addJobTitleCategory = createAsyncThunk(
  "jobTitleCategories/add",
  async (formData, { rejectWithValue }) => {
    try {
      let token=JSON.parse(localStorage.getItem('token'));
      const response = await api.post("/", formData,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

export const updateJobTitleCategory = createAsyncThunk(
  "jobTitleCategories/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      let token=JSON.parse(localStorage.getItem('token'));
      const response = await api.put(`/${id}`, formData,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

export const deleteJobTitleCategory = createAsyncThunk(
  "jobTitleCategories/delete",
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

export const deleteBunchCategories = createAsyncThunk(
  "jobTitleCategories/deleteBunch",
  async (ids, { rejectWithValue }) => {
    try {
      await Promise.all(ids.map((id) => api.delete(`/${id}`)));
      return ids;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// ========== SLICE ==========
const jobTitleCategoriesSlice = createSlice({
  name: "jobTitleCategories",
  initialState: {
    data: [], // <== Ensure this is defined as an array!
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobTitleCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
        
      })
      .addCase(fetchJobTitleCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        
        state.data = action.payload;
        console.log(state.data)
      })
      .addCase(fetchJobTitleCategories.rejected, (state, action) => {
        state.status = "failed";
        
        state.error = action.payload;
      })

      .addCase(addJobTitleCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addJobTitleCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (!Array.isArray(state.data)) {
          state.data = []; // safeguard if somehow data is undefined or corrupted
        }
        state.data.push(action.payload);
      })
      .addCase(addJobTitleCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(updateJobTitleCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateJobTitleCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateJobTitleCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(deleteJobTitleCategory.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
      })

      .addCase(deleteBunchCategories.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => !action.payload.includes(item.id));
      })

      // Generic matchers to handle pending and rejected states for all async thunks
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );
  },
});

// ========== SELECTORS ==========
export const selectAllJobTitleCategories = (state) =>
  state.jobTitleCategory?.data || [];


export const selectCategoriesStatus = (state) => state.jobTitleCategories.status;

export const selectCategoriesError = (state) => state.jobTitleCategories.error;

export default jobTitleCategoriesSlice.reducer;
