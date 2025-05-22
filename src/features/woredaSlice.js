import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";

export const createWoreda=createAsyncThunk(
    'woreda/create',
    async({FormData},{rejectWithValue})=>{
        try{
            let woredaId;
            let storedWoredas = JSON.parse(localStorage.getItem('woreda')) || [];
            console.log(storedWoredas);
            
            if (!Array.isArray(storedWoredas)) {
                storedWoredas = [storedWoredas];
            }
            console.log(storedWoredas)

             if (storedWoredas.length === 0) {
                let lastWoredaId=0;
                woredaId=lastWoredaId+1;
            } else {
                const lastWoreda = storedWoredas.pop();
                if (lastWoreda && lastWoreda.id) {
                    let lastWoredaId = lastWoreda.id;
                     lastWoredaId=parseInt(lastWoredaId,10);
                      woredaId=lastWoredaId+1;
                      
                } else {
                    let lastWoredaId=0;
                    woredaId=lastWoredaId+1;
                }
                storedWoredas.push(lastWoreda);
            }
            
            let newWoreda={
                id:woredaId,
                name:FormData.name,
                zone:FormData.zone
            }
            if(!newWoreda){
                alert('Failed to create woreda');
                return rejectWithValue('Failed to create woreda');
            }
            storedWoredas.push(newWoreda);
            localStorage.setItem('woreda',JSON.stringify(storedWoredas));
            alert ('Woreda saved successfully');
            return newWoreda;
        }catch(error){
            return rejectWithValue(error.message);
        }
    }
)

export const getWoreda=createAsyncThunk(
    'woreda/get',
    async(_,{rejectWithValue})=>{
        try{
            
            let storedWoredas = JSON.parse(localStorage.getItem('woreda')) || [];
            console.log(storedWoredas);
            
            if (!Array.isArray(storedWoredas)) {
                storedWoredas = [storedWoredas];
            }
            if(storedWoredas){
                return storedWoredas;
            }
        }catch(error){
            return rejectWithValue(error.message);
        }
    }
)

export const updateWoreda=createAsyncThunk(
    'woreda/update',
    async({Id,FormData},{rejectWithValue})=>{
        try{
            let storedWoredas = JSON.parse(localStorage.getItem('woreda')) || [];
            
            if (!Array.isArray(storedWoredas)) {
                storedWoredas = [storedWoredas];
            }
            let woredaIndex=storedWoredas.findIndex(storedWoreda=>{
                return String(storedWoreda.id).trim()===String(Id).trim()
            })
            if(woredaIndex==-1){
                return rejectWithValue('Woreda not found');
            }
            let updatedWoreda={
                ...storedWoredas[woredaIndex],
                name:FormData.name,
                zone:FormData.zone
            }
            storedWoredas[woredaIndex]=updatedWoreda;
            
            localStorage.setItem('woreda',JSON.stringify(storedWoredas));
            alert('Woreda updated successfully');
            return updatedWoreda;
            

        }catch(error){
            return rejectWithValue(error.message)
        }
    }
)

export const deleteWoreda=createAsyncThunk(
    'woreda/delete',
    async({Id},{rejectWithValue})=>{
        try{
            let storedWoredas = JSON.parse(localStorage.getItem('woreda')) || [];
            
            if (!Array.isArray(storedWoredas)) {
                storedWoredas = [storedWoredas];
            }
            storedWoredas=storedWoredas.filter(storedWoredas=>{
                return String(storedWoredas.id).trim()!==String(Id).trim();
            })
            if(!storedWoredas){
                return rejectWithValue('Woreda not found');
            }
            localStorage.setItem('woreda',JSON.stringify(storedWoredas));
            alert('Woreda deleted successfully');
            return storedWoredas
        }catch(error){
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
            alert('Woredas deleted successfully');
            return storedWoredas;
        }catch(error){
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