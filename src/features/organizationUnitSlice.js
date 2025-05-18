import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async Thunks
export const fetchOrganizationUnits = createAsyncThunk(
  "organizationUnits/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = JSON.parse(
        localStorage.getItem("organizationUnits") || "[]"
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getOrganiztionUnitInfo = createAsyncThunk(
  "organizationUnits/getInfo",
  async (_, { rejectWithValue }) => {
    try {
      const data = JSON.parse(localStorage.getItem("organizationInfo") || "{}");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addOrganizationUnit = createAsyncThunk(
  "organizationUnits/add",
  async (formData, { rejectWithValue }) => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("organizationUnits") || "[]"
      );
      const maxId = stored.length
        ? Math.max(...stored.map(item => item.id))
        : 0;
      const id = maxId + 1;

      const newUnit = {
        id,
        ...formData,
        status: "active"
      };

      localStorage.setItem(
        "organizationUnits",
        JSON.stringify([...stored, newUnit])
      );
      return newUnit;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrganizationUnit = createAsyncThunk(
  "organizationUnits/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("organizationUnits") || "[]"
      );
      const index = stored.findIndex(item => item.id === id);

      if (index === -1) return rejectWithValue("Unit not found");

      const updated = stored.map(
        (item, i) => (i === index ? { ...item, ...formData } : item)
      );

      localStorage.setItem("organizationUnits", JSON.stringify(updated));
      return { id, ...formData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteOrganizationUnit = createAsyncThunk(
  "organizationUnits/delete",
  async (id, { rejectWithValue }) => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("organizationUnits") || "[]"
      );
      const filtered = stored.filter(item => item.id !== id);
      localStorage.setItem("organizationUnits", JSON.stringify(filtered));
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBunchUnits = createAsyncThunk(
  "organizationUnits/deleteBunch",
  async (ids, { rejectWithValue }) => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("organizationUnits") || "[]"
      );
      const filtered = stored.filter(item => !ids.includes(item.id));
      localStorage.setItem("organizationUnits", JSON.stringify(filtered));
      return ids;
    } catch (error) {
      return rejectWithValue(error.message);
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
        state.items = action.payload;
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
