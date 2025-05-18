import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ========== ASYNC THUNKS ==========
export const fetchJobTitleCategories = createAsyncThunk(
  "jobTitleCategories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = JSON.parse(localStorage.getItem("job_title_categories")) || [];
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addJobTitleCategory = createAsyncThunk(
  "jobTitleCategories/add",
  async (formData, { rejectWithValue }) => {
    try {
      if (!formData.name) {
        return rejectWithValue("Name is required");
      }

      const stored = JSON.parse(localStorage.getItem("job_title_categories")) || [];
      const id = stored.length ? Math.max(...stored.map(item => item.id)) + 1 : 1;

      const newCategory = {
        id,
        name: formData.name,
        description: formData.description || '',
        parent: formData.parent || null
      };

      stored.push(newCategory);
      localStorage.setItem("job_title_categories", JSON.stringify(stored));
      return newCategory;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateJobTitleCategory = createAsyncThunk(
  "jobTitleCategories/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      if (!formData.name) {
        return rejectWithValue("Name is required");
      }

      const stored = JSON.parse(localStorage.getItem("job_title_categories")) || [];
      const index = stored.findIndex(item => item.id === id);
      if (index === -1) return rejectWithValue("Category not found");

      const updatedCategory = { 
        ...stored[index], 
        ...formData 
      };

      stored[index] = updatedCategory;
      localStorage.setItem("job_title_categories", JSON.stringify(stored));
      return updatedCategory;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteJobTitleCategory = createAsyncThunk(
  "jobTitleCategories/delete",
  async (id, { rejectWithValue }) => {
    try {
      const stored = JSON.parse(localStorage.getItem("job_title_categories")) || [];
      const updated = stored.filter(item => item.id !== id);
      localStorage.setItem("job_title_categories", JSON.stringify(updated));
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBunchCategories = createAsyncThunk(
  "jobTitleCategories/deleteBunch",
  async (ids, { rejectWithValue }) => {
    try {
      const stored = JSON.parse(localStorage.getItem("job_title_categories")) || [];
      const updated = stored.filter(item => !ids.includes(item.id));
      localStorage.setItem("job_title_categories", JSON.stringify(updated));
      return ids;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ========== SLICE ==========
const jobTitleCategoriesSlice = createSlice({
  name: "jobTitleCategories",
  initialState: {
    jobTitleCategories: [],
    status: "idle",
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobTitleCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchJobTitleCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jobTitleCategories = action.payload;
      })
      .addCase(fetchJobTitleCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addJobTitleCategory.fulfilled, (state, action) => {
        state.jobTitleCategories.push(action.payload);
      })
      .addCase(updateJobTitleCategory.fulfilled, (state, action) => {
        const index = state.jobTitleCategories.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.jobTitleCategories[index] = action.payload;
        }
      })
      .addCase(deleteJobTitleCategory.fulfilled, (state, action) => {
        state.jobTitleCategories = state.jobTitleCategories.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteBunchCategories.fulfilled, (state, action) => {
        state.jobTitleCategories = state.jobTitleCategories.filter(
          (item) => !action.payload.includes(item.id)
        );
      });
  }
});

// ========== SELECTORS ==========
export const selectAllJobTitleCategories = (state) => 
  state.jobTitleCategory?.jobTitleCategories ?? [];

export const selectCategoriesStatus = (state) => 
  state.jobTitleCategories.status;

export const selectCategoriesError = (state) => 
  state.jobTitleCategories.error;

export default jobTitleCategoriesSlice.reducer;