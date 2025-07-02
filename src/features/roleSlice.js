import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const addRole=createAsyncThunk(
    'role/add',
    async({form},{rejectWithValue})=>{
        try{
            let token=JSON.parse(localStorage.getItem('token'));
            console.log(token);
            await axios.post('http://localhost:8000/api/roles',form,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }).then(response=>{
                console.log(response);
                toast.success('Role added');
                return;
            }).catch(error=>{
                console.log(error.response);
                toast.error('Role was not added');
                return;
            })
        }catch(error){
            return rejectWithValue(error.message);
        }
    }
);
export const getRole=createAsyncThunk(

)

const roleSlice=createSlice({
    name:'roleSlice',
    initialState:{
        name:'',
        roles:[]
    }
})
export default roleSlice.reducer;