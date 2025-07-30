import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import i18next from "i18next";

export const createRegion=createAsyncThunk(
    'region/create',
    async({FormData},{rejectWithValue})=>{
        try{
            let token=JSON.parse(localStorage.getItem('token'));
            await axios.post('http://localhost:8000/api/regions',FormData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }).then(response=>{
                console.log(response.data);
                toast.success(i18next.t('regionsavedsuccessfully'));
                return;
            }).catch(error=>{
                console.log(error.response);
                toast.error(i18next.t('failedtosaveregion'));
                return;
            })
          
        }catch(error){
            toast.error(i18next.t('failedtosaveregion'));
            return rejectWithValue(error.message);
        }
    }
)

export const getRegion=createAsyncThunk(
    'region/get',
    async(_,{rejectWithValue})=>{
        try{
            let token=JSON.parse(localStorage.getItem('token'));
            console.log(localStorage.getItem('token')); 
            let response=await axios.get('http://localhost:8000/api/regions',{
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

export const updateRegion=createAsyncThunk(
    'region/update',
    async({Id,FormData},{rejectWithValue})=>{
        try{
            let token=JSON.parse(localStorage.getItem('token'));
            await axios.put(`http://localhost:8000/api/regions/${Id}`,FormData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }).then(response=>{
                console.log(response.data);
                toast.success(i18next.t('regionupdated'));
                return;
            }).catch(error=>{
                console.log(error.response);
                toast.error(i18next.t('failedtoupdateregion'));
                return;
            })
           

        }catch(error){
            toast.error(i18next.t('failedtoupdateregion'));
            return rejectWithValue(error.message);
        }
    }
)

export const deleteRegion=createAsyncThunk(
    'region/delete',
    async({Id},{rejectWithValue})=>{
        try{
            let token=JSON.parse(localStorage.getItem('token'));
            await axios.delete(`http://localhost:8000/api/regions/${Id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            .then(response=>{
                toast.success(i18next.t('regiondeletedsuccessfully'));
                console.log(response);
            })
            .catch(error=>{
                console.log(error);
            })
            

        }catch(error){
            toast.error(i18next.t('failedtodeleteregion'));
            return rejectWithValue(error.message);
        }
    }
)

export const deleteBunch=createAsyncThunk(
    'region/deletebunch',
    async({Id},{rejectWithValue})=>{
        try{
            let storedRegions = JSON.parse(localStorage.getItem('region')) || [];
            console.log(storedRegions);
            
            console.log(Id);
            if (!Array.isArray(storedRegions)) {
                storedRegions = [storedRegions];
            }

            const regionCodesToRemove = Object.keys(Id).filter(id => Id[id]); 
            console.log(regionCodesToRemove)
            

            storedRegions = storedRegions.filter(
             storedRegion => !regionCodesToRemove.includes(String(storedRegion.id))
            );


            console.log(storedRegions)

            localStorage.setItem('region',JSON.stringify(storedRegions));
            toast.success('Delete successful');
            return storedRegions;            

        }catch(error){
            toast.error('Failed to delete');
            return rejectWithValue(error.message);
        }
    }
)

const regionSlice=createSlice({
    name:'Region',
    initialState:{
        name:'',
        code:'',
        region:[]

    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(createRegion.fulfilled,(state,action)=>{
            state.region=[...state.region,action.payload]
        })
        .addCase(updateRegion.fulfilled,(state,action)=>{
            state.region=[...state.region,action.payload]
        })
        .addCase(deleteRegion.fulfilled,(state,action)=>{
            state.region=[...state.region,action.payload]
        })
        .addCase(deleteBunch.fulfilled,(state,action)=>{
            state.region=[...state.region,action.payload]
        })
    }
        
})

export default regionSlice.reducer;