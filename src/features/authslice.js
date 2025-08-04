import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from 'axios';
import i18next from "i18next";



export const signin = createAsyncThunk(
    'user/signin',
    async (FormData, { rejectWithValue }) => {

        try {
            const loginResponse = await axios.post('http://localhost:8000/api/login', FormData)
                .catch(error => {
                    console.log("Error", error.response.data.message);
                    toast.error(error.response.data.message);
                });

            localStorage.setItem('token', JSON.stringify(loginResponse.data.token));
            console.log(loginResponse.data.token);
            localStorage.setItem('userId', JSON.stringify(loginResponse.data.user.id));




            console.log("Success", loginResponse.data)
            toast.success(loginResponse.data.message);
            let token = JSON.parse(localStorage.getItem('token'));


            let userlist = await axios.get('http://localhost:8000/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(userlist);
            let data = userlist.data
            console.log(data);
            const match = data.filter(key => {
                return key.email === FormData.email ? key.id : null
            })
            console.log(match);
            const form = {
                id: match[0].id,
                name: match[0].name,
                profile_image: match[0].profile_image,
                active: match[0].active, //accessible or not
                first_time: false

            }
            const id = match[0].id;
            console.log(id)
            if (match[0].first_time) {
                await axios.put(`http://localhost:8000/api/users/${id}`, form, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    console.log(response.data);

                    return match;
                }).catch(error => {
                    console.log(error);
                    console.log(error.response);


                })
            }
            else {
                console.log('not first time');
            }
            return loginResponse.data


        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const signout = createAsyncThunk(
    'user/signout',
    async (_, { rejectWithValue }) => {
        try {
            console.log('loggin out')
            const token = JSON.parse(localStorage.getItem('token'));
            await axios.post('http://localhost:8000/api/logout', FormData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                localStorage.setItem('token', JSON.stringify(response.data.token));
                console.log(response.data.token);
                console.log("Success", response.data)
                toast.success(response.data.message);
            })
                .catch(error => console.log("Error", error.response.data));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)
const authSlice = createSlice({
    name: 'Auth',
    initialState: {
        username: '',
        email: '',
        password: '',
        role: [],
        users: [],
        logged: false,
        user: ''
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(signin.fulfilled, (state, action) => {
                console.log(action.payload);
                state.logged = true;
                state.role = action.payload.role;
                state.email = action.payload.email;
                state.employee_id = action.payload.employee_id;
                state.user = action.payload.user;
            })
            .addCase(signin.rejected, (state) => {
                state.logged = false;
                console.log(action.payload);
            })
            .addCase(signout.fulfilled,(state,action)=>{
                state.logged=false;
            })
            .addCase(signout.rejected,(state,action)=>{
                state.logged=true;
            })
           
    }
})

export default authSlice.reducer;