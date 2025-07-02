import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const createMaritalStatus=createAsyncThunk(
    'maritalstatus/create',
    async({FormData},{rejectWithValue})=>{
        try{
            console.log(FormData)
            let token=JSON.parse(localStorage.getItem('token'));
            await axios.post('http://localhost:8000/api/marital-status',FormData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }).then(response=>{
                console.log(response.data);
                toast.success("Marital status saved");
                return;
            }).catch(error=>{
                console.log(error.response);
                toast.error("Failed to save marital status");
                return;
            })
            /*let maritalStatusId;
            let storedMaritalStatuses = JSON.parse(localStorage.getItem('maritalstatus')) || [];
            console.log(storedMaritalStatuses);
            
            if (!Array.isArray(storedMaritalStatuses)) {
                storedMaritalStatuses = [storedMaritalStatuses];
            }

            if (storedMaritalStatuses.length === 0) {
                let lastMaritalStatusId=0;
                maritalStatusId=lastMaritalStatusId+1;
            } else {
                const lastMaritalStatus = storedMaritalStatuses.pop();
                if (lastMaritalStatus && lastMaritalStatus.id) {
                    let lastMaritalStatusId = lastMaritalStatus.id;
                     lastMaritalStatusId=parseInt(lastMaritalStatusId,10);
                      maritalStatusId=lastMaritalStatusId+1;
                      
                } else {
                    let lastMaritalStatusId=0;
                    maritalStatusId=lastMaritalStatusId+1;
                }
                storedMaritalStatuses.push(lastMaritalStatus);
            }
            const isMaritalStatusRegistered=storedMaritalStatuses.some(storedMaritalStatus=>storedMaritalStatus.name===FormData.name)

            if(isMaritalStatusRegistered){
                toast.error('Status is already registered');
                return;
            }
            
            let newMaritalStatus={
                id:maritalStatusId,
                name:FormData.name,
                description:FormData.description
            }
            console.log(newMaritalStatus)
            if(!newMaritalStatus){
                return rejectWithValue('Marital Status was not recorded');
            }
            storedMaritalStatuses.push(newMaritalStatus);
            localStorage.setItem('maritalstatus',JSON.stringify(storedMaritalStatuses));
            toast.success('Marital Status has been successfully added');
            return newMaritalStatus;*/
        }catch(error){
            toast.error('Failed to register marital status');
            return rejectWithValue(error.message);
        }
    }
)

export const getMaritalStatus=createAsyncThunk(
    'maritalstatus/get',
    async(__,{rejectWithValue})=>{
        try{ let token=JSON.parse(localStorage.getItem('token'));
            console.log(localStorage.getItem('token')); 
            let response=await axios.get('http://localhost:8000/api/marital-status',{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            let data=response.data.data;
            console.log(data);
            let returneddata=Array.isArray(data)?data:[data];
            console.log(returneddata)
            return returneddata;
            /*let storedMaritalStatuses = JSON.parse(localStorage.getItem('maritalstatus')) || [];
            console.log(storedMaritalStatuses);
            
            if (!Array.isArray(storedMaritalStatuses)) {
                storedMaritalStatuses = [storedMaritalStatuses];
            }

            if(storedMaritalStatuses){
                return storedMaritalStatuses;
            }*/
        }catch(error){
            return rejectWithValue(error.message);
        }
    }
)

export const updateMaritalStatus=createAsyncThunk(
    'maritalstatus/update',
    async({Id,FormData},{rejectWithValue})=>{
        try{
            let token=JSON.parse(localStorage.getItem('token'));
            await axios.put(`http://localhost:8000/api/marital-status/${Id}`,FormData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }).then(response=>{
                console.log(response.data);
                toast.success("Marital status updated");
                return;
            }).catch(error=>{
                console.log(error.response);
                toast.error("Failed to update marital status");
                return;
            })
           /* let storedMaritalStatuses = JSON.parse(localStorage.getItem('maritalstatus')) || [];
            console.log(storedMaritalStatuses);
            
            if (!Array.isArray(storedMaritalStatuses)) {
                storedMaritalStatuses = [storedMaritalStatuses];
            }

            const maritalStatusIndex = storedMaritalStatuses.findIndex(storedMaritalStatus => {
                return String(storedMaritalStatus.id).trim() === String(Id).trim();  
            });
            console.log(maritalStatusIndex)

            if(maritalStatusIndex===-1){
                return rejectWithValue('Marital Status not found');
            }
            let updatedMaritalStatus={
                ...storedMaritalStatuses[maritalStatusIndex],
                name:FormData.name,
                description:FormData.description
            }
            console.log(updatedMaritalStatus)
            storedMaritalStatuses[maritalStatusIndex]=updatedMaritalStatus;
            console.log( storedMaritalStatuses[maritalStatusIndex])
            localStorage.setItem('maritalstatus',JSON.stringify(storedMaritalStatuses));
            toast.success('Marital Status has been successfully updated');
            return updatedMaritalStatus;*/

        }catch(error){
            toast.error('Failed to update marital status');
            return rejectWithValue(error.message);
        }
    }
)

export const deleteMaritalStatus=createAsyncThunk(
    'maritalstatus/delete',
    async({Id},{rejectWithValue})=>{
        try{
            let token=JSON.parse(localStorage.getItem('token'));
            await axios.delete(`http://localhost:8000/api/marital-status/${Id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            .then(response=>{
                toast.success('Delete Successful');
                console.log(response);
            })
            .catch(error=>{
                console.log(error);
            })
            /*let storedMaritalStatuses = JSON.parse(localStorage.getItem('maritalstatus')) || [];
            console.log(storedMaritalStatuses);
            
            if (!Array.isArray(storedMaritalStatuses)) {
                storedMaritalStatuses = [storedMaritalStatuses];
            }
            
            storedMaritalStatuses = storedMaritalStatuses.filter(storedMaritalStatus => {
                return String(storedMaritalStatus.id).trim() !== String(Id).trim();
              });
            if(!storedMaritalStatuses){
                return rejectWithValue('Salary not deleted');
            }
            localStorage.setItem('maritalstatus',JSON.stringify(storedMaritalStatuses));
            toast.success('Marital Status has been successfully deleted');
            return storedMaritalStatuses;*/

        }catch(error){
            toast.error('Failed to delete marital status');
            return rejectWithValue(error.message);
        }
    }
)

export const deleteBunch=createAsyncThunk(
    'maritalstatus/deletebunch',
    async({Id},{rejectWithValue})=>{
        try{
            let storedMaritalStatuses = JSON.parse(localStorage.getItem('maritalstatus')) || [];
            console.log(storedMaritalStatuses);
            
            if (!Array.isArray(storedMaritalStatuses)) {
                storedMaritalStatuses = [storedMaritalStatuses];
            }
            const maritalStatusCodesToRemove = Object.keys(Id).filter(id => Id[id]); 

            storedMaritalStatuses = storedMaritalStatuses.filter(
             storedMaritalStatus => !maritalStatusCodesToRemove.includes(String(storedMaritalStatus.id))
            );

            if(!maritalStatusCodesToRemove){
                return rejectWithValue('Delete not successful');
            }
            localStorage.setItem('maritalstatus',JSON.stringify(storedMaritalStatuses));
            toast.success('Delete successful');
            return storedMaritalStatuses;
        }catch(error){
            toast.error("Failed to delete");
            return rejectWithValue(error.message);
        }
    }
)

const maritalStatusSlice=createSlice({
    name:'Marital status',
    initialState:{
        id:'',
        name:'',
        description:'',
        maritalstatus:[]
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(createMaritalStatus.fulfilled,(state,action)=>{
                state.maritalstatus=[...state.maritalstatus,action.payload];
            })
            .addCase(updateMaritalStatus.fulfilled,(state,action)=>{
                state.maritalstatus=[...state.maritalstatus,action.payload];
            })
            .addCase(deleteMaritalStatus.fulfilled,(state,action)=>{
                state.maritalstatus=[...state.maritalstatus,action.payload];
            })
            .addCase(deleteBunch.fulfilled,(state,action)=>{
                state.maritalstatus=[...state.maritalstatus,action.payload];
            })
    }
})
export default maritalStatusSlice.reducer;