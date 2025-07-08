
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../features/profileSlice";
import { getOrganizationInfo } from "../features/organizationSlice";


import { getTemplate} from '../features/idCardSlice'
import { Stage,Layer,Text,Image,Circle,Group,Image as KonvaImage } from "react-konva";

export default function EmployeeDashboard() {
    const dispatch = useDispatch();
    const [backObj,setBackObj]=useState();
    const [backObjBack,setBackObjBack]=useState();
     const [backObjBadge,setBackObjBadge]=useState();
    const [image, setImage] = useState(null);
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
      
  const [imageMaskThickness,setImageMaskThickness]=useState(0);
const [imageCircleDiameter, setImageCircleDiameter] = useState(0);
const [imageMaskColor,setImageMaskColor]=useState('black');
const [logoPosition, setLogoPosition] = useState({ x: 250, y: 50 });
  const [logoDimension,setLogoDimension]=useState({width:150,height:150});
  const [logoMask,setLogoMask]=useState(false);
  const [logoMaskThickness,setLogoMaskThickness]=useState(0);
  const [logoCircle, setLogoCircle] = useState({ is_circle: false });
const [logoCircleDiameter, setLogoCircleDiameter] = useState(0);
const [logoMaskColor,setLogoMaskColor]=useState('black');
       const [userProfile,setUserProfile]=useState([]);
       

    const logged = useSelector((state) => state.user.logged);
    const role = "human resources"//useSelector((state) => state.user.role);
    const email=useSelector((state)=>state.user.email);

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
      },[userProfile]);

    useEffect(() => {
      const img = localStorage.getItem('templateCardsback');
      console.log("Fetched from localStorage:", img);

      const loading = new window.Image();

      if (img && typeof img === 'string') {
        loading.src = img;
      } else {
        // Use a fallback image (optional)
        loading.src = '/default-back.png'; // Replace with your actual default path
      }

      console.log("Image object:", loading);
      setBackObj(loading);
    }, []);


    useEffect(() => {
      const img = localStorage.getItem('templateCardsback');
      console.log("Fetched from localStorage:", img);

      const loading = new window.Image();

      // Check if img is a valid non-null string and looks like an image URL or base64 data
      const isValidImage =
        img && typeof img === 'string' &&
        (img.startsWith('data:image') || img.startsWith('http') || img.endsWith('.jpg') || img.endsWith('.png') || img.endsWith('.jpeg'));

      if (isValidImage) {
        loading.src = img;
      } else {
        // Fallback image path in case img is null or invalid
        loading.src = '/default-back.png'; // Replace with your own default path if needed
      }

      console.log("Image object:", loading);
      setBackObjBack(loading);
    }, []);


useEffect(() => {
  const img = localStorage.getItem('templateCardsback');
  console.log("Fetched from localStorage:", img);

  const loading = new window.Image();

  // Check if img is a valid non-null string and looks like an image URL or base64 data
  const isValidImage =
    img && typeof img === 'string' &&
    (img.startsWith('data:image') || img.startsWith('http') || img.endsWith('.jpg') || img.endsWith('.png') || img.endsWith('.jpeg'));

  if (isValidImage) {
    loading.src = img;
  } else {
    // Fallback image path in case img is null or invalid
    loading.src = '/default-back.png'; // Replace with your own default path if needed
  }

  console.log("Image object:", loading);
  setBackObjBack(loading);
}, []);


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

    

    
    useEffect(() => {
        dispatch(getUserProfile({Email:email})).then((result) => {
            console.log(email)
            if (result.payload) {
              console.log(result.payload)
                setUserProfile((prevData) => ({
                    ...prevData,
                    ...result.payload
                }));
            }
        });
    }, [dispatch]);
    console.log(userProfile)

    return (
       <>
                      <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
                                    <div className="app-container container-xxl d-flex flex-stack">
                                        <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                                            <h1 className="page-heading text-dark fw-bold fs-3 my-0">
                                                 Dashboard
                                            </h1>
                                            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
                                                <li className="breadcrumb-item text-muted">
                                                    <a href="/" className="text-muted text-hover-primary">Home</a>
                                                </li>
                                                <li className="breadcrumb-item">
                                                    <span className="bullet bg-gray-400 w-5px h-2px"></span>
                                                </li>
                                                <li className="breadcrumb-item text-muted"> Dashboard</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                        <div id="kt_app_content" className="app-content flex-column-fluid">
          
            {logged && String(role).toLowerCase() === "employee" ? (
  <div id="kt_app_content_container" className="app-container container-xxl">
            <div className="row g-5 g-xl-10">
    
    <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6" id="myTab" role="tablist">
      <li className="nav-item" role="presentation">
        <button className="nav-link active" id="tab-id-tab" data-bs-toggle="tab" data-bs-target="#kt_tab_pane_1" type="button" role="tab" aria-controls="kt_tab_pane_1" aria-selected="true">
          See ID
        </button>
      </li>
      <li className="nav-item" role="presentation">
        <button className="nav-link" id="tab-badge-tab" data-bs-toggle="tab" data-bs-target="#kt_tab_pane_2" type="button" role="tab" aria-controls="kt_tab_pane_2" aria-selected="false">
          See Badge
        </button>
      </li>
    </ul>

    <div className="tab-content" id="myTabContent">
      <div className="tab-pane fade show active" id="kt_tab_pane_1" role="tabpanel" aria-labelledby="tab-id-tab">
        {/* ID Content */}
        <div id="emp-id">
            
          <div className="id" >
            <div className="front">
            <Stage width={700} height={600} >
              <Layer>
                <KonvaImage width={700} height={600} image={backObj} />
                {image &&enableField['front']?.['photo']&& (
                                  <>
                                 <Circle
                                         x={templates['front']?.imagePosition?.x + (templates['front']?.imageDimension?.image_width || 150) / 2}
                                         y={templates['front']?.imagePosition?.y + (templates['front']?.imageDimension?.image_height || 150) / 2}
                                         radius={(templates['front']?.imageDimension?.image_width || 150) / 2}
                                         fill="white" 
                                       />
                                     
                                       
                                       <Image
                                         x={templates['front']?.imagePosition?.x || 50}
                                         y={templates['front']?.imagePosition?.y || 50}
                                         image={image}
                                         width={templates['front']?.imageDimension?.image_width || 150}
                                         height={templates['front']?.imageDimension?.image_height || 150}
                                         stroke={templates['front']?.imageMaskColor || imageMaskColor}
                                         strokeWidth={templates['front']?.imageMaskThickness || imageMaskThickness}
                                         cornerRadius={templates['front']?.imageCircleDiameter || imageCircleDiameter}
                                         rotation={0}
                                       />
                                     </>
                                )}
                                {logo &&enableField['front']?.['logo'] &&(
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
                                            )}
                {Object.entries(templates['front']).filter(([key,field])=>(
                enableField['front']?.[key]&&field?.field_label?.trim() !== "" && field?.text_positionx != null
            )).map(([key, field])=> {
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
            <div className="back">
              <Stage width={700} height={600} >
                            <Layer>
                              <KonvaImage width={700} height={600} image={backObjBack} />
                              {image &&enableField['back']?.['photo']&& (
                                                <>
                                               <Circle
                                                       x={templates['back']?.imagePosition?.x + (templates['back']?.imageDimension?.image_width || 150) / 2}
                                                       y={templates['back']?.imagePosition?.y + (templates['back']?.imageDimension?.image_height || 150) / 2}
                                                       radius={(templates['back']?.imageDimension?.image_width || 150) / 2}
                                                       fill="white" 
                                                     />
                                                   
                                                     
                                                     <Image
                                                       x={templates['back']?.imagePosition?.x || 50}
                                                       y={templates['back']?.imagePosition?.y || 50}
                                                       image={image}
                                                       width={templates['back']?.imageDimension?.image_width || 150}
                                                       height={templates['back']?.imageDimension?.image_height || 150}
                                                       stroke={templates['back']?.imageMaskColor || imageMaskColor}
                                                       strokeWidth={templates['back']?.imageMaskThickness || imageMaskThickness}
                                                       cornerRadius={templates['back']?.imageCircleDiameter || imageCircleDiameter}
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
          </div>
        </div>
      </div>

      <div className="tab-pane fade" id="kt_tab_pane_2" role="tabpanel" aria-labelledby="tab-badge-tab">
        {/* Badge Content */}
        <div id="badges">
          <div className="badge">
            
            <Stage className="stage" width={700} height={600}>
                      <Layer>
                        <KonvaImage width={700} height={600} image={backObjBadge} />
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
                         {Object.entries(templates['badge']).filter(([key,field])=>(
                enableField['badge']?.[key]&&field?.field_label?.trim() !== "" && field?.text_positionx != null
            )).map(([key, field])  => {
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
        </div>
      </div>
    </div>
</div>
                                </div>):String(role).toLowerCase()==='human resources'?( <div id="kt_app_content" className="app-content flex-column-fluid">
                    <h1 className="text-center">Welcome to  Dashboard</h1>
                </div>):(<div id="kt_app_content" className="app-content flex-column-fluid">
                    <h1>Welcome to IT Staff Dashboard</h1>
                </div>)}
            </div>
           
          </>     
    );
}
