
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import i18next from "i18next";

let token = JSON.parse(localStorage.getItem('token'));

export const addEmployee = createAsyncThunk(
  'create/profile',
  async (formData, { rejectWithValue }) => {
    try {
      console.log(formData);
      


      const cleanDateInput = (value) => {
        if (!value || value === "0" || value === 0) return null;

        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date.toISOString().split("T")[0]; // returns 'YYYY-MM-DD'
      };

      const prepareFormData = (formData) => {
        return {
          en_name: formData.en_name || "",
          title: formData.title || "",
          sex: formData.sex || "",
          date_of_birth: cleanDateInput(formData.date_of_birth) || null,
          joined_date: cleanDateInput(formData.joined_date) || null,
          user_id: formData.user_id || "",
          photo: formData.photo || "",
          phone_number: formData.phone_number || "",
          organization_unit_id: formData.organization_unit_id || "",
          job_position_id: formData.job_position_id || "",
          job_title_category_id: formData.job_title_category_id || "",
          salary: parseInt(formData.salary) || "",
          martial_status_id: formData.marital_status_id || "",
          nation: formData.nation || "",
          employment_id: formData.employment_id || "",
          job_position_start_date: cleanDateInput(formData.job_position_start_date) || null,
          job_position_end_date: cleanDateInput(formData.job_position_end_date) || null,
          address: formData.address || "",
          house_number: formData.house_number || "",
          region_id: formData.region_id || "",
          woreda_id: formData.woreda_id || "",
          zone_id: formData.zone_id || "",
          id_status: "unissued",
          status: true
        };
      };
      const form = prepareFormData(formData);
      console.log(form);
      const formdata = new FormData();
      for (let key in form) {
        if (form[key] !== null && form[key] !== undefined) {
          formdata.append(key, form[key]);
        }
      }

      console.log('try');
      await axios.post('http://localhost:8000/api/employees', formdata, {
        headers: {
          Authorization: `Bearer ${token}`,
        }

      })
        .then(response => {
          toast.success(i18next.t('employeesavedsuccessfully'));
          console.log("Success", response);
        })
        .catch(error => {
          toast.error(i18next.t('failedtosaveemployee'));
          console.log("Error", error.response);
        })



    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
)

export const getEmployees = createAsyncThunk(
  'get/profile',

  async (_, { rejectWithValue }) => {
    try {
      let token = JSON.parse(localStorage.getItem('token'));
      let response = await axios.get('http://localhost:8000/api/employees', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      let data = response.data;
      console.log(data);
      if (data) {
        if (Array.isArray(data)) {
          return data;
        }
        else if (data === null) {
          return [];
        }
        else {
          return [data];
        }
      }
      else {

        toast.error(t('employeesnotfound'));
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
)

export const updateEmployee = createAsyncThunk(
  'profile/update',
  async ({ Id, rawForm }, { rejectWithValue }) => {
    try {
      let token = JSON.parse(localStorage.getItem('token'));
      const cleanDateInput = (value) => {
        if (!value || value.trim() === '?' || value.trim().includes('?') || value.trim() === '0') {
          return null;
        }
        const parsed = new Date(value);
        if (isNaN(parsed.getTime())) {
          console.warn("Invalid date parsed:", value);
          return null;
        }
        return parsed.toISOString().slice(0, 19).replace('T', ' '); 
      };

      const prepareFormData = (rawForm) => {
        return {
          en_name: rawForm.en_name || "",
          title: rawForm.title || "",
          sex: rawForm.sex || "",
          date_of_birth: cleanDateInput(rawForm.date_of_birth) || null,
          user_id: rawForm.user_id || "",
          joined_date: cleanDateInput(rawForm.joined_date) || null,
          photo: rawForm.photo || "",
          phone_number: rawForm.phone_number || "",
          organization_unit_id: rawForm.organization_unit?.id || "",
          job_position_id: rawForm.job_position?.id || "",
          job_title_category_id: rawForm.job_title_category?.id || "",
          salary: parseInt(rawForm.salary) || "",
          martial_status_id: rawForm.marital_status?.id || "",
          nation: rawForm.nation || "",
          employment_id: rawForm.employment_id || "",
          job_position_start_date: cleanDateInput(rawForm.job_position_start_date) || null,
          job_position_end_date: cleanDateInput(rawForm.job_position_end_date) || null,
          address: rawForm.address || "",
          house_number: rawForm.house_number || "",
          region_id: rawForm.region?.id || "",
          woreda_id: rawForm.woreda?.id || "",
          zone_id: rawForm.zone?.id || "",
          id_status: rawForm.id_status || "",
          status: rawForm.status || ""
        };
      };
      const form = prepareFormData(rawForm);

      let formData = new FormData();
      formData.append('_method', 'PUT');

      for (const key in form) {
        if (Object.hasOwnProperty.call(form, key)) {
          const value = form[key];

          if (value === null || value === undefined || value === '') continue;

          if (value instanceof File) {
            formData.append(key, value, value.name);
          } else if (typeof value === 'boolean') {
            formData.append(key, value ? '1' : '0');
          } else {
            formData.append(key, value);
          }
        }
      }

      let response = await axios.post(`http://localhost:8000/api/employees/${Id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).catch(error => { console.log(error.response) });

      let data = response.data;
      console.log(response);
      console.log(response.data);
      if (data) {
        toast.success(i18next.t('employeeupdatedsuccessfully'));
        if (Array.isArray(data)) {
          return data;
        }
        else {
          return [data];
        }
      }
      else {
        toast.error(i18next.t('failedtoupdateemployee'));
      }

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const deleteEmployee = createAsyncThunk(
  'delete/profile',
  async ({ Id }, { rejectWithValue }) => {
    try {
      console.log(Id);
      let token = JSON.parse(localStorage.getItem('token'));
      await axios.delete(`http://localhost:8000/api/employees/${Id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          toast.success(i18next.t('employeedeletedsuccessfully'));
          console.log(response);
        })
        .catch(error => {
          toast.error(i18next.t('failedtodeleteemployee'))
          console.log(error.response);
        })

    } catch (error) {
      return rejectWithValue(error);
    }
  }
)

export const deleteEmployeeBunch = createAsyncThunk(
  'profile/deletebunch',
  async (selectedUsers, { rejectWithValue }) => {
    try {
      console.log(selectedUsers)
      let token = JSON.parse(localStorage.getItem('token'));
      const idList = Object.keys(selectedUsers);
      const ids = idList.map(id => Number(id));
      console.log(ids);
      await axios.post(`http://localhost:8000/api/employees/delete-bunch`, {
        "ids": ids
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          toast.success(i18next.t('employeesdeletedsuccessfully'));
          console.log(response);
        })
        .catch(error => {
          toast.error(i18next.t('failedtodeleteemployees'))
          console.log(error);
        })

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getEmployee = createAsyncThunk(
  'profile/get',
  async ({ Id }, { rejectWithValue }) => {
    try {

      console.log("id",Id);
      const response=await axios.get(`http://localhost:8000/api/employees/${Id}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      console.log(response);
      const data=response.data;
      console.log(data.data);
      return data.data;

    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message || 'Failed to get profile');
    }
  }
);






const profileSlice = createSlice({
  name: 'Profile',
  initialState: {
    profiles: [],
    en_name: "",
    title: "",
    sex: "",
    date_of_birth: "",
    joined_date: "",
    photo: "",
    phone_number: "",
    organization_unit_id: "",
    job_position_id: "",
    job_title_category_id: "",
    salary: "",
    martial_status_id: "",
    nation: "",
    employment_id: "",
    job_position_start_date: "",
    job_position_end_date: "",
    address: "",
    house_number: "",
    region_id: "",
    woreda_id: "",
    zone_id: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addEmployee.fulfilled, (state, action) => {
        const newProfile = Array.isArray(action.payload) ? action.payload[0] : action.payload;
        state.profiles.push(newProfile);
      })

      .addCase(updateEmployee.fulfilled, (state, action) => {
        const updated = Array.isArray(action.payload) ? action.payload[0] : action.payload;
        const index = state.profiles.findIndex(profile => profile.id === updated.id);
        if (index !== -1) {
          state.profiles[index] = updated;
        }
      })

      .addCase(deleteEmployee.fulfilled, (state, action) => {
        const deletedId = action.meta.arg.Id;
        state.profiles = state.profiles.filter(profile => profile.id !== deletedId);
      })

      .addCase(deleteEmployeeBunch.fulfilled, (state, action) => {
        const deletedIds = action.payload; // assume this is an array of deleted IDs
        state.profiles = state.profiles.filter(profile => !deletedIds.includes(profile.id));
      })

      .addCase(getEmployee.fulfilled, (state, action) => {
        state.profiles = action.payload;
      });

  }

})
export default profileSlice.reducer;
