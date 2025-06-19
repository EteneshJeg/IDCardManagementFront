
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const createProfile=createAsyncThunk(
    'create/profile',
    async(FormData,{rejectWithValue})=>{
        try{
            let profileId;
            let storedProfiles=JSON.parse(localStorage.getItem('profile'))||[];
            if(!Array.isArray(storedProfiles)){
                storedProfiles=[]
            }
            console.log(storedProfiles);
            if (storedProfiles.length === 0) {
                let lastProfileId=0;
                profileId=lastProfileId+1;
            } else {
                const lastProfile = storedProfiles.pop();
                if (lastProfile && lastProfile.id) {
                    let lastProfileId = lastProfile.id;
                     lastProfileId=parseInt(lastProfileId,10);
                      profileId=lastProfileId+1;
                      
                } else {
                    let lastProfileId=0;
                    profileId=lastProfileId+1;
                }
                storedProfiles.push(lastProfile);
            }
            const newProfile={
                id:profileId,
                en_name:FormData?.en_name,
                title:FormData?.title,
                sex:FormData?.sex,
                date_of_birth:FormData?.date_of_birth,
                joined_date:FormData?.joined_date,
                email:FormData?.email,
                photo:FormData?.photo,
                phone_number:FormData?.phone_number,
                organization_unit:FormData?.organization_unit,
                job_position:FormData?.job_position,
                job_title_category:FormData?.job_title_category,
                salary_amount:FormData?.salary_amount,
                marital_status:FormData?.marital_status,
                nation:FormData?.nation,
                employment_id:FormData?.employment_id,
                job_position_start_date:FormData?.job_position_start_date,
                job_position_end_date:FormData?.job_position_end_date,
                address:FormData?.address,
                house_number:FormData?.house_number,
                region:FormData?.region,
                zone:FormData?.zone,
                woreda:FormData?.woreda,
                status:FormData?.status,
                id_issue_date:FormData?.id_issue_date,
                id_expire_date:FormData?.id_expire_date,
                id_status:FormData?.id_status
                
            }
            let checkId=storedProfiles.some(storedProfile=>{
                return String(storedProfile.employment_id).toLowerCase().trim()===String(newProfile.employment_id).toLowerCase().trim()
            })
            if(checkId){
                toast.error('profile is already registered');
                return rejectWithValue('profile is already registered');
            }
            if(!newProfile){
                toast.error('Employee is not saved');
                return rejectWithValue('user is not saved');
            }
            storedProfiles.push(newProfile);
            localStorage.setItem('profile',JSON.stringify(storedProfiles));
            toast.success('save successful');
        }catch(error){
            console.log(error);
            return rejectWithValue(error);
        }
    }
)

export const getProfile=createAsyncThunk(
    'get/profile',
    
    async(_,{rejectWithValue})=>{
        try{
            let storedProfiles=JSON.parse(localStorage.getItem('profile'))||[];
        if(!Array.isArray(storedProfiles)){
            storedProfiles=[];
        }
        if(storedProfiles){
            return storedProfiles;
        }
        else{
            return rejectWithValue('Failed to fetch profile');
        }}catch(error){
            return rejectWithValue(error);
        }
    }
)

export const updateProfile=createAsyncThunk(
    'profile/update',
    async({Id,FormData},{rejectWithValue})=>{
        try{
            let storedProfiles=JSON.parse(localStorage.getItem('profile'))||[];
            if(!Array.isArray(storedProfiles)){
                storedProfiles=[];
            }
            console.log(Id);
            const userIndex=storedProfiles.findIndex(storedProfile=>{
                return String(storedProfile.id).toLowerCase().trim()===String(Id).toLowerCase().trim()
            })
            if(userIndex==-1){
                toast.error('Match not found');
                return;
            }
            const updatedProfile={
               ...storedProfiles[userIndex],
                en_name:FormData?.en_name || storedProfiles[userIndex].en_name,
                title:FormData?.title || storedProfiles[userIndex].title,
                sex:FormData?.sex || storedProfiles[userIndex].sex,
                date_of_birth:FormData?.date_of_birth || storedProfiles[userIndex].date_of_birth,
                joined_date:FormData?.joined_date || storedProfiles[userIndex].joined_date,
                photo:FormData?.photo || storedProfiles[userIndex].photo,
                phone_number:FormData?.phone_number || storedProfiles[userIndex].phone_number,
                organization_unit:FormData?.organization_unit || storedProfiles[userIndex].organization_unit,
                job_position:FormData?.job_position || storedProfiles[userIndex].job_position,
                job_title_category:FormData?.job_title_category || storedProfiles[userIndex].job_title_category,
                salary_amount:FormData?.salary_amount || storedProfiles[userIndex].salary_amount,
                marital_status:FormData?.marital_status || storedProfiles[userIndex].marital_status,
                nation:FormData?.nation || storedProfiles[userIndex].nation,
                employment_id:FormData?.employment_id || storedProfiles[userIndex].employment_id,
                job_position_start_date:FormData?.job_position_start_date || storedProfiles[userIndex].job_position_start_date,
                job_position_end_date:FormData?.job_position_end_date || storedProfiles[userIndex].job_position_end_date,
                address:FormData?.address || storedProfiles[userIndex].address,
                house_number:FormData?.house_number || storedProfiles[userIndex].house_number,
                region:FormData?.region || storedProfiles[userIndex].region,
                zone:FormData?.zone || storedProfiles[userIndex].zone,
                woreda:FormData?.woreda || storedProfiles[userIndex].woreda,
                status:FormData?.status || storedProfiles[userIndex].status,
                id_issue_date:FormData?.id_issue_date || storedProfiles[userIndex].id_issue_date,
                id_expire_date:FormData?.id_expire_date || storedProfiles[userIndex].id_expire_date,
                id_status:FormData?.id_status || storedProfiles[userIndex].status
                
            }
            if(!updatedProfile){
                toast.error('Fields are empty');
                return rejectWithValue('empty field');
            }
           
            storedProfiles[userIndex]=updatedProfile;
            localStorage.setItem('profile',JSON.stringify(storedProfiles));
            toast.success('Update successful');
            return updatedProfile;
        }catch(error){
            return rejectWithValue(error);
        }
    }
)

export const deleteProfile=createAsyncThunk( 
    'delete/profile',
    async({Id},{rejectWithValue})=>{
        try{
            let storedProfiles=JSON.parse(localStorage.getItem('profile'))||[];
            if(!Array.isArray(storedProfiles)){
                storedProfiles=[];
            }
            console.log(Id);
            
            storedProfiles=storedProfiles.filter(storedProfile=>{
               return String(storedProfile.id).toLowerCase().trim()!==String(Id).toLowerCase().trim()
            })
            if(!storedProfiles){
                console.log('delete unsuccessful');
            }
            localStorage.setItem('profile',JSON.stringify(storedProfiles));
            toast.success('Delete Successful');
            return storedProfiles;
        }catch(error){
                return rejectWithValue(error);
        }
    }
)

export const deleteProfileBunch = createAsyncThunk(
    'profile/deletebunch',
    async (selectedUsers, { rejectWithValue }) => {
      try {
        let storedUsers = JSON.parse(localStorage.getItem('profile')) || [];
        console.log(selectedUsers);
        
        
       
        const userIdsToRemove = Object.keys(selectedUsers)
          .filter((key) => selectedUsers[key]); 

          console.log(userIdsToRemove)

          storedUsers = storedUsers.filter((user) => {
            const employmentId = String(user.id); 
            const isSelected = userIdsToRemove.includes(employmentId); 
            console.log(`Checking user: ${employmentId}, selected: ${isSelected}`); 
            return !isSelected; 
          });
  
        
        localStorage.setItem('profile', JSON.stringify(storedUsers));
  
        toast.success('Delete successful');
        return storedUsers;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const getUserProfile = createAsyncThunk(
    'userprofile/get',
    async ({ Email }, { rejectWithValue }) => {
      try {
        let storedProfiles = JSON.parse(localStorage.getItem('profile')) || [];
  
        if (!Array.isArray(storedProfiles)) {
          storedProfiles = [storedProfiles];
        }
        console.log(JSON.parse(localStorage.getItem('profile')));

        const matchedProfile = storedProfiles.find(profile =>{
            console.log(profile.email)
            console.log(Email)
            return(
                String(profile.email).toLowerCase().trim() === String(Email).toLowerCase().trim()
            )
        }
          
        );
        
  
        if (!matchedProfile) {
          
          return rejectWithValue('No profile matched the email.');
        }
        console.log(matchedProfile)
        return matchedProfile; 
      } catch (error) {
        return rejectWithValue(error.message || 'Failed to fetch profile');
      }
    }
  );
  

  
  

const profileSlice=createSlice({
    name:'Profile',
    initialState:{
        profiles: [],
        name:'',
        id:'',
        position:'',
        department:'',
        birthdate:'',
        hiredate:'',
        status:'',
        phone:'',
        address:'',
        gender:'',
        image:'',
        expiredate:'',
        issuedate:''
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(createProfile.fulfilled,(state,action)=>{
                state.profiles=[...state.profiles,action.payload]
            })
            .addCase(updateProfile.fulfilled,(state,action)=>{
                state.profiles=[...state.profiles,action.payload]
            })
            .addCase(deleteProfile.fulfilled,(state,action)=>{
                state.profiles=[...state.profiles,action.payload]
            })
            .addCase(deleteProfileBunch.fulfilled,(state,action)=>{
                state.profiles=[...state.profiles,action.payload]
            })
            
    }
    
})
export default profileSlice.reducer;
