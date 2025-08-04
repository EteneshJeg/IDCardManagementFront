import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from 'axios';
import i18next from "i18next";

let token = JSON.parse(localStorage.getItem('token'));
export const getUsers = createAsyncThunk(
    'user/get',
    async (_, { rejectWithValue }) => {
        try {
            
            console.log(localStorage.getItem('token'));
            let response = await axios.get('http://localhost:8000/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response)
            let data = response.data;
            console.log(data);
            let returneddata = Array.isArray(data) ? data : [data];
            console.log(returneddata)
            return returneddata;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const addUser = createAsyncThunk(
    'user/add',


    async ({ rawForm }, { rejectWithValue }) => {



        try {

            console.log(rawForm);
            let form = {
                name: rawForm.name,
                email: rawForm.email,
                password: rawForm.password,
                profile_image: rawForm.profile_image,
                active: 1, //accessible or not
                first_time: 0,//change on login
                role: Array.isArray(rawForm.role) ? rawForm.role : [rawForm.role]
            }
            console.log(form);
            let formdata = new FormData();
            for (let key in form) {
                if (key !== 'role' && key !== 'profile_image') {
                    formdata.append(key, form[key]);
                }
            }

            if (Array.isArray(form.role)) {
                form.role.forEach(role => {
                    formdata.append('roles[]', role);
                });
            }
            // Append image separately
            if (rawForm.profile_image instanceof File) {
                formdata.append('profile_image', rawForm.profile_image);
            } else {
                console.log("Invalid or missing profile image file");
            }


            for (let pair of formdata.entries()) {
                console.log(pair[0] + ':', pair[1]);
            }

            await axios.post('http://localhost:8000/api/users', formdata, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                console.log(response.data);
                toast.success(i18next.t('usersavedsuccessfully'));
                return;
            }).catch(error => {
                console.log(error);
                console.log(error.response);
                toast.error(i18next.t('failedtosaveuser'));
                return;
            })

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateUser = createAsyncThunk(
    'user/update',

    async ({ Id, rawForm }, { rejectWithValue }) => {

        console.log(rawForm);


        try {

            let form = {
                name: rawForm.name,
                email: rawForm.email,
                password: rawForm.password,
                profile_image: rawForm.profile_image,
                active: true,
                first_time: true,
                role: Array.isArray(rawForm.role) ? rawForm.role : [rawForm.role]
            }
            console.log(form);

            let formData = new FormData();
            formData.append('_method', 'PUT');

            for (const key in form) {
                if (Object.hasOwnProperty.call(form, key)) {
                    const value = form[key];

                    if (key === 'role' && Array.isArray(value)) {
                        value.forEach(role => {
                            formData.append('roles[]', role);
                        });
                    } else if (key === 'profile_image' && rawForm.profile_image instanceof File) {
                        formData.append('profile_image', rawForm.profile_image);
                    } else if (typeof value === 'boolean') {
                        // Convert boolean to string 'true' or 'false'
                        formData.append(key, value ? '1' : '0');
                    } else {
                        formData.append(key, value);
                    }
                }
            }


            for (let pair of formData.entries()) {
                console.log(pair[0] + ':', pair[1]);
            }


            let token = JSON.parse(localStorage.getItem('token'));
            try {
                const response = await axios.post(`http://localhost:8000/api/users/${Id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log(response.data);
                toast.success(i18next.t('userupdated'));
                return;
            } catch (error) {
                console.log(error.response);
                toast.error(i18next.t('failedtoupdateuser'));
                return;
            }

        } catch (error) {
            return rejectWithValue(error.message || 'Update failed');
        }
    }
);

export const deleteUser = createAsyncThunk(
    'user/delete',
    async (Id, { rejectWithValue }) => {


        try {

            console.log(Id);
            let id = (Id.id);
            console.log(id);
            await axios.delete(`http://localhost:8000/api/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    toast.success(i18next.t('deletesuccessful'));
                    console.log(response);
                })
                .catch(error => {
                    toast.error(i18next.t('deletefailed'));
                    console.log(error);
                })

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteBunch = createAsyncThunk(
    'user/deletebunch',
    async (id, { rejectWithValue }) => {


        try {

            const idList = Object.keys(id);
            const ids = idList.map(id => Number(id));
            console.log(ids);
            await axios.post(`http://localhost:8000/api/users/delete-bunch`, {
                "ids": ids
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    toast.success(i18next.t('deletesuccessful'));
                    console.log(response);
                })
                .catch(error => {
                    toast.error(i18next.t('deletefailed'));
                    console.log(error);
                })

        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

const userSlice = createSlice({
    name: 'User',
    initialState: {
        username: '',
        email: '',
        password: '',
        name: '',
        role: [],
        id: 1,
        status: '',
        users: [],
        employee_id: '',
        user: ''
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
           
            .addCase(addUser.fulfilled, (state, action) => {
                state.users = [...state.users, action.payload]

            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.users = [...state.users, action.payload]

            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = [...state.users, action.payload];
            })
            .addCase(deleteBunch.fulfilled, (state, action) => {
                state.users = [...state.users, action.payload];
            })
    }
})

export default userSlice.reducer;