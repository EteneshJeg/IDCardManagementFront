import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";

export const createSalary=createAsyncThunk(
    'salary/create',
    async({FormData},{rejectWithValue})=>{
        try{
            let salaryId;
            let storedSalaries = JSON.parse(localStorage.getItem('salary')) || [];
            console.log(storedSalaries);
            
            if (!Array.isArray(storedSalaries)) {
                storedSalaries = [storedSalaries];
            }

            if (storedSalaries.length === 0) {
                let lastSalaryId=0;
                salaryId=lastSalaryId+1;
            } else {
                const lastSalary = storedSalaries.pop();
                if (lastSalary && lastSalary.id) {
                    let lastSalaryId = lastSalary.id;
                     lastSalaryId=parseInt(lastSalaryId,10);
                      salaryId=lastSalaryId+1;
                      
                } else {
                    let lastSalaryId=0;
                    salaryId=lastSalaryId+1;
                }
                storedSalaries.push(lastSalary);
            }

            const isSalaryRegistered=storedSalaries.some(storedSalary=>storedSalary.amount===FormData.amount)

            if(isSalaryRegistered){
                alert('Salary is already registered');
                return;
            }

            let newSalary={
                id:salaryId,
                amount:FormData.amount,
                status:FormData.status
            }
            if(!newSalary){
                return rejectWithValue('Salary was not recorded');
            }
            storedSalaries.push(newSalary);
            localStorage.setItem('salary',JSON.stringify(storedSalaries));
            alert('Salary has been successfully added');
            return newSalary;
        }catch(error){
            return rejectWithValue(error.message);
        }
    }
)

export const getSalary=createAsyncThunk(
    'salary/get',
    async(_,{rejectWithValue})=>{
        try{
            
            let storedSalaries = JSON.parse(localStorage.getItem('salary')) || [];
            console.log(storedSalaries);
            
            if (!Array.isArray(storedSalaries)) {
                storedSalaries = [storedSalaries];
            }

            if(storedSalaries){
                return storedSalaries;
            }
        }catch(error){
            return rejectWithValue(error.message);
        }
    }
)

export const updateSalary=createAsyncThunk(
    'salary/update',
    async({Id,FormData},{rejectWithValue})=>{
        try{
            console.log(Id);
            let storedSalaries = JSON.parse(localStorage.getItem('salary')) || [];
            console.log(storedSalaries);
            
            if (!Array.isArray(storedSalaries)) {
                storedSalaries = [storedSalaries];
            }

             const salaryIndex = storedSalaries.findIndex(storedSalary => {
                return String(storedSalary.id).trim() === String(Id).trim();  
            });
            console.log(salaryIndex)
            if (salaryIndex === -1) {
                return rejectWithValue('Salary not found');
            }


            const updatedSalary={
                ...storedSalaries[salaryIndex],
                amount:FormData.amount,
                status:FormData.status
            }
            console.log(updatedSalary)

            if(!updatedSalary){
                return rejectWithValue('Salary not updated');
            }

            storedSalaries[salaryIndex]=updatedSalary;
            localStorage.setItem('salary',JSON.stringify(storedSalaries));
            alert('Salary has successfully been updated');
            return updatedSalary;

        }catch(error){
            return rejectWithValue(error.message);
        }
    }
)

export const deleteSalary=createAsyncThunk(
    'salary/delete',
    async({Id},{rejectWithValue})=>{
        try{
            let storedSalaries = JSON.parse(localStorage.getItem('salary')) || [];
            
            if (!Array.isArray(storedSalaries)) {
                storedSalaries = [storedSalaries];
            }
            storedSalaries = storedSalaries.filter(storedSalary => {
                return String(storedSalary.id).trim() !== String(Id).trim();
              });
            if(!storedSalaries){
                return rejectWithValue('Salary not deleted');
            }
            localStorage.setItem('salary',JSON.stringify(storedSalaries));
            alert('Salary has successfully been deleted');
            return storedSalaries;
        }catch(error){
            return rejectWithValue(error.message);
        }
    }
)

export const deleteBunch=createAsyncThunk(
    'salary/deletebunch',
    async({Id},{rejectWithValue})=>{
        try{
            let storedSalaries = JSON.parse(localStorage.getItem('salary')) || [];
            console.log(Id);
            
            if (!Array.isArray(storedSalaries)) {
                storedSalaries = [storedSalaries];
            }

            const salaryCodesToRemove = Object.keys(Id).filter(id => Id[id]); 
            console.log(salaryCodesToRemove)

            storedSalaries = storedSalaries.filter(
             storedSalary => !salaryCodesToRemove.includes(String(storedSalary.id))
            );
            console.log(storedSalaries)

            if(!storedSalaries){
                return rejectWithValue('Salaries are not deleted');
            }
            localStorage.setItem('salary',JSON.stringify(storedSalaries));
            alert('Salaries have been successfully deleted');
            return storedSalaries;

        }catch(error){
            return rejectWithValue(error.message);
        }
    }
)

const salarySlice=createSlice({
    name:'Salary',
    initialState:{
        id:'',
        amount:'',
        status:'',
        salaries:[]
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(createSalary.fulfilled,(state,action)=>{
                state.salaries=[...state.salaries,action.payload];
            })
            .addCase(updateSalary.fulfilled,(state,action)=>{
                state.salaries=[...state.salaries,action.payload];
            })
            .addCase(deleteSalary.fulfilled,(state,action)=>{
                state.salaries=[...state.salaries,action.payload];
            })
            .addCase(deleteBunch.fulfilled,(state,action)=>{
                state.salaries=[...state.salaries,action.payload];
            })
    }
})
export default salarySlice.reducer;