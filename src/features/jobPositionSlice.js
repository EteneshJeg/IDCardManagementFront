// jobPositionsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
import axios from "axios";

// Async Thunks
export const fetchJobPositions = createAsyncThunk(
  "jobPositions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/job-position");
      return response.data.data;
    } catch {
      return rejectWithValue("Failed to load job positions");
    }
  }
);

export const addJobPosition = createAsyncThunk(
  "jobPositions/add",
  async (formData, { rejectWithValue }) => {
    try {
      const payload = {
        organization_unit_id: formData.organization_unit,
        job_title_category_id: formData.job_title_category,
        position_code: formData.position_code,
        status: formData.status,
        job_description: formData.job_description,
      };

      const response = await api.post("/job-position", payload);
      return response.data.data;
    } catch (error) {
      console.error("Add failed:", error?.response?.data);
      return rejectWithValue("Failed to add position");
    }
  }
);


export const updateJobPosition = createAsyncThunk(
  "jobPositions/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const payload = {
        organization_unit_id: formData.organization_unit,
        job_title_category_id: formData.job_title_category,
        position_code: formData.position_code,
        status: formData.status,
        job_description: formData.job_description,
      };

      const response = await api.put(`/job-position/${id}`, payload);
      return response.data.data;
    } catch (error) {
      // Optional: log error response for debugging
      console.error("Update failed:", error?.response?.data);
      return rejectWithValue("Failed to update position");
    }
  }
);


export const deleteJobPosition = createAsyncThunk(
  "jobPositions/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/job-position/${id}`);
      return id;
    } catch {
      return rejectWithValue("Failed to delete position");
    }
  }
);

// New bulk delete thunk
export const deleteBunchPositions = createAsyncThunk(
  "jobPositions/deleteBunch",
  async (ids, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      await axios.post(
        'http://localhost:8000/api/job-positions/delete-bunch',
        {ids: Id},
        {headers: { Authorization: `Bearer ${token}`}}
      );
      return Id;

    } catch {
      return rejectWithValue("Failed to delete positions");
    }
  }
);

// Selector
export const selectAllJobPositions = (state) => state.jobPositions?.items || [];

// Slice
const jobPositionsSlice = createSlice({
  name: "jobPositions",
  initialState: {
    items: [],
    status: "idle",
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobPositions.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(addJobPosition.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(updateJobPosition.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        state.status = "succeeded";
      })
      .addCase(deleteJobPosition.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.status = "succeeded";
      })
      .addCase(deleteBunchPositions.fulfilled, (state, action) => {
        state.items = state.items.filter(item => !action.payload.includes(item.id));
        state.status = "succeeded";
      })
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
          state.error = action.payload || "Unknown error occurred";
        }
      );
  }
});

export default jobPositionsSlice.reducer;