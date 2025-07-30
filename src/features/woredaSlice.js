import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import i18next from "i18next";


export const createWoreda=createAsyncThunk(
    'woreda/create',
    async({FormData},{rejectWithValue})=>{
        try{
             let token=JSON.parse(localStorage.getItem('token'));
            await axios.post('http://localhost:8000/api/woreda',FormData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }).then(response=>{
                console.log(response.data);
                toast.success(i18next.t('woredasavedsuccessfully'));
                return;
            }).catch(error=>{
                console.log(error.response);
                toast.error(i18next.t('failedtosaveworeda'));
                return;
            })
            
        }catch(error){
            return rejectWithValue(error.message);
        }
    }
)

export const getWoreda=createAsyncThunk(
    'woreda/get',
    async(_,{rejectWithValue})=>{
        try{
            let token=JSON.parse(localStorage.getItem('token'));
            console.log(localStorage.getItem('token')); 
            let response=await axios.get('http://localhost:8000/api/woreda',{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            let data=response.data.data;
            console.log(data);
            let returneddata=Array.isArray(data)?data:[data];
            console.log(returneddata)
            return returneddata;
            
        }catch(error){
            return rejectWithValue(error.message);
        }
    }
)

export const updateWoreda=createAsyncThunk(
    'woreda/update',
    async({Id,FormData},{rejectWithValue})=>{
        try{
            let token=JSON.parse(localStorage.getItem('token'));
            await axios.put(`http://localhost:8000/api/woreda/${Id}`,FormData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }).then(response=>{
                console.log(response.data);
                toast.success(i18next.t('woredaupdatedsuccessfully'));
                return;
            }).catch(error=>{
                console.log(error.response);
                toast.error(i18next.t('failedtoupdateworeda'));
                return;
            })
            
            

        }catch(error){
            toast.error(i18next.t('failedtoupdateworeda'));
            return rejectWithValue(error.message)
        }
    }
)

export const deleteWoreda=createAsyncThunk(
    'woreda/delete',
    async({Id},{rejectWithValue})=>{
        try{
            let token=JSON.parse(localStorage.getItem('token'));
            await axios.delete(`http://localhost:8000/api/woreda/${Id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            .then(response=>{
                toast.success(i18next.t('woredadeletesuccessful'));
                console.log(response);
            })
            .catch(error=>{
                console.log(error);
            })
            
        }catch(error){
            toast.error(i18next.t('failedtodeleteworeda'));
            return rejectWithValue(error.message);
        }
    }
)

export const deleteBunch=createAsyncThunk(
    'woreda/deletebunch',
    async({Id},{rejectWithValue})=>{
        try{
            let storedWoredas = JSON.parse(localStorage.getItem('woreda')) || [];
            
            if (!Array.isArray(storedWoredas)) {
                storedWoredas = [storedWoredas];
            }
            const woredaCodesToRemove = Object.keys(Id).filter(name => Id[name]); 

            storedWoredas = storedWoredas.filter(
             storedWoreda => !woredaCodesToRemove.includes(String(storedWoreda.id))
            );
            if(!storedWoredas){
                return rejectWithValue('Woredas not found');
            }
            localStorage.setItem('woreda',JSON.stringify(storedWoredas));
            toast.success(i18next.t('woredadeletedsuccessfully'));
            return storedWoredas;
        }catch(error){
            toast.error(i18next.t('failedtodeleteworeda'));
            return rejectWithValue(error.message);
        }
    }
)

const woredaSlice=createSlice({
    name:'woreda',
    initialState:{
        name:'',
        zone:'',
        woreda:[]
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(createWoreda.fulfilled,(state,action)=>{
                state.woreda=[...state.woreda,action.payload];
            })
            .addCase(updateWoreda.fulfilled,(state,action)=>{
                state.woreda=[...state.woreda,action.payload];
            })
            .addCase(deleteWoreda.fulfilled,(state,action)=>{
                state.woreda=[...state.woreda,action.payload];
            })
            .addCase(deleteBunch.fulfilled,(state,action)=>{
                state.woreda=[...state.woreda,action.payload];
            })
    }
    
})
export default woredaSlice.reducer;