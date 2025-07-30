import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const createMaritalStatus = createAsyncThunk(
  'maritalstatus/create',
  async ({ FormData }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const response = await axios.post(
        'http://localhost:8000/api/marital-status',
        FormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getMaritalStatus = createAsyncThunk(
  'maritalstatus/get',
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const response = await axios.get(
        'http://localhost:8000/api/marital-status',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data.data;
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMaritalStatus = createAsyncThunk(
  'maritalstatus/update',
  async ({ Id, FormData }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const response = await axios.put(
        `http://localhost:8000/api/marital-status/${Id}`,
        FormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteMaritalStatus = createAsyncThunk(
  'maritalstatus/delete',
  async ({ Id }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      await axios.delete(
        `http://localhost:8000/api/marital-status/${Id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return Id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteBunch = createAsyncThunk(
  'maritalstatus/deletebunch',
  async ({ Id }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      await axios.post(
        'http://localhost:8000/api/marital-status/delete-bunch', // Adjust this to your real route
        { ids: Id }, // Sending selected IDs
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return Id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const maritalStatusSlice = createSlice({
  name: 'maritalStatus',
  initialState: {
    data: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMaritalStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getMaritalStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(getMaritalStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createMaritalStatus.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateMaritalStatus.fulfilled, (state, action) => {
        const index = state.data.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteMaritalStatus.fulfilled, (state, action) => {
        state.data = state.data.filter(item => item.id !== action.payload);
      })
      .addCase(deleteBunch.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  }
});

export default maritalStatusSlice.reducer;