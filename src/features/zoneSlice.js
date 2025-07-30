import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import i18next from "i18next";

export const createZone=createAsyncThunk(
    'zone/create',
    async({FormData},{rejectWithValue})=>{
        try{
            console.log(FormData);
            let token=JSON.parse(localStorage.getItem('token'));
            
            await axios.post('http://localhost:8000/api/zones',FormData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }).then(response=>{
                console.log(response.data);
                toast.success(i18next.t('zonesavedsuccessfully'));
                return;
            }).catch(error=>{
                console.log(error);
                console.log(error.response);
                toast.error(i18next.t('failedtosavezone'));
                return;
            })
        }catch(error){
            toast.error(i18next.t('failedtosavezone'));
            return rejectWithValue(error.message);
        }
    }
)

export const getZone=createAsyncThunk(
    'zone/get',
    async(_,{rejectWithValue})=>{
        try{
            let token=JSON.parse(localStorage.getItem('token'));
            console.log(localStorage.getItem('token')); 
            let response=await axios.get('http://localhost:8000/api/zones',{
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
            return rejectWithValue(error.message)
        }
    }
)

export const updateZone=createAsyncThunk(
    'zone/update',
    async({Id,FormData},{rejectWithValue})=>{
        try{
            let token=JSON.parse(localStorage.getItem('token'));
            await axios.put(`http://localhost:8000/api/zones/${Id}`,FormData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }).then(response=>{
                console.log(response.data);
                toast.success(i18next.t('zoneupdatedsuccessfully'));
                return;
            }).catch(error=>{
                console.log(error.response);
                toast.error(i18next.t('failedtoupdatezone'));
                return;
            })
            
        }catch(error){
            toast.error(i18next.t('failedtoupdatezone'));
        }
    }
)

export const deleteZone=createAsyncThunk(
    'zone/delete',
    async({Id},{rejectWithValue})=>{
        try{
            let token=JSON.parse(localStorage.getItem('token'));
            await axios.delete(`http://localhost:8000/api/zones/${Id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            .then(response=>{
                toast.success(i18next.t('zonedeletedsuccessfully'));
                console.log(response);
            })
            .catch(error=>{
                console.log(error);
            })
            /*let storedZones = JSON.parse(localStorage.getItem('zone')) || [];
            console.log(storedZones);
            
            console.log(Id)
            if (!Array.isArray(storedZones)) {
                storedZones = [storedZones];
            }
            storedZones = storedZones.filter(storedZone => {
                return String(storedZone.id).trim() !== String(Id).trim();
              });
              console.log(storedZones)
         if(!storedZones){
            return rejectWithValue('Zone not found');
         }
        localStorage.setItem('zone',JSON.stringify(storedZones));
        toast.success('Zone deleted successfully');
        return storedZones;*/
              
        }catch(error){
            toast.error(i18next.t('failedtodeletezone'));
            console.log(error.message);
        }
    }

)

export const deleteBunch=createAsyncThunk(
    'zone/deletebunch',
    async({Id},{rejectWithValue})=>{
        try{
            let storedZones = JSON.parse(localStorage.getItem('zone')) || [];
            console.log(storedZones);
            
            console.log(Id)
            if (!Array.isArray(storedZones)) {
                storedZones = [storedZones];
            }
            const zoneCodesToRemove = Object.keys(Id).filter(name => Id[name]); 

            storedZones = storedZones.filter(
             storedZone => !zoneCodesToRemove.includes(String(storedZone.id))
            );

            if(!storedZones){
                return rejectWithValue('Zones not found');
            }

            localStorage.setItem('zone',JSON.stringify(storedZones));
            toast.success(i18next.t('zonedeletedsuccessfully'));
            return storedZones
        }catch(error){
            toast.success(i18next.t('failedtodeletezone'));
            return rejectWithValue(error.message);
        }
    }
)

const zoneSlice=createSlice({
    name:'zone',
    initialState:{
        name:'',
        region:'',
        zone:[]
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(createZone.fulfilled,(state,action)=>{
                state.zone=[...state.zone,action.payload]
            })
            .addCase(updateZone.fulfilled,(state,action)=>{
                state.zone=[...state.zone,action.payload]
            })
            .addCase(deleteZone.fulfilled,(state,action)=>{
                state.zone=[...state.zone,action.payload]
            })
            .addCase(deleteBunch.fulfilled,(state,action)=>{
                state.zone=[...state.zone,action.payload]
            })
    }
})
export default zoneSlice.reducer;