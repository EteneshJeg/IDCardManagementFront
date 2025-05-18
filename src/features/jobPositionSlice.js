// jobPositionsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async Thunks
export const fetchJobPositions = createAsyncThunk(
  "jobPositions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = JSON.parse(localStorage.getItem("job_positions") || "[]");
      return data;
    } catch {
      return rejectWithValue("Failed to load job positions");
    }
  }
);

export const addJobPosition = createAsyncThunk(
  "jobPositions/add",
  async (formData, { rejectWithValue }) => {
    try {
      const stored = JSON.parse(localStorage.getItem("job_positions") || "[]");
      const maxId = stored.length ? Math.max(...stored.map(item => item.id)) : 0;
      const id = maxId + 1;

      const newPosition = {
        id,
        organization_unit: formData.organization_unit,
        job_title_category: formData.job_title_category,
        job_description: formData.job_description,
        position_code: formData.position_code,
        salary: formData.salary,
        status: formData.status
      };

      localStorage.setItem("job_positions", JSON.stringify([...stored, newPosition]));
      return newPosition;
    } catch {
      return rejectWithValue("Failed to add position");
    }
  }
);

export const updateJobPosition = createAsyncThunk(
  "jobPositions/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const stored = JSON.parse(localStorage.getItem("job_positions") || "[]");
      const index = stored.findIndex(item => item.id === id);
      
      if (index === -1) return rejectWithValue("Position not found");
      
      const updated = stored.map((item, i) => 
        i === index ? { ...item, ...formData } : item
      );
      
      localStorage.setItem("job_positions", JSON.stringify(updated));
      return { id, ...formData };
    } catch {
      return rejectWithValue("Failed to update position");
    }
  }
);

export const deleteJobPosition = createAsyncThunk(
  "jobPositions/delete",
  async (id, { rejectWithValue }) => {
    try {
      const stored = JSON.parse(localStorage.getItem("job_positions") || "[]");
      const filtered = stored.filter(item => item.id !== id);
      localStorage.setItem("job_positions", JSON.stringify(filtered));
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
      const stored = JSON.parse(localStorage.getItem("job_positions") || "[]");
      const filtered = stored.filter(item => !ids.includes(item.id));
      localStorage.setItem("job_positions", JSON.stringify(filtered));
      return ids;
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