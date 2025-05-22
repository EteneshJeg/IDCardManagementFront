import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";

export const createZone=createAsyncThunk(
    'zone/create',
    async({FormData},{rejectWithValue})=>{
        try{
            let zoneId;
            let storedZones = JSON.parse(localStorage.getItem('zone')) || [];
            console.log(storedZones);
            
            if (!Array.isArray(storedZones)) {
                storedZones = [storedZones];
            }
            if (storedZones.length === 0) {
                let lastZoneId=0;
                zoneId=lastZoneId+1;
            } else {
                const lastZone = storedZones.pop();
                if (lastZone && lastZone.id) {
                    let lastZoneId = lastZone.id;
                     lastZoneId=parseInt(lastZoneId,10);
                      zoneId=lastZoneId+1;
                      
                } else {
                    let lastZoneId=0;
                    zoneId=lastZoneId+1;
                }
                storedZones.push(lastZone);
            }
            let newZone={
                id:zoneId,
                name:FormData.name,
                region:FormData.region
            }
            storedZones.push(newZone);
            localStorage.setItem('zone',JSON.stringify(storedZones));
            alert('Zone saved successfully');
            return newZone;

        }catch(error){
            return rejectWithValue(error.message);
        }
    }
)

export const getZone=createAsyncThunk(
    'zone/get',
    async(_,{rejectWithValue})=>{
        try{
            
            let storedZones = JSON.parse(localStorage.getItem('zone')) || [];
            console.log(storedZones);
            
            if (!Array.isArray(storedZones)) {
                storedZones = [storedZones];
            }
            if(storedZones){
                return storedZones;
            }
        }catch(error){
            return rejectWithValue(error.message)
        }
    }
)

export const updateZone=createAsyncThunk(
    'zone/update',
    async({Id,FormData},{rejectWithValue})=>{
        try{
            let storedZones = JSON.parse(localStorage.getItem('zone')) || [];
            console.log(storedZones);
            
            if (!Array.isArray(storedZones)) {
                storedZones = [storedZones];
            }
            const zoneIndex = storedZones.findIndex(storedZone => {
               
                return String(storedZone.id).trim() === String(Id).trim();  
            });
            if(zoneIndex==-1){
                return rejectWithValue('Zone not found');
            }

            let updatedZone={
                ...storedZones[zoneIndex],
                name:FormData.name,
                region:FormData.region
            }
            storedZones[zoneIndex]=updatedZone;
            localStorage.setItem('zone',JSON.stringify(storedZones));
            alert('Zone successfully updated');
            return updatedZone;
        }catch(error){

        }
    }
)

export const deleteZone=createAsyncThunk(
    'zone/delete',
    async({Id},{rejectWithValue})=>{
        try{
            let storedZones = JSON.parse(localStorage.getItem('zone')) || [];
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
        alert('Zone deleted successfully');
        return storedZones;
              
        }catch(error){
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
            alert('Delete successful');
            return storedZones
        }catch(error){
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