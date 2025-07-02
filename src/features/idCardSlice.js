import { createSlice,createAsyncThunk } from "@reduxjs/toolkit"
import { toast } from "react-toastify";

export const getProfile = createAsyncThunk(
    'profile/get',
    async ({ Id }, { rejectWithValue }) => {
      try {
        
        
        let storedProfiles = JSON.parse(localStorage.getItem('profile')) || [];
  
        if (!Array.isArray(storedProfiles)) {
          storedProfiles = [];
        }
        
        let profile = storedProfiles.find((storedProfile) => {
           
          const employmentId = storedProfile.employment_id;
  
        
          if (Array.isArray(employmentId)) {
            return employmentId.map(String).includes(String(Id).trim());
          }
  
          return String(employmentId).toLowerCase().trim() === String(Id).toLowerCase().trim();
        });
  
        console.log('Found profile:', profile);
        console.log(profile)
        return profile ?? {}; 
      } catch (error) {
        console.log(error);
        return rejectWithValue(error.message || 'Failed to get profile');
      }
    }
  );
  

export const generateId=createAsyncThunk(
    'id/create',
    async({Id,UserInfo,FormData},{rejectWithValue})=>{
        try{
            console.log('trying')
            let storedProfiles=JSON.parse(localStorage.getItem('profile'))||[];
            if(!Array.isArray(storedProfiles)){
                storedProfiles=[]
            }
            const userIndex=storedProfiles.findIndex((storedProfile)=>{
                return String(storedProfile.employment_id).toLowerCase().trim()===String(Id).toLowerCase().trim()
            })
            console.log(userIndex)
            const validateDate=FormData?.id_issue_date < FormData?. id_expire_date;
            if(!validateDate){
              toast.error('The issue date needs to be before the expire date');
              return;
            }
            const date=new Date().toISOString().split('T')[0];
            const updatedProfile={
                ...storedProfiles[userIndex],
                id_expire_date:FormData?.id_expire_date,
                id_issue_date:FormData?.id_issue_date,
                id_status : FormData?.id_expire_date < date ? 'Expired' : 'Active'
            }
            console.log(updatedProfile);
            const newId={
                en_name:UserInfo?.en_name,
                job_position:UserInfo?.job_position,
                id_expire_date:FormData?.id_expire_date,
                id_issue_date:FormData?.id_issue_date,
                phone_number:UserInfo?.phone_number,
                address:UserInfo?.address,
            }
            console.log(updatedProfile)
            storedProfiles[userIndex]=(updatedProfile);
            console.log(storedProfiles[userIndex])
            console.log(updatedProfile)
            localStorage.setItem('profile',JSON.stringify(storedProfiles))
            const storedIds=JSON.parse(localStorage.getItem('idcard'));
            storedIds.push(newId);
            localStorage.setItem('idcard',JSON.stringify(storedIds));
            console.log(newId);
            console.log(storedProfiles)
            console.log('saved');
            toast.success('Id generated');
            return newId
        }catch(error){
            toast.error('Failed to generate Id');
            return rejectWithValue(error.message)
        }
    }
)

export const generateIdBunch = createAsyncThunk(
  'id/bunchIssue',
  async ({ selectedUsers, FormData }, { rejectWithValue }) => {
    try {
      console.log(selectedUsers);
      console.log(FormData)

      const issueDate = FormData.get('id_issue_date');  
      const expireDate = FormData.get('id_expire_date');  

      
      if (!issueDate || !expireDate) {
        return rejectWithValue('Issue and Expiry dates are required');
      }

      
      const updatedUsers = selectedUsers.map(user => ({
        ...user,
        id_issue_date: issueDate,
        id_expire_date: expireDate,
      }));

      

      
      const storedIds = JSON.parse(localStorage.getItem('idcard')) || [];  

      
      storedIds.push(...updatedUsers);  

      
      localStorage.setItem('idcard', JSON.stringify(storedIds));
      toast.success('generation successful')
      
      return updatedUsers;

    } catch (error) {
      toast.error('Generation Failed');
      return rejectWithValue(error.message || 'An error occurred while updating the IDs');
    }
  }
);

export const saveIdDetails=createAsyncThunk(
  'iddetails/save',
  async({DetailData},{rejectWithValue})=>{
    try{

    }catch(error){
      
    }
  }
)

export const saveTemplate=createAsyncThunk(
    'template/save',
    async({TemplateData,Enabled},{rejectWithValue})=>{
        try{
          
            console.log('trying');
            localStorage.setItem('templates',JSON.stringify(TemplateData));
            localStorage.setItem('enabledFields',JSON.stringify(Enabled));
            console.log('template saved');
            console.log(TemplateData)
            console.log(Enabled);
            toast.success('new template saved');
            return TemplateData
        }catch(error){
          toast.error('Failed to save template');
            console.log(error);
            return rejectWithValue(error.message)
        }
    }
)

export const getTemplate = createAsyncThunk(
  'template/get',
  async (_, { rejectWithValue }) => {
    try {
      let storedTemplates = localStorage.getItem('templates');

      if (!storedTemplates || storedTemplates.length === 0) {
        return {}; // return empty object if none
      }

      const templates = JSON.parse(storedTemplates);

      if (typeof templates !== 'object' || Array.isArray(templates)) {
        return rejectWithValue('Invalid template format in localStorage');
      }

      return templates;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load templates');
    }
  }
);




const idSlice=createSlice({
    name:'idSlice',
    initialState:{
        idCards:[],
        id_issue_date:'',
        id_expire_date:'',
        templates:[],
        details:[]
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(generateId.fulfilled,(state,action)=>{
                state.idCards=[...state.idCards,action.payload]
            })
            .addCase(saveTemplate.fulfilled,(state,action)=>{
                state.templates=[...state.templates,action.payload]
            })
    }
    
}
)
export default idSlice.reducer