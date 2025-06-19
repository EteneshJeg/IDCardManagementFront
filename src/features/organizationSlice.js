import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";


export const createOrganizationInfo = createAsyncThunk(
    'organization/create',
    async ({ FormData }, { rejectWithValue }) => {
      try {
        
        console.log(FormData);
        
        let storedOrganizationInfo = JSON.parse(localStorage.getItem('organizationInfo')) || [];
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
  
        return newOrg;
        
      } catch (error) {
        toast.error('Organization infromation was not saved');
        return rejectWithValue(error);
      }
    }
  );
  

export const getOrganizationInfo=createAsyncThunk(
    'organization/get',
    async(_,{rejectWithValue})=>{
        let storedOrganizationInfo=JSON.parse(localStorage.getItem('organizationInfo'))||[];
            console.log(storedOrganizationInfo);
            if(!Array.isArray(storedOrganizationInfo)){
                storedOrganizationInfo=[storedOrganizationInfo];
            }
            return storedOrganizationInfo;
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