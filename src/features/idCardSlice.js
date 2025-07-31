import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { toast } from "react-toastify";
import { getOrganizationInfo } from "./organizationSlice";
import QRCode from "react-qr-code";
import i18next from "i18next";

let token = JSON.parse(localStorage.getItem('token'));

export const getProfile = createAsyncThunk(
  'profile/get',
  async ({ Id }, { rejectWithValue }) => {
    try {

      console.log("id",Id);
      const response=await axios.get(`http://localhost:8000/api/employees/${Id}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      console.log(response);
      const data=response.data;
      console.log(data.data);
      return data.data;

      /*let storedProfiles = JSON.parse(localStorage.getItem('profile')) || [];

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
      return profile ?? {};*/
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message || 'Failed to get profile');
    }
  }
);


export const generateId = createAsyncThunk(
  'id/create',
  async ({ Id, UserInfo, rawData,templates,Images }, { rejectWithValue }) => {
    try {
     
      //create if the table is empty or if the employee isn't in the table
      const getIdCardTemplateDetailResponse=await axios.get('http://localhost:8000/api/identity-card-template-details',{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      console.log(getIdCardTemplateDetailResponse);
      const getIdCardTemplateDetailData=getIdCardTemplateDetailResponse.data;
      console.log(getIdCardTemplateDetailData)

      const getEmployeeIdCardsResponse=await axios.get('http://localhost:8000/api/employee-identity-cards',{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      console.log(getEmployeeIdCardsResponse);
      const getEmployeeIdCardsData=getEmployeeIdCardsResponse.data;
      console.log(getEmployeeIdCardsData)

      //first get the details
        const detailresponse=await axios.get('http://localhost:8000/api/identity-card-details',{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      if(!detailresponse){
        console.log(detailresponse);
        return;
      }
      console.log(detailresponse);
      const detailsFetched=detailresponse.data.data;
      console.log("details",detailsFetched);


      const templateSides=['front','back','badge'];

      //get the text and image fields separately
      const textFields=templateSides.flatMap(side=>{

        const fields=templates?.[side]?.textFields || {};
        return Object.values(fields).map(field=>({
        name:field.field_name,
    }))
      })
      console.log(textFields)

      const imageFields=templateSides.flatMap(side=>{

        const fields=templates?.[side]?.imageFields || {};
        return Object.values(fields).map(field=>({
        name:field.field_name,
    }))
      })

      
      const matchingTextFields=detailsFetched.filter(detail=> textFields.some(field => field.name === detail.field_name)).map(detail=>({
        id:detail.id,
        name:detail.field_name,
        template_id:detail.template_id
      }))
      console.log(matchingTextFields);

      const matchingImageFields=detailsFetched.filter(detail=> imageFields.some(field => field.name === detail.field_name)).map(detail=>({
        id:detail.id,
        name:detail.field_name,
        template_id:detail.template_id
      }))
      console.log(matchingImageFields);


    const combinedDetails = [...matchingTextFields, ...matchingImageFields];
    console.log(combinedDetails)


    //get the text and image fields that have matching names
    const textContentData = {};

matchingTextFields.forEach(field => {
  const key = field.name; // e.g. "en_name"
  
  textContentData[key] = UserInfo.hasOwnProperty(key) ? UserInfo[key] : null;

});

console.log(textContentData);

const imageContentData = {};

matchingImageFields.forEach(field => {
  const key = field.name; // e.g. "en_name"
  
  imageContentData[key] = UserInfo.hasOwnProperty(key) ? UserInfo[key] :UserInfo.hasOwnProperty('photo_url')?UserInfo['photo_url'] :null;
 
});

console.log(imageContentData);


    //build the form
    const form=combinedDetails.map(detail=>({
      identity_card_template_id:detail.template_id,
      identity_card_detail_id:detail.id,
      employee_id:Id,
      text_content:textContentData?.[detail.name],
      image_file:imageContentData?.[detail.name]
    }))

console.log(form);

//SAVING ISSUE DATE,EXPIRY DATE AND ID_STATUS TO EMPLOYEES TABLE
    console.log("Reached here");
    const today=new Date();
    console.log(today);
    console.log(rawData.id_expire_date);
    const checkedStatus=new Date(rawData.id_expire_date)<today?"Expired":"Active";
    console.log("Reached here again");
    console.log(checkedStatus)
    const response=await axios.get(`http://localhost:8000/api/employees/${Id}`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    }).catch(error=>{console.log(error.response)});
    console.log(response);
    const data=response.data.data;

 
    const dateform={
      id_issue_date:toValidDate(rawData.id_issue_date) || null,
      id_expire_date:toValidDate(rawData.id_expire_date) || null,
      id_status:checkedStatus,
      en_name:data.en_name,
      sex:"female",
      employment_id:data.employment_id,
      user_id:data.user?.id,
      phone_number:data.phone_number,
      status:data.status,
      title:data.title,
      martial_status_id:data.marital_status?.id,
      job_position_id:data.job_position?.id,
      organization_id:1,
      organization_unit_id:data.organization_unit?.id,
      job_title_category_id:data.job_title_category?.id,
      region_id:data.region?.id,
      zone_id:data.zone?.id,
      woreda_id:data.woreda?.id,
      nation:data.nation

    }
    console.log(dateform);

    const responseTemp=await axios.get('http://localhost:8000/api/identity-card-templates',{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      const dataTemp=responseTemp.data.data;
      console.log(dataTemp);
      console.log(Images);
      const idObject = dataTemp
  .filter(data => Images[data.type + 'Uri']) // e.g., 'frontUri', 'backUri', etc.
  .map(data => ({
    id: data.id,
    image: Images[data.type + 'Uri']
  }));

      console.log(idObject);

      const idcardform=idObject.map(data=>({
        employee_id:Id,
        identity_card_template_id:data.id,
        image_file:dataURLtoFile(data.image,'image.png')
      }))
      console.log(idcardform);

      const formData = new FormData();

idcardform.forEach((item, index) => {
  formData.append(`${index}[employee_id]`, item.employee_id);
  formData.append(`${index}[identity_card_template_id]`, item.identity_card_template_id);
  formData.append(`${index}[image_file]`, item.image_file);
});
console.log('check')
console.log("id",Id);
console.log(getIdCardTemplateDetailData.data.map(data=>data.employee_id));
console.log(getIdCardTemplateDetailData.data.find(data => {

  return data.employee_id == Id; 
}));

      if(getIdCardTemplateDetailData.length===0 || getIdCardTemplateDetailData.message==="No record available" || !getIdCardTemplateDetailData.data.find(data=>data.employee_id==Id))
        {
        console.log("Enter here")
        

    //send to table
     try{
      const idcardtemplateresponse=axios.post('http://localhost:8000/api/identity-card-template-details',form,{
      headers:{
        Authorization:`Bearer ${token}`}})
        console.log(idcardtemplateresponse);
        toast.success(i18next.t('templatedetailinformationsaved'));
     }catch(error){
      console.log(error.response);
      toast.error(i18next.t('failedtosavetemplatedetailinformation'));
     }


    
let responseNew=await axios.put(`http://localhost:8000/api/employees/${Id}`,dateform,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }).catch(error=>{
              console.log(error.response) 
            return});

 console.log(responseNew);
     

 //save the files to the idcard table

      
      //take the image and the text for those fields

      

      await axios.post('http://localhost:8000/api/employee-identity-cards',formData,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      }).then(response=>{
        toast.success(i18next.t('idcardgenerated'));
        console.log(response)}).catch(error=>{
          toast.error(i18next.t('failedtogenerateidcard'));
          console.log(error.response)})

      }
      else {
        console.log("else")
        let employeeId=getIdCardTemplateDetailData.data.find(data=>data.employee_id==Id);
        console.log(employeeId.id)
        try{
      const idcardtemplateresponse=axios.put(`http://localhost:8000/api/identity-card-template-details/${employeeId.id}`,form,{
      headers:{
        Authorization:`Bearer ${token}`}})
        console.log(idcardtemplateresponse);
        toast.success(i18next.t('templatedetailinformationupdated'));
     }catch(error){
      console.log(error.response);
      toast.error(i18next.t('failedtoupdatetemplatedetailinformation'));
     }

     let responseNew=await axios.put(`http://localhost:8000/api/employees/${Id}`,dateform,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }).catch(error=>{
              console.log(error.response) 
            return});

 console.log(responseNew);

let employeeIdNumber=getEmployeeIdCardsData.data.find(data=>data.employee_id==Id);
console.log(employeeIdNumber)
 await axios.put(`http://localhost:8000/api/employee-identity-cards/${employeeIdNumber.id}`,formData,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      }).then(response=>{
        toast.success(i18next.t('idcardgenerated'));
        console.log(response)}).catch(error=>{
          toast.error(i18next.t('failedtogenerateidcard'));
          console.log(error.response)})


      }

      
    } catch (error) {
      //toast.error('Failed to generate Id');
      return rejectWithValue(error.message)
    }
  }
)

function toValidDate(value) {
  if (!value || value === "0" || value === 0) return null;

  const d = new Date(value);
  if (isNaN(d.getTime())) return null;

  return d.toISOString().split("T")[0]; // "YYYY-MM-DD"
}



function dataURLtoFile(dataurl, filename) {
    // Split the dataurl into metadata and base64 string
    const arr = dataurl.split(',');
   
    const mime = arr[0].match(/:(.*?);/)[1];
   
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

   
    return new File([u8arr], filename, { type: mime });
}







      


    
   

export const saveTemplate = createAsyncThunk(
  'template/save',
  async ({ TemplateData, selected }, { rejectWithValue }) => {
    try {

      
      const savedTemplate = {
        type: selected,
        file: TemplateData?.[selected].templateBackground.imageUrl,
        sample_file: TemplateData?.[selected].templateBackground.imageUrl,
        status: false
      }
      console.log(savedTemplate)
      let formdata = new FormData();
      for (let key in savedTemplate) {
        formdata.append(key, savedTemplate[key]);
      };

      const response = await axios.get('http://localhost:8000/api/identity-card-templates', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response);



      if (response?.data?.message?.toLowerCase() === 'no record available') {
        console.log('here');
        await axios.post('http://localhost:8000/api/identity-card-templates', formdata, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(response => {
          console.log(response);
          toast.success(i18next.t('templatesaved'));
          return;
        }).catch(error => {
          console.log(error.response);
          toast.error(i18next.t('failedtosavetemplate'));
          return;
        })
      }

      else {
        const data = response.data.data || response.data.data[0];
        console.log(data)

        const matchingTemplate = data.find(temp => temp.type === selected);



        if (matchingTemplate) {
          const savedTemplate = {
            type: selected,
            file: TemplateData?.[selected].templateBackground.imageUrl,
            sample_file: TemplateData?.[selected].templateBackground.imageUrl,
            status: false
          }
          console.log(savedTemplate)

          let formdata = new FormData();
          formdata.append('_method', 'PUT');
          for (let key in savedTemplate) {
            formdata.append(key, savedTemplate[key]);
          };
          for (let pair of formdata.entries()) {
            console.log(pair[0], pair[1]);
          }

          let id = matchingTemplate.id;
          // <- this is required!

          await axios.post(`http://localhost:8000/api/identity-card-templates/${id}`, formdata, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }).then(response => {
            console.log(response);
            toast.success(i18next.t('templateupdated'));
            return;
          }).catch(error => {
            console.log(error.response);
            toast.error(i18next.t('failedtoupdatetemplate'));
            return;
          })
        }

        else {
          await axios.post('http://localhost:8000/api/identity-card-templates', formdata, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }).then(response => {
            console.log(response);
            toast.success(i18next.t('templatesaved'));
            return;
          }).catch(error => {
            console.log(error.response);
            toast.error(i18next.t('failedtosavetemplate'));
            return;
          })
        }

      }

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const getTemplate = createAsyncThunk(
  'template/get',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8000/api/identity-card-templates', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response);
      const data = response.data.data;
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const saveIdDetails = createAsyncThunk(
  'iddetails/save',
  async ({ side, detailData, enabled }, { rejectWithValue }) => {
    try {
      //const token = localStorage.getItem('token'); // Get token

      // Fetch template list to get the template ID by side
      const templateRes = await axios.get('http://localhost:8000/api/identity-card-templates', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const templates = templateRes?.data?.data || [];
      const matchingTemplate = templates.find(temp => temp.type === side);

      if (!matchingTemplate) {
        toast.error(i18next.t('templatenotfound'));
        return rejectWithValue("Template not found.");
      }

      const templateId = matchingTemplate.id;
      const imageFields = Object.values(detailData?.[side]?.imageFields || {});
      const textFields = Object.values(detailData?.[side]?.textFields || {});
      
      console.log(detailData)
      console.log(imageFields)
      console.log(textFields)

      const details = [];

      imageFields.forEach(field => {
        details.push({
          template_id: templateId,
          field_label: field.field_label,
          field_name: field.field_name,
          label_length: field.label_length,
          type: field.type,
          image_file: field.image_file,
          image_height: field.image_height,
          image_width: field.image_width,
          has_mask: field.has_mask,
          circle_diameter: field.circle_diameter,
          circle_mask_thickness: field.circle_mask_thickness,
          circle_positionx: field.circle_positionx,
          circle_positiony: field.circle_positiony,
          circle_background: field.circle_background,
          status: field.status,
        });
      });

      textFields.forEach(field => {
  console.log("Inspecting text field:", field); // DEBUG

  // Only push if required fields exist
  if (field.field_name && field.type) {
    details.push({
      template_id: templateId,
      field_label: field.field_label || "",
      field_name: field.field_name ,
      label_length: field.label_length || "",
      type: field.type,
      text_content: field.text_content || "",
      text_font_color: field.text_font_color || "",
      text_font_size: field.text_font_size || "",
      text_font_type: field.text_font_type || "",
      text_positionx: field.text_positionx || "",
      text_positiony: field.text_positiony || "",
      text_gap: field.text_gap || "",
      status: field.status || "inactive",
    });
  } else {
    console.warn("Skipped invalid text field:", field);
  }
});


      console.log(details);

      const validDetails = details.filter(d =>
        d.template_id 
      );

      console.log(validDetails)

      if (validDetails.length === 0) {
        toast.warn("No valid field data to save.");
        return rejectWithValue("No valid data.");
      }

      // Check if template_id already exists in identity-card-details
      const detailsRes = await axios.get('http://localhost:8000/api/identity-card-details', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allIdDetails = detailsRes?.data?.data ?? [];
      const existingRecords = allIdDetails.filter(d => d.template_id === templateId);
      console.log(existingRecords)

      if (existingRecords.length > 0) {
        // Update each matching record
        for (const record of existingRecords) {
          const valids = existingRecords.filter(d =>
        d.template_id 
      );
          console.log(valids)
          console.log(record.field_name)
          const updatedData = validDetails.find(d => d.field_name === record.field_name);
          console.log(updatedData)
          console.log("Updating record:", record.id, updatedData); // DEBUG LOG
if (!record.id) {
  toast.error(i18next(`missingidforrecordwithfield`)`: ${record.field_name}`);
  throw new Error("Missing record ID");
}
          if (updatedData) {
            await axios.put(
              `http://localhost:8000/api/identity-card-details/${record.id}`,
              updatedData,
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );
            
       // toast.info(`Updated: ${record.field_name}`);
          }
          
        }
        toast.success(i18next.t('templatedetailinformationupdated'));

        

      } else {
        // If no existing records, create new ones
        const response = await axios.post(
          'http://localhost:8000/api/identity-card-details',
          { details: validDetails },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        ).then(error=>console.log(error.response));
        console.log(response);

        toast.success(i18next.t('templatedetailinformationsaved'));
      }

    } catch (error) {
      console.error("Save ID details error:", error.response);
      toast.error(i18next.t('failedtosavetemplatedetailinformation'));
      return rejectWithValue(error.response?.data?.message || "Unknown error");
    }
  }
);

export const getIdDetails=createAsyncThunk(
  'iddetails/get',
  async(_,{rejectWithValue})=>{
    try{
      const response=await axios.get('http://localhost:8000/api/identity-card-details',{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      console.log(response);
      const data=response.data.data;
      console.log(data);
      const activeData=data.filter(item=>item.status==='active');
      console.log(activeData);
      return activeData;
    }catch(error){
      return rejectWithValue(error.message)
    }
  }
)








const idSlice = createSlice({
  name: 'idSlice',
  initialState: {
    idCards: [],
    id_issue_date: '',
    id_expire_date: '',
    templates: [],
    details: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateId.fulfilled, (state, action) => {
        state.idCards = [...state.idCards, action.payload]
      })
      .addCase(saveTemplate.fulfilled, (state, action) => {
        state.templates = [...state.templates, action.payload]
      })
  }

}
)
export default idSlice.reducer