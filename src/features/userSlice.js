import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from 'axios';
import { useTranslation } from "react-i18next";
import i18next from "i18next";



export const signin=createAsyncThunk(
    'user/signin',
    async(FormData,{rejectWithValue})=>{
        
        try{
            const loginResponse=await axios.post('http://localhost:8000/api/login',FormData)
            .catch(error=>console.log("Error",error.data));

            localStorage.setItem('token',JSON.stringify(loginResponse.data.token));
                console.log(loginResponse.data.token);
            localStorage.setItem('userId',JSON.stringify(loginResponse.data.user.id));
            
                 

            
                console.log("Success",loginResponse.data)
            let token=JSON.parse(localStorage.getItem('token'));
           

            let userlist=await axios.get('http://localhost:8000/api/users',{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            console.log(userlist);
            let data=userlist.data
            console.log(data);
            const match=data.filter(key=>{
                return key.email===FormData.email?key.id:null
            })
            console.log(match);
            const form={
                id:match[0].id,
                name:match[0].name,
                profile_image:match[0].profile_image,
                active:match[0].active, //accessible or not
                first_time:false

            }
            const id=match[0].id;
            console.log(id)
            if(match[0].first_time){
                await axios.put(`http://localhost:8000/api/users/${id}`,form,{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }).then(response=>{
                console.log(response.data);
                
                return match;
            }).catch(error=>{
                console.log(error);
                console.log(error.response);
                
                
            })
            }
            else{
                console.log('not first time');
            }
            return loginResponse.data
           
            
        }catch(error){
                return rejectWithValue(error.message);
        }
    }
);

export const signout=createAsyncThunk(
    'user/signout',
    async(_,{rejectWithValue})=>{
        try{
            const token=JSON.parse(localStorage.getItem('token'));
             await axios.post('http://127.0.0.1:8000/api/logout',FormData,{
               headers: {
                    Authorization: `Bearer ${token}`
                    }
             }).then(response=>{
                localStorage.setItem('token',JSON.stringify(response.data.token));
                console.log(response.data.token);
                console.log("Success",response.data)})
            .catch(error=>console.log("Error",error.response.data));
        }catch(error){
            return rejectWithValue(error.message);
        }
    }
)

export const getUser=createAsyncThunk(
    'user/get',
    async(_,{rejectWithValue})=>{
        try{
            let token=JSON.parse(localStorage.getItem('token'));
            console.log(localStorage.getItem('token')); 
            let response=await axios.get('http://localhost:8000/api/users',{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            console.log(response)
            let data=response.data;
            console.log(data);
            let returneddata=Array.isArray(data)?data:[data];
            console.log(returneddata)
            return returneddata;

        }catch(error){
                return rejectWithValue(error.message);
        }
    }
)

export const addUser = createAsyncThunk(
    'user/add',
    

    async ({rawForm,Date}, {  rejectWithValue }) => {
      

        
        try {
             
             console.log(rawForm);
            let token=JSON.parse(localStorage.getItem('token'));
            let form={
                name:rawForm.name,
                email:rawForm.email,
                password:rawForm.password,
                profile_image:rawForm.profile_image,
                active:1, //accessible or not
                first_time:0 ,//change on login
                role:Array.isArray(rawForm.role)?rawForm.role:[rawForm.role]
            }
            console.log(form);
            let formdata=new FormData();
            for (let key in form) {
                if(key!=='role' && key!=='profile_image'){
  formdata.append(key, form[key]);
                }
}

if (Array.isArray(form.role)) {
  form.role.forEach(role => {
    formdata.append('roles[]', role);
  });
}
// Append image separately
if (rawForm.profile_image instanceof File) {
  formdata.append('profile_image', rawForm.profile_image);
} else {
  console.log("Invalid or missing profile image file");
}

// Optional: Log all keys (for debugging)
for (let pair of formdata.entries()) {
  console.log(pair[0] + ':', pair[1]);
}

            await axios.post('http://localhost:8000/api/users',formdata,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }).then(response=>{
                console.log(response.data);
                toast.success(i18next.t('usersavedsuccessfully'));
                return;
            }).catch(error=>{
                console.log(error);
                console.log(error.response);
                toast.error(i18next.t('failedtosaveuser'));
                return;
            })
            
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateUser = createAsyncThunk(
    'user/update',
    
    async ({ Id, rawForm }, { rejectWithValue }) => {
        
       console.log(rawForm);
      

        try {
           
            let form={
                name:rawForm.name,
                email:rawForm.email,
                password:rawForm.password,
                profile_image:rawForm.profile_image,
                active:true,
                first_time:true
            }
            console.log(form);
            let formData = new FormData();
formData.append('_method', 'PUT');

for (const key in form) {
  if (Object.hasOwnProperty.call(form, key)) {
    const value = form[key];
    if (value instanceof File) {
      formData.append(key, value, value.name); 
    }else if (typeof value === 'boolean') {
      formData.append(key, value ? '1' : '0'); // Convert boolean to string '1' or '0'
    } else {
      formData.append(key, value);
    }
  }
}
            let token=JSON.parse(localStorage.getItem('token'));
            try{
                const response=await axios.post(`http://localhost:8000/api/users/${Id}`,formData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            console.log(response.data);
            toast.success(i18next.t('userupdated'));
            return;
            }catch(error){
                console.log(error.response);
                toast.error(i18next.t('failedtoupdateuser'));
                return;
            }
           
        } catch (error) {
            return rejectWithValue(error.message || 'Update failed');
        }
    }
);
  

export const deleteUser = createAsyncThunk(
    'user/delete',
    async (Id, { rejectWithValue }) => {
        

        try {
            
            console.log(Id);
            let id=(Id.id);
            console.log(id);
            let token=JSON.parse(localStorage.getItem('token'));
            await axios.delete(`http://localhost:8000/api/users/${id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            .then(response=>{
                toast.success(i18next.t('deletesuccessful'));
                console.log(response);
            })
            .catch(error=>{
                toast.error(i18next.t('deletefailed'));
                console.log(error);
            })
           
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteBunch=createAsyncThunk(
    'user/deletebunch',
    async(id,{rejectWithValue})=>{
        

        try{
            
            let token=JSON.parse(localStorage.getItem('token'));
            const idList=Object.keys(id);
            const ids = idList.map(id => Number(id));
            console.log(ids);
            await axios.post(`http://localhost:8000/api/users/delete-bunch`,{
                "ids":ids
            },{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            .then(response=>{
                toast.success(i18next.t('deletesuccessful'));
                console.log(response);
            })
            .catch(error=>{
                toast.error(i18next.t('deletefailed'));
                console.log(error);
            })
            
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
        role:[],
        id:1,
        status:'',
        users:[],
        employee_id:'',
        logged:false,
        user:''
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(signin.fulfilled,(state,action)=>{
            console.log(action.payload);
            state.logged=true;
            state.role = action.payload.role;
            state.email = action.payload.email;
            state.employee_id=action.payload.employee_id;
            state.user=action.payload.user;
        })
        .addCase(signin.rejected,(state)=>{
            state.logged=false;
            console.log(action.payload);
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