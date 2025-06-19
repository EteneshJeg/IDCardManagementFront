import { useEffect,useRef } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import { useState } from 'react'
import React from 'react'
import html2canvas from 'html2canvas';
import { getOrganizationInfo } from "../features/organizationSlice";


import { getProfile,generateId,getTemplate} from '../features/idCardSlice'
import { useDispatch, useSelector } from 'react-redux'

import { Stage,Layer,Text,Image,Group,Image as KonvaImage,Circle} from 'react-konva'

export default function IdManagement() {
    useEffect(() => {
    const script = document.createElement("script");
    script.src = "/assets/js/scripts.bundle.js";
    script.async = true;
    script.onload = () => {
      if (window.KTApp && typeof window.KTApp.init === "function") {
        window.KTApp.init();
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // clean up
    };
  }, []);

  const dispatch=useDispatch()
  const { idCards } = useSelector((state) => state.idCard);
  const [image, setImage] = useState(null);
  const [isCreateModalOpen,setIsCreateModalOpen]=useState(false);
  const [userProfile,setUserProfile]=useState([]);
  const [extractData,setExtractData]=useState([]);
  const [id,setId]=useState();
  const [selectedTemplate,setSelectedTemplate]=useState("front");
  const [orgname,setOrgName]=useState();
    const [motto,setMotto]=useState();
    const [mission,setMission]=useState();
    const [vision,setVision]=useState();
    const [coreValue,setCoreValue]=useState();
    const [logo,setLogo]=useState();
    const [orgAddress,setOrgAddress]=useState();
    const [website,setWebsite]=useState();
    const [orgEmail,setOrgEmail]=useState();
    const [orgPhone,setOrgPhone]=useState();
    const [fax,setFax]=useState();
    const [poBox,setPoBox]=useState();
    const [tin,setTin]=useState();
    const [abbreviation,setAbbreviation]=useState();
    
  
    useEffect(() => {
      dispatch(getOrganizationInfo()).then((data) => {
        const org = data.payload[0];
        const img=new window.Image();
        if (org) {
          setOrgName(org.en_name);
          setMotto(org.email);
          setMission(org.mission);
          setVision(org.vision);
          setCoreValue(org.core_value);
          img.src=(org.logo);
          img.onload = () => {
            setLogo(img); 
          };
          setOrgAddress(org.address);
          setWebsite(org.website);
          setOrgEmail(org.email);
          setOrgPhone(org.phone);
          setFax(org.fax_number);
          setPoBox(org.po_box);
          setTin(org.tin_number);
          setAbbreviation(org.abbreviation);
    
         
          
        }
      });
    }, []);
   
   
   
    
    const [templates,setTemplates]=useState({
      front:{
          photo:{
              xPosition:30,
              yPosition:80,
              image_width:150,
              image_height:150,
              has_mask:false,
              mask_thickness:0,
              mask_color:'black',
              is_circle:false,
              circle_diameter:0,
              circle_background:null,
          },
          en_name:{
              text_positionx:400,
              text_positiony:80,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Name',
              field_name:'en_name',
              
          },
          job_position:{
              text_positionx:400,
              text_positiony:100,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Role',
              field_name:'job_position',
              
          },
          id_issue_date:{
              text_positionx:400,
              text_positiony:120,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Issue Date',
              field_name:'id_issue_date',
              
          },
          id_expire_date:{
              text_positionx:400,
              text_positiony:140,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Expire Date',
              field_name:'id_expire_date',
              
          },
          title:{
              text_positionx:400,
              text_positiony:140,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Title',
              field_name:'title',
          },
          sex:{
              text_positionx:400,
              text_positiony:140,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Sex',
              field_name:'sex',
          },
          date_of_birth:{
              text_positionx:400,
              text_positiony:140,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Date of Birth',
              field_name:'date_of_birth',
          },
          joined_date:{
            text_positionx:400,
              text_positiony:140,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Join Date',
              field_name:'joined_date',
          },
          email:{
            text_positionx:400,
              text_positiony:140,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Email',
              field_name:'email',
          },
          phone_number:{
            text_positionx:400,
              text_positiony:140,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Phone',
              field_name:'phone_number',
          },
          organization_unit:{
            text_positionx:400,
              text_positiony:140,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Unit',
              field_name:'organization_unit',
          },
          job_position:{
            text_positionx:400,
              text_positiony:140,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Position',
              field_name:'job_position',
          },
          job_title_category:{
            text_positionx:400,
              text_positiony:140,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Job Category',
              field_name:'job_title_category',
          },
          salary_amount:{
            text_positionx:400,
              text_positiony:140,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Salary ID',
              field_name:'salary_amount',
          },
          marital_status:{
            text_positionx:400,
              text_positiony:140,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Marital Status',
              field_name:'marital_status',
          },
          nation:{
            text_positionx:400,
              text_positiony:140,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Nation',
              field_name:'nation',
          },
          employment_id:{
              text_positionx:400,
              text_positiony:140,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Employment ID',
              field_name:'id_expire_date',
          },
          job_position_start_date:{
            text_positionx:400,
              text_positiony:140,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Position Start Date',
              field_name:'job_position_start_date',
          },
          job_position_end_date:{
            text_positionx:400,
              text_positiony:140,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Position End Date',
              field_name:'job_position_end_date',
          },
          address:{
            text_positionx:400,
              text_positiony:140,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Address',
              field_name:'address',
          },
          house_number:{
            text_positionx:400,
              text_positiony:140,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'House Number',
              field_name:'house_number',
          },
          region:{
            text_positionx:400,
              text_positiony:140,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Region',
              field_name:'region',
          },
          zone:{
            text_positionx:400,
              text_positiony:140,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Zone',
              field_name:'zone',
          },
          woreda:{
            text_positionx:400,
              text_positiony:140,
              text_font_size:18,
              text_font_color:'black',
              text_font_type:'arial',
              gap:200,
              field_label:'Woreda',
              field_name:'woreda',
          },
          orgname:{
            text_positionx:400,
            text_positiony:140,
            text_font_size:18,
            text_font_color:'black',
            text_font_type:'arial',
            gap:200,
            field_label:'Organization Name',
            field_name:'orgname',
          },
          motto:{
            text_positionx:400,
            text_positiony:140,
            text_font_size:18,
            text_font_color:'black',
            text_font_type:'arial',
            gap:200,
            field_label:'Motto',
            field_name:'motto',
          },
          mission:{
            text_positionx:400,
            text_positiony:140,
            text_font_size:18,
            text_font_color:'black',
            text_font_type:'arial',
            gap:200,
            field_label:'Mission',
            field_name:'mission',
          },
          vision:{
            text_positionx:400,
            text_positiony:140,
            text_font_size:18,
            text_font_color:'black',
            text_font_type:'arial',
            gap:200,
            field_label:'Organization Vision',
            field_name:'vision',
          },
          orgEmail:{
            text_positionx:400,
            text_positiony:140,
            text_font_size:18,
            text_font_color:'black',
            text_font_type:'arial',
            gap:200,
            field_label:'Organization email',
            field_name:'org_email',
          },
          coreValue:{
            text_positionx:400,
            text_positiony:140,
            text_font_size:18,
            text_font_color:'black',
            text_font_type:'arial',
            gap:200,
            field_label:'Core Value',
            field_name:'coreValue',
          },
          logo:{
          logo_xPosition:30,
          logo_yPosition:80,
          logo_image_width:150,
          logo_image_height:150,
          logo_has_mask:false,
          logo_mask_thickness:0,
          logo_mask_color:'black',
          logo_is_circle:false,
          logo_circle_diameter:0,
          logo_circle_background:null,
          },
          orgAddress:{
            text_positionx:400,
            text_positiony:140,
            text_font_size:18,
            text_font_color:'black',
            text_font_type:'arial',
            gap:200,
            field_label:'Organization Address',
            field_name:'orgAddress',
          },
          orgPhone:{
            text_positionx:400,
            text_positiony:140,
            text_font_size:18,
            text_font_color:'black',
            text_font_type:'arial',
            gap:200,
            field_label:'Organization Phone',
            field_name:'orgPhone',
          },
          website:{
            text_positionx:400,
            text_positiony:140,
            text_font_size:18,
            text_font_color:'black',
            text_font_type:'arial',
            gap:200,
            field_label:'Website',
            field_name:'website',
          },
          fax:{
            text_positionx:400,
            text_positiony:140,
            text_font_size:18,
            text_font_color:'black',
            text_font_type:'arial',
            gap:200,
            field_label:'Fax number',
            field_name:'fax',
          },
          poBox:{
            text_positionx:400,
            text_positiony:140,
            text_font_size:18,
            text_font_color:'black',
            text_font_type:'arial',
            gap:200,
            field_label:'P.O.BOX',
            field_name:'poBox',
          },
          tin:{
            text_positionx:400,
            text_positiony:140,
            text_font_size:18,
            text_font_color:'black',
            text_font_type:'arial',
            gap:200,
            field_label:'Tin Number',
            field_name:'tin_number',
          },
          abbreviation:{
            text_positionx:400,
            text_positiony:140,
            text_font_size:18,
            text_font_color:'black',
            text_font_type:'arial',
            gap:200,
            field_label:'Organization abbreviation',
            field_name:'abbreviation',
          }
        
          
      },
      back:{
        photo:{
          xPosition:30,
          yPosition:80,
          image_width:150,
          image_height:150,
          has_mask:false,
          mask_thickness:0,
          mask_color:'black',
          is_circle:false,
          circle_diameter:0,
          circle_background:null,
      },
      en_name:{
          text_positionx:400,
          text_positiony:80,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Name',
          field_name:'en_name',
          
      },
      job_position:{
          text_positionx:400,
          text_positiony:100,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Role',
          field_name:'job_position',
          
      },
      id_issue_date:{
          text_positionx:400,
          text_positiony:120,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Issue Date',
          field_name:'id_issue_date',
          
      },
      id_expire_date:{
          text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Expire Date',
          field_name:'id_expire_date',
          
      },
      title:{
          text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Title',
          field_name:'title',
      },
      sex:{
          text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Sex',
          field_name:'sex',
      },
      date_of_birth:{
          text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Date of Birth',
          field_name:'date_of_birth',
      },
      joined_date:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Join Date',
          field_name:'joined_date',
      },
      email:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Email',
          field_name:'email',
      },
      phone_number:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Phone',
          field_name:'phone_number',
      },
      organization_unit:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Unit',
          field_name:'organization_unit',
      },
      job_position:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Position',
          field_name:'job_position',
      },
      job_title_category:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Job Category',
          field_name:'job_title_category',
      },
      salary_amount:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Salary ID',
          field_name:'salary_amount',
      },
      marital_status:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Marital Status',
          field_name:'marital_status',
      },
      nation:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Nation',
          field_name:'nation',
      },
      employment_id:{
          text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Employment ID',
          field_name:'id_expire_date',
      },
      job_position_start_date:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Position Start Date',
          field_name:'job_position_start_date',
      },
      job_position_end_date:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Position End Date',
          field_name:'job_position_end_date',
      },
      address:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Address',
          field_name:'address',
      },
      house_number:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'House Number',
          field_name:'house_number',
      },
      region:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Region',
          field_name:'region',
      },
      zone:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Zone',
          field_name:'zone',
      },
      woreda:{
          text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Woreda',
          field_name:'woreda',
      },
      orgname:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Organization Name',
        field_name:'orgname',
      },
      motto:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Motto',
        field_name:'motto',
      },
      mission:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Mission',
        field_name:'mission',
      },
      vision:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Organization Vision',
        field_name:'vision',
      },
      orgEmail:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Organization email',
        field_name:'org_email',
      },
      coreValue:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Core Value',
        field_name:'coreValue',
      },
      logo:{
        logo_xPosition:30,
        logo_yPosition:80,
        logo_image_width:150,
        logo_image_height:150,
        logo_has_mask:false,
        logo_mask_thickness:0,
        logo_mask_color:'black',
        logo_is_circle:false,
        logo_circle_diameter:0,
        logo_circle_background:null,
        },
      orgAddress:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Organization Address',
        field_name:'orgAddress',
      },
      orgPhone:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Organization Phone',
        field_name:'orgPhone',
      },
      website:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Website',
        field_name:'website',
      },
      fax:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Fax number',
        field_name:'fax',
      },
      poBox:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'P.O.BOX',
        field_name:'poBox',
      },
      tin:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Tin Number',
        field_name:'tin',
      },
      abbreviation:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Organization abbreviation',
        field_name:'abbreviation',
      }
      },
      badge:{
        photo:{
          xPosition:30,
          yPosition:80,
          image_width:150,
          image_height:150,
          has_mask:false,
          mask_thickness:0,
          mask_color:'black',
          is_circle:false,
          circle_diameter:0,
          circle_background:null,
      },
      en_name:{
          text_positionx:400,
          text_positiony:80,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Name',
          field_name:'en_name',
          
      },
      job_position:{
          text_positionx:400,
          text_positiony:100,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Role',
          field_name:'job_position',
          
      },
      id_issue_date:{
          text_positionx:400,
          text_positiony:120,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Issue Date',
          field_name:'id_issue_date',
          
      },
      id_expire_date:{
          text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Expire Date',
          field_name:'id_expire_date',
          
      },
      title:{
          text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Title',
          field_name:'title',
      },
      sex:{
          text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Sex',
          field_name:'sex',
      },
      date_of_birth:{
          text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Date of Birth',
          field_name:'date_of_birth',
      },
      joined_date:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Join Date',
          field_name:'joined_date',
      },
      email:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Email',
          field_name:'email',
      },
      phone_number:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Phone',
          field_name:'phone_number',
      },
      organization_unit:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Unit',
          field_name:'organization_unit',
      },
      job_position:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Position',
          field_name:'job_position',
      },
      job_title_category:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Job Category',
          field_name:'job_title_category',
      },
      salary_amount:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Salary ID',
          field_name:'salary_amount',
      },
      marital_status:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Marital Status',
          field_name:'marital_status',
      },
      nation:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Nation',
          field_name:'nation',
      },
      employment_id:{
          text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Employment ID',
          field_name:'id_expire_date',
      },
      job_position_start_date:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Position Start Date',
          field_name:'job_position_start_date',
      },
      job_position_end_date:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Position End Date',
          field_name:'job_position_end_date',
      },
      address:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Address',
          field_name:'address',
      },
      house_number:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'House Number',
          field_name:'house_number',
      },
      region:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Region',
          field_name:'region',
      },
      zone:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Zone',
          field_name:'zone',
      },
      woreda:{
        text_positionx:400,
          text_positiony:140,
          text_font_size:18,
          text_font_color:'black',
          text_font_type:'arial',
          gap:200,
          field_label:'Woreda',
          field_name:'woreda',
      },
      orgname:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Organization Name',
        field_name:'orgname',
      },
      motto:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Motto',
        field_name:'motto',
      },
      mission:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Mission',
        field_name:'mission',
      },
      vision:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Organization Vision',
        field_name:'vision',
      },
      orgEmail:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Organization email',
        field_name:'org_email',
      },
      coreValue:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Core Value',
        field_name:'coreValue',
      },
      logo:{
        logo_xPosition:30,
        logo_yPosition:80,
        logo_image_width:150,
        logo_image_height:150,
        logo_has_mask:false,
        logo_mask_thickness:0,
        logo_mask_color:'black',
        logo_is_circle:false,
        logo_circle_diameter:0,
        logo_circle_background:null,
        },
      orgAddress:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Organization Address',
        field_name:'orgAddress',
      },
      orgPhone:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Organization Phone',
        field_name:'orgPhone',
      },
      website:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Website',
        field_name:'website',
      },
      fax:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Fax number',
        field_name:'fax',
      },
      poBox:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'P.O.BOX',
        field_name:'poBox',
      },
      tin:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Tin Number',
        field_name:'tin',
      },
      abbreviation:{
        text_positionx:400,
        text_positiony:140,
        text_font_size:18,
        text_font_color:'black',
        text_font_type:'arial',
        gap:200,
        field_label:'Organization abbreviation',
        field_name:'abbreviation',
      }
      },
          
      });
  
    const loadFieldState=()=>{
      const savedFieldState=JSON.parse(localStorage.getItem('enabledFields'));
      return savedFieldState?savedFieldState :{
                  en_name:false,
                  title:false,
                  sex:false,
                  date_of_birth:false,
                  joined_date:false,
                  email:false,
                  photo:false,
                  phone_number:false,
                  organization_unit:false,
                  job_position:false,
                  job_title_category:false,
                  salary_amount:false,
                  marital_status:false,
                  nation:false,
                  employment_id:false,
                  job_position_start_date:false,
                  job_position_end_date:false,
                  address:false,
                  house_number:false,
                  region:false,
                  zone:false,
                  woreda:false,
                  status:false,
                  id_issue_date:false,
                  id_expire_date:false,
                  id_status:false,
                  
                  
      }
    }
    const [enableField,setEnableField]=useState(loadFieldState);
    const frontRef=useRef();
    const backRef=useRef();
  
  useEffect(()=>{
      if(userProfile&&userProfile.photo){
          const img=new window.Image()
          img.src=userProfile.photo
          img.onload=()=>setImage(img)
      }
      else{
          const fallback=new window.Image()
          fallback.src="https://th.bing.com/th/id/OIP.30Yq02E10j8tn6kKBO1qdQHaHa?rs=1&pid=ImgDetMain"
          fallback.onload=()=>setImage(fallback)
      }
  },[userProfile])

  useEffect(()=>{
      
      const querySearchParams=new URLSearchParams(window.location.search);
      const dataString=querySearchParams.get("data");

      if(dataString){
          
          setId(decodeURIComponent(dataString)); 
      }

  },[]);

  useEffect(()=>{
     if(id){
      dispatch(getProfile({Id:id})).then((data)=>{
          console.log(data)
          const dataitem=data.payload;
          console.log(dataitem);
          if(dataitem){
              setUserProfile(dataitem);
              console.log(dataitem)
          }
          else{
              console.log('no id found');
              setUserProfile(null);
          }
          
      })
  }
  },[dispatch,id,idCards])

  useEffect(() => {
      dispatch(getTemplate()).then((data)=>{
          console.log(data)
          const dataitem=data.payload
          console.log(dataitem)
          if(!Array.isArray(dataitem)&& Object.keys(dataitem).length!=0){
              setTemplates(dataitem);
          }
      });
    }, []);

    

    const handleDownload = async () => {
      if (!frontRef.current || !backRef.current) {
        console.error("Stage refs not available");
        return;
      }
    
      try {
        
        let frontUri = await frontRef.current.toImage({ mimeType: 'image/png', pixelRatio: 2 });
    
        
        let backUri = await backRef.current.toImage({ mimeType: 'image/png', pixelRatio: 2 });
    
  
        if (frontUri instanceof HTMLImageElement || frontUri instanceof HTMLCanvasElement) {
          const frontCanvas = document.createElement('canvas');
          const frontCtx = frontCanvas.getContext('2d');
          frontCanvas.width = frontUri.width || frontUri.naturalWidth;
          frontCanvas.height = frontUri.height || frontUri.naturalHeight;
          frontCtx.drawImage(frontUri, 0, 0);
          frontUri = frontCanvas.toDataURL('image/png');
        } else if (typeof frontUri === 'string') {
          frontUri = frontUri.trim();
        }
    
       
        if (backUri instanceof HTMLImageElement || backUri instanceof HTMLCanvasElement) {
          const backCanvas = document.createElement('canvas');
          const backCtx = backCanvas.getContext('2d');
          backCanvas.width = backUri.width || backUri.naturalWidth;
          backCanvas.height = backUri.height || backUri.naturalHeight;
          backCtx.drawImage(backUri, 0, 0);
          backUri = backCanvas.toDataURL('image/png');
        } else if (typeof backUri === 'string') {
          backUri = backUri.trim();
        }
    
        
        const frontLink = document.createElement('a');
        frontLink.download = `${userProfile.en_name}-front.png`;
        frontLink.href = frontUri;
        document.body.appendChild(frontLink);
        frontLink.click();
        document.body.removeChild(frontLink);
    
        
        const backLink = document.createElement('a');
        backLink.download = `${userProfile.en_name}-back.png`;
        backLink.href = backUri;
        document.body.appendChild(backLink);
        backLink.click();
        document.body.removeChild(backLink);
    
      } catch (error) {
        console.error("Error generating images: ", error);
      }
    };
    
    
    
    


  console.log(templates)
  const selectedTemplateFields = templates[selectedTemplate] || {};
  console.log(selectedTemplateFields)
 
  
  const handleIdChange=(e)=>{
      setExtractData({...extractData,[e.target.name]:e.target.value})
      console.log(extractData);
  }

  const handleCreateId=()=>{

      dispatch(generateId({Id:id,UserInfo:userProfile,FormData:extractData}));
      
      setIsCreateModalOpen(false)
      
  }

  const [backObj,setBackObj]=useState();
  const [backObjBack,setBackObjBack]=useState();
  const [backObjBadge,setBackObjBadge]=useState();
  const [imageMaskColor,setImageMaskColor]=useState('black');
  const [imageCircleDiameter, setImageCircleDiameter] = useState(0);
  const [imageMaskThickness,setImageMaskThickness]=useState(0);
  const [logoPosition, setLogoPosition] = useState({ x: 250, y: 50 });
  const [logoDimension,setLogoDimension]=useState({width:150,height:150});
  const [logoMask,setLogoMask]=useState(false);
  const [logoMaskThickness,setLogoMaskThickness]=useState(0);
  const [logoCircle, setLogoCircle] = useState({ is_circle: false });
const [logoCircleDiameter, setLogoCircleDiameter] = useState(0);
const [logoMaskColor,setLogoMaskColor]=useState('black');
  
  console.log(Object.keys(localStorage));
  const loadImageWithCORS = (src) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous'; 
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = src;
    });
  };

  useEffect(() => {
    const loadBackground = async () => {
      try {
        const img = localStorage.getItem('templateCardsfront');
        console.log('Loaded base64 from localStorage:', img);

        if (!img) {
          console.warn('No image found in localStorage');
          return;
        }

        const loadedImage = await loadImageWithCORS(img);
        setBackObj(loadedImage); // Set the loaded image
      } catch (error) {
        console.error('Failed to load background image', error);
      }
    };

    loadBackground();
  }, []);
  
  

  useEffect(() => {
    const img = localStorage.getItem('templateCardsback');
    if (!img) return;
  
    const image = new window.Image();
    image.src = img;
  
    image.onload = () => {
      console.log('Image loaded:', image);
      setBackObjBack(image);
    };
  }, [selectedTemplate]);
console.log(backObjBack)


useEffect(()=>{
  const img=localStorage.getItem(`templateCardsbadge`);
  console.log(img);
  const loading=new window.Image();
  loading.src=img;
  console.log(loading);
  setBackObjBadge(loading);
},[selectedTemplate]);




  return (
    <>
    
          {/* Toolbar */}
          <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
            <div
              id="kt_app_toolbar_container"
              className="app-container container-xxl d-flex flex-stack"
            >
              {/* Title and Breadcrumbs */}
              <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                <h1 className="page-heading text-dark fw-bold fs-3 my-0">
                  ID Management
                </h1>
                <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
                  <li className="breadcrumb-item text-muted">
                    <a
                      href="/"
                      className="text-muted text-hover-primary"
                    >
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <span className="bullet bg-gray-400 w-5px h-2px"></span>
                  </li>
                  <li className="breadcrumb-item text-muted">ID Management</li>
                </ul>
              </div>

              {/* Buttons */}
              
            </div>
          </div>

          {/* Page content goes here */}
  <div id="kt_app_content" className="app-content flex-column-fluid">
  <div id="kt_app_content_container" className="app-container container-xxl">
  <ul class="nav nav-tabs nav-line-tabs mb-5 fs-6 d-flex">
    <li class="nav-item">
        <a class="nav-link active" data-bs-toggle="tab" href="#kt_tab_pane_1">Employee Information</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" data-bs-toggle="tab" href="#kt_tab_pane_2">Employee ID</a>
    </li>
    
</ul>

<div class="tab-content" id="myTabContent">
<div className="tab-pane fade show active" id="kt_tab_pane_1" role="tabpanel">
  <div className="d-flex justify-content-between align-items-start">
    
    {/* User Info Card */}
    <div className="card card-flush h-md-50 mb-5 mb-xl-10" style={{ width: '50%', margin: '20px auto', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
      
      {/* Card Header */}
      <div className="card-header" style={{ backgroundColor: '#f8f9fa', padding: '10px 20px' }}>
        <h5 className="card-title" style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>User Information</h5>
      </div>
      
      {/* Card Body */}
      <div className="card-body pt-4 pb-4" style={{ backgroundColor: '#fff' }}>
        <div className="mb-3">
          {['en_name', 'title', 'date_of_birth', 'joined_date', 'job_title_category', 'salary_amount', 'marital_status', 'nation', 
            'job_position_start_date', 'job_position_end_date', 'address', 'house_number', 'region', 'zone', 'woreda', 
            'id_issue_date', 'id_expire_date'].map((field) => (
            <p key={field} style={{ margin: '8px 0', fontSize: '1rem' }}>
              <strong>{field.replace('_', ' ').toUpperCase()}:</strong> <span>{userProfile[field] || "N/A"}</span>
            </p>
          ))}
        </div>
      </div>
    </div>

    
    {selectedTemplateFields && Object.entries(selectedTemplateFields).length > 0  && (
      
      <div className="d-flex justify-content-center" 
      style={{ width: '100%', padding: '20px' }}>
        <Stage className="stage"
      width={700}
      height={600}
      scale={{ x: 0.9, y: 1}}>
          <Layer>
            <KonvaImage width={700} height={600} scale={{ x: 0.9, y: 1}} image={backObjBadge}  />
            {image &&enableField['badge']?.['photo'] &&(
              <Image
                x={templates['badge']?.imagePosition?.x || 50}
                y={templates['badge']?.imagePosition?.y || 50}
                image={image}
                width={templates['badge']?.imageDimension?.image_width || 150}
                height={templates['badge']?.imageDimension?.image_height || 150}
                stroke={templates['badge']?.imageMaskColor || imageMaskColor}
                strokeWidth={templates['badge']?.imageMaskThickness || imageMaskThickness}
                cornerRadius={templates['badge']?.imageCircleDiameter || imageCircleDiameter}
                rotation={0}
             
              />
            )}
            {Object.entries(templates['badge']).filter(([key,field])=>(
                enableField['badge']?.[key]&&field?.field_label?.trim() !== "" && field?.text_positionx != null
            )).map(([key, field]) => {
              let fieldValue = "N/A"; 
  switch (field.field_name) {
    case "orgname":
      fieldValue = orgname;
      break;
    case "motto":
      fieldValue = motto;
      break;
    case "mission":
      fieldValue = mission;
      break;
    case "vision":
      fieldValue = vision;
      break;
    case "coreValue":
      fieldValue = coreValue;
      break;
    case "orgAddress":
      fieldValue=orgAddress;
      break;
    case "orgPhone":
      fieldValue=orgPhone;
      break;
    case "orgAddress":
      fieldValue=orgAddress;
      break;
    case "website":
      fieldValue=website;
      break;
    case "orgEmail":
      fieldValue=orgEmail;
      break;
    case "fax":
      fieldValue=fax;
      break;
    case "tin":
      fieldValue=tin;
      break;
    case "abbreviation":
      fieldValue=abbreviation;
      break;
    default:
      fieldValue = userProfile?.[field.field_name] ?? "N/A";
  }

              const displayText = Array.isArray(fieldValue) ? fieldValue[0] : fieldValue;
              const xPos = Number(field.text_positionx || 0);
              const yPos = Number(field.text_positiony || 0);
              const gap = Number(field.gap) || 0;

              return (
                <Group key={key}>
                  <Text
                    x={xPos}
                    y={yPos}
                    text={field.field_label}
                    fill={field.text_font_color}
                    fontFamily={field.text_font_type}
                    fontSize={Number(field.text_font_size)}
                    fontStyle="bold"
                  />
                  <Text
                    x={xPos + gap}
                    y={yPos}
                    text={displayText}
                    fill={field.text_font_color}
                    fontFamily={field.text_font_type}
                    fontSize={Number(field.text_font_size)}
                  />
                </Group>
              );
            })}

{logo &&enableField['badge']?.['logo'] &&(
              <Image
                x={templates['badge']?.logoPosition?.x || 50}
                y={templates['badge']?.logoPosition?.y || 50}
                image={logo}
                width={templates['badge']?.logoDimension?.logo_image_width || 150}
                height={templates['badge']?.logoDimension?.logo_image_height || 150}
                stroke={templates['badge']?.logoMaskColor || logoMaskColor}
                strokeWidth={templates['badge']?.logoMaskThickness || logoMaskThickness}
                cornerRadius={templates['badge']?.logoCircleDiameter || logoCircleDiameter}
                rotation={0}
             
              />
            )}
            
          </Layer>
        </Stage>
      </div>
    )}
  </div>
</div>

    <div className="tab-pane fade" id="kt_tab_pane_2" role="tabpanel">
  <div className="id-show d-flex flex-wrap gap-5 w-100">
    
      <div className="card card-flush h-md-50 mb-5 mb-xl-10 flex-grow-1"  style={{ minWidth: '350px', maxWidth: '48%' }} >
        <div className="card-header"><h2>Front Template</h2></div>

        {selectedTemplateFields && Object.entries(selectedTemplateFields).length > 0 && (
          <div style={{ width: '100%', overflow: 'auto' }}>
            <Stage width={700} height={600} ref={frontRef} scale={{ x: 0.73, y: 0.61}}>
              <Layer>
                <KonvaImage width={700} height={600} image={backObj} />
                {image &&enableField['front']?.['photo']&& (
                  <>
                 <Circle
                         x={templates[selectedTemplate]?.imagePosition?.x + (templates[selectedTemplate]?.imageDimension?.image_width || 150) / 2}
                         y={templates[selectedTemplate]?.imagePosition?.y + (templates[selectedTemplate]?.imageDimension?.image_height || 150) / 2}
                         radius={(templates[selectedTemplate]?.imageDimension?.image_width || 150) / 2}
                         fill="white" 
                       />
                     
                       
                       <Image
                         x={templates[selectedTemplate]?.imagePosition?.x || 50}
                         y={templates[selectedTemplate]?.imagePosition?.y || 50}
                         image={image}
                         width={templates[selectedTemplate]?.imageDimension?.image_width || 150}
                         height={templates[selectedTemplate]?.imageDimension?.image_height || 150}
                         stroke={templates[selectedTemplate]?.imageMaskColor || imageMaskColor}
                         strokeWidth={templates[selectedTemplate]?.imageMaskThickness || imageMaskThickness}
                         cornerRadius={templates[selectedTemplate]?.imageCircleDiameter || imageCircleDiameter}
                         rotation={0}
                       />
                     </>
                )}

{logo &&enableField['front']?.['logo']&& (
                  <>
                 <Circle
                         x={templates['front']?.logoPosition?.x + (templates['front']?.logoDimension?.logo_image_width || 150) / 2}
                         y={templates['front']?.logoPosition?.y + (templates['front']?.logoDimension?.logo_image_height || 150) / 2}
                         radius={(templates['front']?.logoDimension?.logo_image_width || 150) / 2}
                         fill="white" 
                       />
                     
                       
                       <Image
                         x={templates['front']?.logoPosition?.x || 50}
                         y={templates['front']?.logoPosition?.y || 50}
                         image={logo}
                         width={templates['front']?.logoDimension?.logo_image_width || 150}
                         height={templates['front']?.logoDimension?.logo_image_height || 150}
                         stroke={templates['front']?.logoMaskColor || logoMaskColor}
                         strokeWidth={templates['front']?.logoMaskThickness || logoMaskThickness}
                         cornerRadius={templates['front']?.logoCircleDiameter || logoCircleDiameter}
                         rotation={0}
                       />
                     </>
                )}
                {Object.entries(templates['front'] ).filter(([key,field])=>(
                enableField['front']?.[key]&&field?.field_label?.trim() !== "" && field?.text_positionx != null
            )).map(([key, field]) => {
              
              let fieldValue = "N/A"; 
              switch (field.field_name) {
                case "orgname":
                  fieldValue = orgname;
                  break;
                case "motto":
                  fieldValue = motto;
                  break;
                case "mission":
                  fieldValue = mission;
                  break;
                case "vision":
                  fieldValue = vision;
                  break;
                case "coreValue":
                  fieldValue = coreValue;
                  break;
                case "orgAddress":
                  fieldValue=orgAddress;
                  break;
                case "orgPhone":
                  fieldValue=orgPhone;
                  break;
                case "orgAddress":
                  fieldValue=orgAddress;
                  break;
                case "website":
                  fieldValue=website;
                  break;
                case "orgEmail":
                  fieldValue=orgEmail;
                  break;
                case "fax":
                  fieldValue=fax;
                  break;
                case "tin":
                  fieldValue=tin;
                  break;
                case "abbreviation":
                  fieldValue=abbreviation;
                  break;
                default:
                  fieldValue = userProfile?.[field.field_name] ?? "N/A";
              }
                  const displayText = Array.isArray(fieldValue) ? fieldValue[0] : fieldValue;
                  const xPos = Number(field.text_positionx || 0);
                  const yPos = Number(field.text_positiony || 0);
                  const gap = Number(field.gap) || 0;

                  return (
                    <Group key={key}>
                      <Text
                        x={xPos}
                        y={yPos}
                        text={field.field_label}
                        fill={field.text_font_color}
                        fontFamily={field.text_font_type}
                        fontSize={Number(field.text_font_size)}
                        fontStyle="bold"
                      />
                      <Text
                        x={xPos + gap}
                        y={yPos}
                        text={displayText}
                        fill={field.text_font_color}
                        fontFamily={field.text_font_type}
                        fontSize={Number(field.text_font_size)}
                      />
                    </Group>
                  );
                })}


              </Layer>
            </Stage>
          </div>
        )}


      </div>
      <div className="card card-flush h-md-50 mb-5 mb-xl-10 flex-grow-1" id="back-id" style={{ minWidth: '350px', maxWidth: '48%' }} >
      <div className="card-header"><h2>Back Template</h2></div>
      {selectedTemplateFields && Object.entries(selectedTemplateFields).length > 0 && (
          <div style={{ width: '100%', overflow: 'auto' }}>
            <Stage width={700} height={600} ref={backRef} scale={{ x: 0.73, y: 0.61}}>
              <Layer>
                <KonvaImage width={700} height={600} image={backObjBack} />
                {image &&enableField['back']?.['photo']&& (
                  <>
                 <Circle
                         x={templates[selectedTemplate]?.imagePosition?.x + (templates[selectedTemplate]?.imageDimension?.image_width || 150) / 2}
                         y={templates[selectedTemplate]?.imagePosition?.y + (templates[selectedTemplate]?.imageDimension?.image_height || 150) / 2}
                         radius={(templates[selectedTemplate]?.imageDimension?.image_width || 150) / 2}
                         fill="white" 
                       />
                     
                       
                       <Image
                         x={templates[selectedTemplate]?.imagePosition?.x || 50}
                         y={templates[selectedTemplate]?.imagePosition?.y || 50}
                         image={image}
                         width={templates[selectedTemplate]?.imageDimension?.image_width || 150}
                         height={templates[selectedTemplate]?.imageDimension?.image_height || 150}
                         stroke={templates[selectedTemplate]?.imageMaskColor || imageMaskColor}
                         strokeWidth={templates[selectedTemplate]?.imageMaskThickness || imageMaskThickness}
                         cornerRadius={templates[selectedTemplate]?.imageCircleDiameter || imageCircleDiameter}
                         rotation={0}
                       />
                     </>
                )}
                {logo &&enableField['back']?.['logo']&& (
                  <>
                 <Circle
                         x={templates['back']?.logoPosition?.x + (templates['back']?.logoDimension?.logo_image_width || 150) / 2}
                         y={templates['back']?.logoPosition?.y + (templates['back']?.logoDimension?.logo_image_height || 150) / 2}
                         radius={(templates['back']?.logoDimension?.logo_image_width || 150) / 2}
                         fill="white" 
                       />
                     
                       
                       <Image
                         x={templates['back']?.logoPosition?.x || 50}
                         y={templates['back']?.logoPosition?.y || 50}
                         image={logo}
                         width={templates['back']?.logoDimension?.logo_image_width || 150}
                         height={templates['back']?.logoDimension?.logo_image_height || 150}
                         stroke={templates['back']?.logoMaskColor || logoMaskColor}
                         strokeWidth={templates['back']?.logoMaskThickness || logoMaskThickness}
                         cornerRadius={templates['back']?.logoCircleDiameter || logoCircleDiameter}
                         rotation={0}
                       />
                     </>
                )}
                {Object.entries(templates['back'] ).filter(([key,field])=>(
                enableField['back']?.[key]&&field?.field_label?.trim() !== "" && field?.text_positionx != null
            )).map(([key, field]) => {
              let fieldValue = "N/A"; 
              switch (field.field_name) {
                case "orgname":
                  fieldValue = orgname;
                  break;
                case "motto":
                  fieldValue = motto;
                  break;
                case "mission":
                  fieldValue = mission;
                  break;
                case "vision":
                  fieldValue = vision;
                  break;
                case "coreValue":
                  fieldValue = coreValue;
                  break;
                case "orgAddress":
                  fieldValue=orgAddress;
                  break;
                case "orgPhone":
                  fieldValue=orgPhone;
                  break;
                case "orgAddress":
                  fieldValue=orgAddress;
                  break;
                case "website":
                  fieldValue=website;
                  break;
                case "orgEmail":
                  fieldValue=orgEmail;
                  break;
                case "fax":
                  fieldValue=fax;
                  break;
                case "tin":
                  fieldValue=tin;
                  break;
                case "abbreviation":
                  fieldValue=abbreviation;
                  break;
                default:
                  fieldValue = userProfile?.[field.field_name] ?? "N/A";
              }
                  const displayText = Array.isArray(fieldValue) ? fieldValue[0] : fieldValue;
                  const xPos = Number(field.text_positionx || 0);
                  const yPos = Number(field.text_positiony || 0);
                  const gap = Number(field.gap) || 0;

                  return (
                    <Group key={key}>
                      <Text
                        x={xPos}
                        y={yPos}
                        text={field.field_label}
                        fill={field.text_font_color}
                        fontFamily={field.text_font_type}
                        fontSize={Number(field.text_font_size)}
                        fontStyle="bold"
                      />
                      <Text
                        x={xPos + gap}
                        y={yPos}
                        text={displayText}
                        fill={field.text_font_color}
                        fontFamily={field.text_font_type}
                        fontSize={Number(field.text_font_size)}
                      />
                    </Group>
                  );
                })}
              </Layer>
            </Stage>
          </div>
        )}
      </div>
      
      
    
  </div>
  <form style={{ margin: '20px auto', width: '50%' }}>
              <div className="mb-3">
                <label htmlFor="issuedate" className="form-label">Issue Date</label>
                <input
                  type="date"
                  id="issuedate"
                  className="form-control"
                  name="id_issue_date"
                  onChange={handleIdChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="expiredate" className="form-label">Expire Date</label>
                <input
                  type="date"
                  id="expiredate"
                  className="form-control"
                  name="id_expire_date"
                  onChange={handleIdChange}
                />
              </div>
            </form>

            <button className="btn btn-primary" style={{ width: '150px' }} onClick={handleCreateId}>
              Generate ID
            </button>

            <button className="btn btn-primary" style={{width:'150px'}} onClick={handleDownload}>Print ID</button>
</div>


    
</div>
    
    

   
    
  </div>

  
</div>

         
      
      
    </>
  );
}
