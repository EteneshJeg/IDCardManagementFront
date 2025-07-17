import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";


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
                toast.success('Organization created');
                console.log(response);
              }).catch(error=>{
                toast.error('Failed to create organization');
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
              toast.success('Updated');
              }catch(error){
                console.log('Caught error:', error);
  console.log('Full error object:', error?.response?.data || error.message);
  toast.error('Failed to update organization');
              }
            }catch(error){
              return rejectWithValue(error.message);
            }
        }
        
        /*let storedOrganizationInfo = JSON.parse(localStorage.getItem('organizationInfo')) || [];
        console.log(storedOrganizationInfo);
        
        if (!Array.isArray(storedOrganizationInfo)) {
          storedOrganizationInfo = [storedOrganizationInfo];
        }
  
        const newOrg = {
          en_name: FormData?.en_name || storedOrganizationInfo[0]?.en_name,
          motto: FormData?.motto || storedOrganizationInfo[0]?.motto,
          mission: FormData?.mission || storedOrganizationInfo[0]?.mission,
          vision: FormData?.vision || storedOrganizationInfo[0]?.vision,
          core_value: FormData?.core_value || storedOrganizationInfo[0]?.core_value,
          logo: FormData?.logo || storedOrganizationInfo[0]?.logo,
          address: FormData?.address || storedOrganizationInfo[0]?.address,
          website: FormData?.website || storedOrganizationInfo[0]?.website,
          email: FormData?.email || storedOrganizationInfo[0]?.email,
          phone_number: FormData?.phone_number || storedOrganizationInfo[0]?.phone_number,
          fax_number: FormData?.fax_number || storedOrganizationInfo[0]?.fax_number,
          po_box: FormData?.po_box || storedOrganizationInfo[0]?.po_box,
          tin_number: FormData?.tin_number || storedOrganizationInfo[0]?.tin_number,
          abbreviation: FormData?.abbreviation || storedOrganizationInfo[0]?.abbreviation,
        };

        
  
        if (storedOrganizationInfo.length === 0) {
          // If no organization exists, add the new one
          storedOrganizationInfo.push(newOrg);
          console.log('saved ');
        } else {
          // Update the first organization in the array
          storedOrganizationInfo[0] = newOrg;
          console.log('pushed');
        }
        console.log(storedOrganizationInfo);
        localStorage.setItem('organizationInfo', JSON.stringify(storedOrganizationInfo));
       
        toast.success('Organization infromation saved');  //this isn't showing
  
        return newOrg;*/
        
      } catch (error) {
        toast.error('Organization infromation was not saved');
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
  toast.info('No information available');
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
        toast.error('Fetch unsuccessful');
        return rejectWithValue(error.message);
      }
    }
)

export const deleteOrganizationInfo=createAsyncThunk(
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
)


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