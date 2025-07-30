import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import i18next from "i18next";


export const createOrganizationInfo = createAsyncThunk(
    'organization/create',
    async ({ rawData }, { rejectWithValue }) => {
      try {
        let token=JSON.parse(localStorage.getItem('token'));
        console.log(rawData);
        
        


       

        let response=await axios.get('http://localhost:8000/api/organizations',{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });

        console.log(response);
        let data=response.data;
        console.log(data);
        console.log(data.message)
        const id=data?.data?.[0].id
       // console.log(data.data[0]);
        
        if(data.message==='No record available'){
            try{
              const formData = new FormData();
for (const key in rawData) {
  if (rawData[key] !== null && rawData[key] !== undefined) {
    formData.append(key, rawData[key]);
  }
}
const value = formData.get("email");
console.log(value);
              console.log(' empty');
              await axios.post('http://localhost:8000/api/organizations',formData,{
                headers:{
                  Authorization:`Bearer ${token}`
                }
              }).then(response=>{
                toast.success(i18next.t('organizationcreated'));
                console.log(response);
              }).catch(error=>{
                toast.error(i18next.t('failedtocreateorganization'));
                console.log(error.response)
              })
            }catch(error){
              return rejectWithValue(error.message);
            }
        }
        else{
          try{
const formData = new FormData();
formData.append('_method', 'PUT'); // method spoofing if needed

for (const key in rawData) {
  if (rawData[key] !== null && rawData[key] !== undefined) {
    formData.append(key, rawData[key]);
  }
}
            console.log('not empty')
            const value = formData.get("email");
            console.log(value);
              try{
                  const response=await axios.post(`http://localhost:8000/api/organizations/${id}`,formData,{
                headers:{
                  Authorization:`Bearer ${token}`,
                 
                }
              });
              console.log(response);
              toast.success(i18next.t('organizationupdated'));
              }catch(error){
                console.log('Caught error:', error);
  console.log('Full error object:', error?.response?.data || error.message);
  toast.error(i18next.t('failedtoupdateorganization'));
              }
            }catch(error){
              return rejectWithValue(error.message);
            }
        }
        
        
  
        
        
      } catch (error) {
        toast.error(i18next.t('failedtosaveorganizationinformation'));
        return rejectWithValue(error);
      }
    }
  );
  

export const getOrganizationInfo=createAsyncThunk(
    'organization/get',
    async(_,{rejectWithValue})=>{
      try{
        let token=JSON.parse(localStorage.getItem('token'));
         let response=await axios.get('http://localhost:8000/api/organizations',{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });

        console.log(response);
        if (response.data.message?.toLowerCase() === 'no record available') {
  toast.info(i18next.t('noinformationavailable'));
  return rejectWithValue('No record found');
}

        let data=response.data;
        console.log(data.data[0]);
        return data.data[0]
        /*let storedOrganizationInfo=JSON.parse(localStorage.getItem('organizationInfo'))||[];
            console.log(storedOrganizationInfo);
            if(!Array.isArray(storedOrganizationInfo)){
                storedOrganizationInfo=[storedOrganizationInfo];
            }
            return storedOrganizationInfo;*/
    
      }catch(error){
        toast.error(t('fetchunsuccessful'));
        return rejectWithValue(error.message);
      }
    }
)

/*export const deleteOrganizationInfo=createAsyncThunk(
  'organization/delete',
  async(_,{rejectWithValue})=>{
    try{
      let token=JSON.parse(localStorage.getItem('token'));
            await axios.delete(`http://localhost:8000/api/organizations/1`,{
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
    }catch(error){
      return rejectWithValue(error.message);
    }
  }
)*/


const organizationSlice=createSlice({
    name:'Organization',
    initialState:{
        en_name:'',
        motto:'',
        mission:'',
        vision:'',
        core_value:'',
        logo:'',
        address:'',
        website:'',
        email:'',
        phone_number:'',
        fax_number:'',
        po_box:'',
        tin_number:'',
        abbreviation:'',
        organizationInfo:''
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(createOrganizationInfo.fulfilled,(state,action)=>{
                state.organizationInfo=state.organizationInfo,action.payload
            })
    }
    
    
})
export default organizationSlice.reducer;