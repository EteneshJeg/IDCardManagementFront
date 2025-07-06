
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const formatDate = (input) => {
  if (!input) return null;
  const date = new Date(input);
  if (isNaN(date.getTime())) { // invalid date
    return null;
  }

  return date.toISOString().split("T")[0]; // YYYY-MM-DD
};

const logDateFields = (form) => {
  ['date_of_birth', 'joined_date', 'job_position_start_date', 'job_position_end_date'].forEach(field => {
    const val = form[field];
    if (val && !/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      console.warn(`Invalid date format in field ${field}:`, val);
    }
  });
};

export const createProfile=createAsyncThunk(
    'create/profile',
    async(formData,{rejectWithValue})=>{
        try{
            const token=JSON.parse(localStorage.getItem('token'));

          
const cleanDateInput = (value) => {
  if (!value || value === "0" || value === 0) return null;

  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date.toISOString().split("T")[0]; // returns 'YYYY-MM-DD'
};










const prepareFormData = (formData) => {
  return {
    en_name: formData.en_name || "",
    title: formData.title || "",
    sex: formData.sex || "",
    date_of_birth: cleanDateInput(formData.date_of_birth)||null,
    joined_date: cleanDateInput(formData.joined_date)||null,
    email: formData.email || "",
    photo: formData.photo || "",
    phone_number: formData.phone_number || "",
    organization_unit_id: formData.organization_unit_id || "",
    job_position_id: formData.job_position_id || "",
    job_title_category_id: formData.job_title_category_id || "",
    salary_id: formData.salary_id || "",
    martial_status_id: formData.martial_status_id || "",
    nation: formData.nation || "",
    employment_id: formData.employment_id || "",
    job_position_start_date: cleanDateInput(formData.job_position_start_date)||null,
    job_position_end_date: cleanDateInput(formData.job_position_end_date)||null,
    address: formData.address || "",
    house_number: formData.house_number || "",
    region_id: formData.region_id || "",
    woreda_id: formData.woreda_id || "",
    zone_id: formData.zone_id || "",
    id_status:false,
    status:true
  };
};
            const form=prepareFormData(formData);
            console.log(form);
            const formdata=new FormData();
            for (let key in form) {
  if (form[key] !== null && form[key] !== undefined) {
    formdata.append(key, form[key]);
  }
}

            console.log('try');
            await axios.post('http://localhost:8000/api/employees',formdata,{
                headers:{
                    Authorization:`Bearer ${token}`,
                }
                
            })
            .then(response=>{
                toast.success('save successful');
                console.log("Success",response);
            })
            .catch(error=>{
                toast.error('Employee is not saved');
                console.log("Error",error.response);
            })


            /*let profileId;
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
            toast.success('save successful');*/
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
            let token=JSON.parse(localStorage.getItem('token'));
            let response=await axios.get('http://localhost:8000/api/employees',{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            let data=response.data;
            console.log(data);
            if(data){
                if(Array.isArray(data)){
                    return data;
                }
                else if(data===null){
                    return [];
                }
                else{
                    return [data];
                }
            }
            else{
                console.log('Employees not found');
                toast.error('Employees not found');
            }
            /*let storedProfiles=JSON.parse(localStorage.getItem('profile'))||[];
        if(!Array.isArray(storedProfiles)){
            storedProfiles=[];
        }
        if(storedProfiles){
            return storedProfiles;
        }
        else{
            return rejectWithValue('Failed to fetch profile');
        }*/}catch(error){
            return rejectWithValue( error.response?.data?.message || 'Failed to fetch profile');
        }
    }
)

export const updateProfile=createAsyncThunk(
    'profile/update',
    async({Id,rawForm},{rejectWithValue})=>{
        try{
            let token=JSON.parse(localStorage.getItem('token')); 
            const cleanDateInput = (value) => {
  if (!value || value.trim() === '?' || value.trim().includes('?') || value.trim() === '0') {
    return null;
  }

  const parsed = new Date(value);
  if (isNaN(parsed.getTime())) {
    console.warn("Invalid date parsed:", value);
    return null;
  }

  // Return full ISO datetime string (MySQL-compatible)
  return parsed.toISOString().slice(0, 19).replace('T', ' '); // "YYYY-MM-DD HH:MM:SS"
};

console.log("Raw joined_date:", rawForm.joined_date);
console.log("Cleaned:", cleanDateInput(rawForm.joined_date));

            const prepareFormData = (rawForm) => {
  return {
    en_name: formData.en_name || "",
    title: formData.title || "",
    sex: formData.sex || "",
    date_of_birth: cleanDateInput(formData.date_of_birth)||null,
    joined_date: cleanDateInput(formData.joined_date)||null,
    email: formData.email || "",
    photo: formData.photo || "",
    phone_number: formData.phone_number || "",
    organization_unit_id: formData.organization_unit_id || "",
    job_position_id: formData.job_position_id || "",
    job_title_category_id: formData.job_title_category_id || "",
    salary_id: formData.salary_id || "",
    martial_status_id: formData.martial_status_id || "",
    nation: formData.nation || "",
    employment_id: formData.employment_id || "",
    job_position_start_date: cleanDateInput(formData.job_position_start_date)||null,
    job_position_end_date: cleanDateInput(formData.job_position_end_date)||null,
    address: formData.address || "",
    house_number: formData.house_number || "",
    region_id: formData.region_id || "",
    woreda_id: formData.woreda_id || "",
    zone_id: formData.zone_id || "",
    id_status:false,
    status:true
  };
};
            const form=prepareFormData(rawForm);

            let formData = new FormData();
formData.append('_method', 'PUT');

for (const key in form) {
  if (Object.hasOwnProperty.call(form, key)) {
    const value = form[key];

    // ✅ Skip null or undefined values
    if (value === null || value === undefined || value === '') continue;

    if (value instanceof File) {
      formData.append(key, value, value.name);
    } else if (typeof value === 'boolean') {
      formData.append(key, value ? '1' : '0');
    } else {
      formData.append(key, value);
    }
  }
}

            let response=await axios.post(`http://localhost:8000/api/employees/${Id}`,formData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }).catch(error=>{console.log(error.response)});
            
            let data=response.data;
            console.log(response);
            console.log(response.data);
            if(data){
                toast.success('Update successful');
                if(Array.isArray(data)){
                    return data;
                }
                else{
                    return [data];
                }
            }
            else{
                 toast.error('Update Failed');
            }
            /*let storedProfiles=JSON.parse(localStorage.getItem('profile'))||[];
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
            return updatedProfile;*/
        }catch(error){
            return rejectWithValue(error.message);
        }
    }
)

export const deleteProfile=createAsyncThunk( 
    'delete/profile',
    async({Id},{rejectWithValue})=>{
        try{
            let token=JSON.parse(localStorage.getItem('token'));
            await axios.delete(`http://localhost:8000/api/employees/${Id}`,{
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
            /*let storedProfiles=JSON.parse(localStorage.getItem('profile'))||[];
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
            return storedProfiles;*/
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
    async ({ Id }, { rejectWithValue }) => {
      try {
        let token=JSON.parse(localStorage.getItem('token'));
        await axios.get(`http://localhost:8000/api/employees/${Id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        }).then(response=>{
            console.log(response.data);
            return response.data;
        }).catch(error=>{
            console.log(error.data);
        })

        /*let storedProfiles = JSON.parse(localStorage.getItem('profile')) || [];
  
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
        return matchedProfile;*/ 
      } catch (error) {
        return rejectWithValue(error.message || 'Failed to fetch profile');
      }
    }
  );
  

  
  

const profileSlice=createSlice({
    name:'Profile',
    initialState:{
    profiles:[],
    en_name:"",
    title: "",
    sex:"",
    date_of_birth: "",
    joined_date: "",
    email: "",
    photo: "",
    phone_number: "",
    organization_unit_id: "",
    job_position_id: "",
    job_title_category_id: "",
    salary_id: "",
    martial_status_id: "",
    nation:  "",
    employment_id: "",
    job_position_start_date: "",
    job_position_end_date: "",
    address:  "",
    house_number: "",
    region_id: "",
    woreda_id: "",
    zone_id: "",
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(createProfile.fulfilled, (state, action) => {
        const newProfile = Array.isArray(action.payload) ? action.payload[0] : action.payload;
        state.profiles.push(newProfile);
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        const updated = Array.isArray(action.payload) ? action.payload[0] : action.payload;
        const index = state.profiles.findIndex(profile => profile.id === updated.id);
        if (index !== -1) {
          state.profiles[index] = updated;
        }
      })

      .addCase(deleteProfile.fulfilled, (state, action) => {
        const deletedId = action.meta.arg.Id;
        state.profiles = state.profiles.filter(profile => profile.id !== deletedId);
      })

      .addCase(deleteProfileBunch.fulfilled, (state, action) => {
        const deletedIds = action.payload; // assume this is an array of deleted IDs
        state.profiles = state.profiles.filter(profile => !deletedIds.includes(profile.id));
      })

      .addCase(getProfile.fulfilled, (state, action) => {
        state.profiles = action.payload;
      });
            
    }
    
})
export default profileSlice.reducer;
