import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const signin=createAsyncThunk(
    'user/signin',
    async(FormData,{rejectWithValue})=>{
        
        try{
            
            let userData = JSON.parse(localStorage.getItem('userdata'));
            console.log(userData)
            if(!Array.isArray(userData)){
                userData=[userData]
            }
            

            if (!userData) {
                return rejectWithValue('No user found in localStorage');
            }
            console.log(userData)
            if(!Array.isArray(userData)){
                if(String(FormData.email).trim()===String(userData.email).trim()){
                    if(String(FormData.password).trim()===String(userData.password).trim()){
                        toast.success('Login successful');
                        
                        console.log(userData.role)
                    return { role: userData.role, email:userData.email,message: 'Login successful' };
                    }
                }
            }

            else{
                const userFound=userData.find(user=>String(user.email).trim()===FormData.email);
                if(userFound){
                    if(String(userFound.password).trim()===FormData.password){
                        toast.success('Login successful');
                        console.log(userFound)
                        return { role: userFound.role, email:userFound.email,message: 'Login successful' };
                    }
                    else{
                        toast.error('Incorrect password');
                        return rejectWithValue('password mismatch');
                    }
                }   
                else{
                    toast.error('Email not found');
                    return rejectWithValue('email not found');
                }
            }
            
        }catch(error){
                return rejectWithValue(error.message);
        }
    }
);

export const getUser=createAsyncThunk(
    'user/get',
    async(_,{rejectWithValue})=>{
        try{
            const userData = JSON.parse(localStorage.getItem('userdata'));

            if (!userData) {
                return rejectWithValue('No user found in localStorage');
            }
            else{
               
                return userData;
            }
        }catch(error){
                return rejectWithValue(error.message);
        }
    }
)

export const addUser = createAsyncThunk(
    'user/add',
    

    async ({FormData,Date}, {  rejectWithValue }) => {
        let userId;
        
        try {
            let storedUsers;
            try {
                storedUsers = JSON.parse(localStorage.getItem('userdata')) || [];
            } catch (e) {
                storedUsers = [];
            }
            
            if (!Array.isArray(storedUsers)) {
                storedUsers = []; 
            }
            console.log(storedUsers);
            if (storedUsers.length === 0) {
                let lastUserId=0;
                userId=lastUserId+1;
            } else {
                const lastUser = storedUsers.pop();
                if (lastUser && lastUser.id) {
                    let lastUserId = lastUser.id;
                     lastUserId=parseInt(lastUserId,10);
                      userId=lastUserId+1;
                      
                } else {
                    let lastUserId=0;
                    userId=lastUserId+1;
                }
                storedUsers.push(lastUser);
            }
            const isUserRegistered=storedUsers.some(storedUser=>storedUser.email===FormData.email)

            if(isUserRegistered){
                toast.error('Email is already taken');
                return;
            }
            console.log(Date)
            const user = {
                id: userId || "",
                name: FormData?.name || "",
                email: FormData?.email || "",
                password: FormData?.password || "",
                role:FormData?.role || "",
                first_time:Date,
                active:FormData?.active || "",
                image: FormData?.image || "",
            };            
            console.log(user)
            storedUsers.push(user); 
            localStorage.setItem('userdata', JSON.stringify(storedUsers)); 
            toast.success('User successfully added:', user);
            return user;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateUser = createAsyncThunk(
    'user/update',
    async ({ Id, FormData }, { rejectWithValue }) => {
        let storedUsers = JSON.parse(localStorage.getItem('userdata')) || [];
        if (!Array.isArray(storedUsers)) {
            storedUsers = []; 
        }
        try {
            const userIndex = storedUsers.findIndex(storedUser => {
                return String(storedUser.id).trim() === String(Id).trim();  
            });
            if (userIndex === -1) {
                return rejectWithValue('User not found');
            }
            const updatedUser = {
                ...storedUsers[userIndex], 
                name: FormData?.name || storedUsers[userIndex].name,
                email: FormData?.email || storedUsers[userIndex].email,
                password: FormData?.password || storedUsers[userIndex].password,
                role:FormData?.role || "",
                image: FormData?.image || storedUsers[userIndex].image,
            };
            
            storedUsers[userIndex] = updatedUser;
            localStorage.setItem('userdata', JSON.stringify(storedUsers));
            toast.success('Update successful');

            return updatedUser;
        } catch (error) {
            return rejectWithValue(error.message || 'Update failed');
        }
    }
);
  

export const deleteUser = createAsyncThunk(
    'user/delete',
    async (Id, { rejectWithValue }) => {
        try {
            let storedUsers = JSON.parse(localStorage.getItem('userdata')) || [];
            storedUsers = storedUsers.filter(storedUser => { 
                return storedUser.id !== Id.id; 
            });

            localStorage.setItem('userdata', JSON.stringify(storedUsers));
            toast.success('Delete successful');
            return storedUsers; 
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteBunch=createAsyncThunk(
    'user/deletebunch',
    async(id,{rejectWithValue})=>{
        try{
            let storedUsers = JSON.parse(localStorage.getItem('userdata')) || [];
            let userIdToRemove = Object.keys(id).map(Number);
            storedUsers=storedUsers.filter(storedUser=>{
                
                return !userIdToRemove.includes(storedUser.id)
            }
 )
            localStorage.setItem('userdata', JSON.stringify(storedUsers));
            toast.success('Delete successful');
            return storedUsers
        }catch(error){
            return rejectWithValue(error);
        }
    }
)

export const getEmployee=createAsyncThunk(
    'user/employee',
    async(_,{rejectWithValue})=>{
        try{
            const storedUsers=JSON.parse(localStorage.getItem('userdata'));
            const employee=storedUsers.filter(storedUser=>String(storedUser.role).toLowerCase()==='employee');
            console.log('Emp',employee);
            if(!employee){
                console.log('error fetching employees');
                return rejectWithValue('error fetching employees');
            }
            return employee;
        }catch(error){
                console.log(error);
                return rejectWithValue(error);
        }
    }
)


const userSlice=createSlice({
    name:'User',
    initialState:{
        username:'',
        email:'',
        password:'',
        name:'',
        role:'',
        id:1,
        status:'',
        users:[],
        logged:false
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(signin.fulfilled,(state,action)=>{
            state.logged=true;
            state.role = action.payload.role;
            state.email = action.payload.email;
        })
        .addCase(signin.rejected,(state)=>{
            state.logged=false;
        })
        .addCase(addUser.fulfilled,(state,action)=>{
            state.users=[...state.users,action.payload]
            
        })
        .addCase(updateUser.fulfilled,(state,action)=>{
            state.users=[...state.users,action.payload]
            
        })
        .addCase(deleteUser.fulfilled,(state,action)=>{
            state.users=[...state.users,action.payload];
        })
        .addCase(deleteBunch.fulfilled,(state,action)=>{
            state.users=[...state.users,action.payload];
        })
    }
})

export default userSlice.reducer;