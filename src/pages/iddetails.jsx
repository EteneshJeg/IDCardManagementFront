import { useEffect,useRef } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import { useState } from "react"
import { useDispatch } from "react-redux";
import { Stage, Layer, Text, Image, Circle, Group, Image as KonvaImage } from "react-konva";
import { toast } from "react-toastify";


import { getOrganizationInfo } from "../features/organizationSlice";
import { saveTemplate, getTemplate, saveIdDetails,getIdDetails } from "../features/idCardSlice";
import QRCode from "react-qr-code";

export default function IdDetails() {
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
      document.body.removeChild(script);
    };
  }, []);

  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const qrRef=useRef();
  const [qrCodeImage,setQrCodeImage]=useState();
  const backImg = new window.Image();
  backImg.src = 'https://th.bing.com/th/id/OIP.Rv8GJCOZZhXXpr-MEfSOugAAAA?rs=1&pid=ImgDetMain'

  const [orgname, setOrgName] = useState();
  const [motto, setMotto] = useState();
  const [mission, setMission] = useState();
  const [vision, setVision] = useState();
  const [coreValue, setCoreValue] = useState();
  const [logo, setLogo] = useState();
  const [orgAddress, setOrgAddress] = useState();
  const [website, setWebsite] = useState();
  const [orgEmail, setOrgEmail] = useState();
  const [orgPhone, setOrgPhone] = useState();
  const [fax, setFax] = useState();
  const [poBox, setPoBox] = useState();
  const [tin, setTin] = useState();
  const [abbreviation, setAbbreviation] = useState();


  useEffect(() => {
    dispatch(getOrganizationInfo()).then((data) => {
      //console.log(data);
      const org = data.payload;
      console.log(org);
      
      if (org) {
        setOrgName(org.en_name);
        setMotto(org.email);
        setMission(org.mission);
        setVision(org.vision);
        setCoreValue(org.core_value);
        console.log(org.logo)
        const img = new window.Image();
img.onload = () => setLogo(img);
img.onerror = (e) => console.error('Image failed to load:', e);
img.crossOrigin = 'anonymous'; // only if you need CORS / pixel access
img.src = `http://localhost:8000/cors-logo/${org.logo}`;
		


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
  console.log(logo)


  const imageFields = ['photo', 'logo','qrcode'];
  const textFields = [
    'en_name', 'job_position', 'id_issue_date', 'id_expire_date', 'title',
    'sex', 'date_of_birth', 'joined_date', 'email', 'phone_number', 'organization_unit',
    'job_title_category', 'salary_id', 'marital_status', 'nation', 'employment_id',
    'job_position_end_date', 'job_position_start_date', 'address', 'house_number',
    'region', 'zone', 'woreda', 'orgname', 'motto', 'mission', 'vision', 'orgEmail',
    'core_value', 'orgPhone', 'orgAddress', 'website', 'fax_number', 'po_box',
    'tin', 'abbreviation'
  ];
  const photodetails = {
    image_file: null,
    image_width: 150,
    image_height: 150,
    has_mask: false,
    circle_diameter: 0,
    circle_positionx: 30,
    circle_positiony: 80,
    circle_background: 'black',
    circle_mask_thickness:0


  }

  const textdetails = {
    //label_length: 20, //add
    text_content: null, //to be filled when generated
    text_positionx: 400,
    text_positiony: 80,
    text_font_type: 'arial',
    text_font_size: 18,
    text_font_color: 'black',
    text_gap:200
  }

  const shareddetails = {
    type: 'active', //add- you'll use this to determine the text_content or image_file
    status: 'inactive', //to be filled when generated,
    label_length: 20
  }
  
  const [newTemplates, setNewTemplates] = useState({
    front: {
      imageFields: Object.fromEntries(
        imageFields.map(name => [name, {
          ...photodetails,
          ...shareddetails,
          field_label: name.replace(/_/g, ' ').toUpperCase(),
          field_name: name
        }])
      ),
      textFields: Object.fromEntries(
        textFields.map(name => [
          name,
          {
            ...textdetails,
            ...shareddetails,
            field_label: name.replace(/_/g, ' ').toUpperCase(),
            field_name: name
          }
        ])
      )
    },
    back: {
      imageFields: Object.fromEntries(
        imageFields.map(name => [name, {
          ...photodetails,
          ...shareddetails,
          field_label: name.replace(/_/g, ' ').toUpperCase(),
          field_name: name
        }])
      ),
      textFields: Object.fromEntries(
        textFields.map(name => [
          name,
          {
            ...textdetails,
            ...shareddetails,
            field_label: name.replace(/_/g, ' ').toUpperCase(),
            field_name: name
          }
        ])
      )
    },
    badge: {
      imageFields: Object.fromEntries(
        imageFields.map(name => [name, {
          ...photodetails,
          ...shareddetails,
          field_label: name.replace(/_/g, ' ').toUpperCase(),
          field_name: name
        }])
      ),
      textFields: Object.fromEntries(
        textFields.map(name => [
          name,
          {
            ...textdetails,
            ...shareddetails,
            field_label: name.replace(/_/g, ' ').toUpperCase(),
            field_name: name
          }
        ])
      )
    }
  });

  const [oldTemplates,setOldTemplates]=useState();

  console.log(newTemplates?.front?.textFields?.en_name?.field_name);


useEffect(()=>{
      const canvas=qrRef.current;
      if(canvas){
        const svgData=new XMLSerializer().serializeToString(canvas);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
        const img=new window.Image();
        img.onload=()=>{
          setQrCodeImage(img)
          URL.revokeObjectURL(url);
        };
        img.src=url
      }
      
    },[]);








  const [sampleProfile, setSampleProfile] = useState({
    en_name: 'John Doe',
    job_position: 'HR',
    phone_number: 231233442,
    address: 'NY,USA'
  })

  const loadFieldState = () => {
    const savedFieldState = JSON.parse(localStorage.getItem('enabledFields'));
    return savedFieldState ? savedFieldState : {
      en_name: false,
      title: false,
      sex: false,
      date_of_birth: false,
      joined_date: false,
      email: false,
      photo: false,
      qr_code:false,
      phone_number: false,
      organization_unit: false,
      job_position: false,
      job_title_category: false,
      salary_amount: false,
      marital_status: false,
      nation: false,
      employment_id: false,
      job_position_start_date: false,
      job_position_end_date: false,
      address: false,
      house_number: false,
      region: false,
      zone: false,
      woreda: false,
      status: false,
      id_issue_date: false,
      id_expire_date: false,
      id_status: false,


    }
  }

  const [enableField, setEnableField] = useState(loadFieldState);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });
  const [imageDimension, setImageDimension] = useState({ width: 150, height: 150 });
  const [imageMask, setImageMask] = useState(false);
  const [imageMaskThickness, setImageMaskThickness] = useState(0);
  const [imageCircle, setImageCircle] = useState({ is_circle: false });
  const [imageCircleDiameter, setImageCircleDiameter] = useState(0);
  const [imageMaskColor, setImageMaskColor] = useState('black');
  const [imageCircleBackground, setImageCircleBackground] = useState();
  const [logoPosition, setLogoPosition] = useState({ x: 250, y: 50 });
  const [logoDimension, setLogoDimension] = useState({ width: 150, height: 150 });
  const [logoMask, setLogoMask] = useState(false);
  const [logoMaskThickness, setLogoMaskThickness] = useState(0);
  const [logoCircle, setLogoCircle] = useState({ is_circle: false });
  const [logoCircleDiameter, setLogoCircleDiameter] = useState(0);
  const [logoMaskColor, setLogoMaskColor] = useState('black');
  const [circleBackground, setLogoCircleBackground] = useState();
  const [circleDiameter, setCircleDiameter] = useState();

  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("front");
  const selectedTemplateFields = newTemplates?.[selectedTemplate] || {};

  const [frontImage,setFrontImage]=useState();
  const [backImage,setBackImage]=useState();
  const [badgeImage,setBadgeImage]=useState();
  const [templateImage,setTemplateImage]=useState();
  const [logoImage,setLogoImage]=useState();

  /*useEffect(() => {
  const imageUrl = newTemplates?.[selectedTemplate]?.templateBackground?.image_file||newTemplates?.[selectedTemplate]?.templateBackground?.imageUrl;

  if (!imageUrl) {
    setTemplateImage(null);
    return;
  }

  const img = new window.Image();
  img.src = imageUrl;

  img.onload = () => {
    setTemplateImage(img);
  };

  img.onerror = () => {
    console.error("Failed to load image from template");
  };
}, [newTemplates, selectedTemplate]);*/


  const handleImageSelect = (e, viewType) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const img = new window.Image();
    img.src = reader.result;

    img.onload = () => {
      switch (viewType) {
        case 'front':
          setFrontImage(img);
          setTemplateImage(img);
          break;
        case 'back':
          setBackImage(img);
          setTemplateImage(img);
          break;
        case 'badge':
          setBadgeImage(img);
          setTemplateImage(img);
          break;
        default:
          break;
      }

      // Optional: update your template metadata (e.g., for preview)
      setNewTemplates((prev) => ({
        ...prev,
        [viewType]: {
          ...prev[viewType],
            templateBackground: {
              ...(prev[viewType]?.templateBackground || {}),
              imageUrl: file, // <-- if you want to store as base64 string
              image_file:reader.result
            },
          
        },
      }));
    };

    img.onerror = () => {
      console.error("Failed to load image");
    };
  };

  reader.readAsDataURL(file);
};

/*useEffect(() => {
  if (!logo) {
    console.log("!log")
    setLogoImage(null);
    return;
  }

  const img = new window.Image();
  img.crossOrigin = "anonymous";  // add if you get CORS issues
  img.src = logo; // logo is the URL string

  img.onload = () => {
    setLogoImage(img);
  };

  img.onerror = () => {
    console.error("Failed to load logo image", logo);
  };
}, [logo]);*/


  console.log(newTemplates?.[selectedTemplate]?.photo?.circle_positionx)


  Object.entries(selectedTemplateFields).filter(([key, field]) => enableField[selectedTemplate]?.[key]).map(([key, field]) => {
    console.log(key)
  })

  useEffect(() => {
    const img = new window.Image();
    img.src = "https://th.bing.com/th/id/OIP.30Yq02E10j8tn6kKBO1qdQHaHa?rs=1&pid=ImgDetMain";
    img.onload = () => setImage(img);
    img.onerror = () => {
  console.error("Failed to load image:", imageUrl);
};


  }, []);

  useEffect(() => {  //get the saved template
  dispatch(getTemplate()).then((action) => {
    console.log(action)
    const dataitem = action.payload;
    console.log(dataitem);
    console.log(selectedTemplate)
    const matchingTemplate=dataitem.find(data=>
      data.type===selectedTemplate
    )
    console.log(matchingTemplate)
    const img = new window.Image();
      img.crossOrigin = 'anonymous'; // Optional: in case image is from another origin
      img.src = `http://localhost:8000/cors-image/${matchingTemplate.file}`;
      


      img.onload = () => {
        if (matchingTemplate.type === 'front') {
          setFrontImage(img);
          setTemplateImage(img);
        } else if (matchingTemplate.type === 'back') {
          setBackImage(img);
          setTemplateImage(img);
        } else if (matchingTemplate.type === 'badge') {
          setBackImage(img);
          setTemplateImage(img);
        }
      };

      img.onerror = (e) => {
        console.error("Failed to load image", e);
      };
    
    /*if (dataitem && typeof dataitem === 'object') {
      

      const keys = Object.keys(dataitem);
      if (keys.length === 0) {
        console.log("No templates found.");
        setNewTemplates(null);
      } else {
        console.log("Loaded templates:", dataitem);
        setNewTemplates(dataitem); // optional: auto-select first template
      }
    } else {
      console.warn("Invalid template payload.");
    }*/
  }).catch((error) => {
    console.error("Error loading templates:", error);
  });
}, [dispatch,selectedTemplate]);
console.log('front image',frontImage)

useEffect(() => {
  const fetchData = async () => {
    try {
      const [idDetailsAction, templatesAction] = await Promise.all([
        dispatch(getIdDetails()),
        dispatch(getTemplate())
      ]);

      const idDetails = idDetailsAction.payload;
      console.log(idDetails)
      const templateList = templatesAction.payload;

      const templates = {};

      idDetails.forEach((item) => {
        const template = templateList.find((t) => t.id === item.template_id);
        const templateType = template?.type || "front";

        if (!templates[templateType]) {
          templates[templateType] = {
            imageFields: {},
            textFields: {}
          };
        }

        if (item.field_name === "photo" || item.field_name === "logo" ||item.field_name==="qrcode") {
          templates[templateType].imageFields[item.field_name] = {
            field_label: item.field_label,
            field_name: item.field_name,
            label_length: item.label_length,
            type: item.type,
            status: item.status,
            image_file: item.image_file,
            image_height: item.image_height,
            image_width: item.image_width,
            has_mask: item.has_mask,
            circle_diameter: item.circle_diameter,
            circle_mask_thickness: item.circle_mask_thickness,
            circle_positionx: item.circle_positionx,
            circle_positiony: item.circle_positiony,
            circle_background: item.circle_background
          };
        } else {
          templates[templateType].textFields[item.field_name] = {
            field_label: item.field_label,
            field_name: item.field_name,
            label_length: item.label_length,
            type: item.type,
            status:item.status,
            text_content: item.text_content,
            text_font_color: item.text_font_color,
            text_font_size: item.text_font_size,
            text_font_type: item.text_font_type,
            text_positionx: item.text_positionx,
            text_positiony: item.text_positiony,
            text_gap: item.text_gap
          };
        }
      });

      setNewTemplates((prev) => ({
        ...prev,
        ...templates // merged by template type like 'front', 'back', etc.
      }));

      setOldTemplates((prev) => ({
        ...prev,
        ...templates // merged by template type like 'front', 'back', etc.
      }));


      const enableField = {};

Object.entries(templates).forEach(([templateType, templateData]) => {
  enableField[templateType] = {};

  // Handle imageFields
  Object.entries(templateData.imageFields || {}).forEach(([fieldName, fieldData]) => {
    if (fieldData.status === "active") {
      enableField[templateType][fieldName] = true;
    }
  });

  // Handle textFields
  Object.entries(templateData.textFields || {}).forEach(([fieldName, fieldData]) => {
    if (fieldData.status === "active") {
      enableField[templateType][fieldName] = true;
    }
  });
});


setEnableField((prev)=>({
  ...prev,
  ...enableField
}))
    } catch (error) {
      console.error("Error fetching ID details or templates:", error);
    }
  };

  fetchData();
}, [dispatch]);
console.log(enableField)
console.log(newTemplates)







  




console.log(templateImage)


  const [backObj, setBackObj] = useState();

  useEffect(() => {
    const img = localStorage.getItem(`templateCards${selectedTemplate}`);
    console.log(img);
    const loading = new window.Image();
    loading.src = img;
    setBackObj(loading);
    setImageDimension({
      width: newTemplates[selectedTemplate]?.image_width || 150,
      height: newTemplates[selectedTemplate]?.image_height || 150,
    });
  }, [selectedTemplate])
  

  const handleEnableField = (e) => {
  const selectedField = e.target?.previousSibling?.value;

  if (!selectedTemplate || !selectedField) {
    console.warn("Missing selected template or field");
    return;
  }

  // Enable field toggle
  setEnableField((prev) => ({
  ...prev,
  [selectedTemplate]: {
    ...prev[selectedTemplate],
    [selectedField]: true,
  },
}));


  // Update imageFields
  if (selectedField === "photo" || selectedField === "logo" || selectedField==="qrcode") {
    setNewTemplates((prev) => {
      const template = prev?.[selectedTemplate] || {};
      const imageFields = template.imageFields || {};
      const field = imageFields[selectedField] || {};

      return {
        ...prev,
        [selectedTemplate]: {
          ...template,
          imageFields: {
            ...imageFields,
            [selectedField]: {
              ...field,
              status: "active",
            },
          },
        },
      };
    });
  }

  // Update textFields
  else {
    setNewTemplates((prev) => {
      const template = prev?.[selectedTemplate] || {};
      const textFields = template.textFields || {};
      const field = textFields[selectedField] || {};

      return {
        ...prev,
        [selectedTemplate]: {
          ...template,
          textFields: {
            ...textFields,
            [selectedField]: {
              ...field,
              status: "active",
            },
          },
        },
      };
    });
  }
};

  console.log(enableField)

  const handleDisableField = (e, key, selectedField) => {
    console.log('deselecting', selectedField);

    setEnableField((prev) => ({
      ...prev,
      [selectedTemplate]: {
        ...(prev[selectedTemplate] || {}),
        [key]: false
      }
    }));

    setNewTemplates((prev) => ({
      ...prev,
      [selectedTemplate]: {
        ...prev[selectedTemplate],
        textFields: {
          ...prev[selectedTemplate].textFields,
          [selectedField]: {
            ...prev[selectedTemplate].textFields[selectedField],
            status: "inactive",
          }
        }
      }
    }));
  }

  const handleDisableImageField = (e, side, selectedField) => {
    console.log('Disabling:', selectedField);

    setEnableField((prev) => ({
      ...prev,
      [side]: {
        ...(prev[side] || {}),
        [selectedField]: false
      }
    }));

    setNewTemplates((prev) => {
      const template = prev[side];
      const field = template.imageFields[selectedField];
      const shared = field.shareddetails || {};

      return {
        ...prev,
        [side]: {
          ...template,
          imageFields: {
            ...template.imageFields,
            [selectedField]: {
              ...field,

                status: "inactive"
              
            }
          }
        }
      };
    });
  };

  const handleTemplateChange = (e, fieldKey) => {
    const { name, value } = e.target;

    setNewTemplates(prev => {
      const currentField = prev[selectedTemplate].textFields[fieldKey];


      const isFieldLabelValid =
        name === "field_label" ? value.length <= currentField.label_length : true;


      const newValue =
        name === "text_font_size" || name.startsWith("text_position") || name === "gap"
          ? Number(value)
          : name === "field_label"
            ? isFieldLabelValid
              ? value
              : currentField[name]
            : value;

      return {
        ...prev,
        [selectedTemplate]: {
          ...prev[selectedTemplate],
          textFields: {
            ...prev[selectedTemplate].textFields,
            [fieldKey]: {
              ...currentField,
              [name]: newValue,
              field_name: currentField.field_name || fieldKey
            }
          }
        }
      };
    });
  };
  console.log(newTemplates)


  console.log(newTemplates)

  const handleImageChange = (side, fieldName, key, value) => {
  const currentField = newTemplates[side]?.imageFields?.[fieldName];

  if (!currentField) return;

  const isFieldLabelValid = key === "field_label"
    ? value.length <= (currentField.label_length ?? 255)
    : true;

  const newValue =
    key === "label_length" ||
    key.startsWith("circle_position") ||
    key === "image_height" ||
    key === "image_width" ||
    key === "circle_diameter"
      ? Number(value)
      : key === "field_label"
        ? isFieldLabelValid
          ? value
          : currentField[key]
        : value;

  setNewTemplates(prev => ({
    ...prev,
    [side]: {
      ...prev[side],
      imageFields: {
        ...prev[side].imageFields,
        [fieldName]: {
          ...currentField,
          [key]: newValue,
        },
      },
    },
  }));
};


  console.log(newTemplates);




  const handleMaskThickness = (e) => {
    const { value } = e.target;


    setImageMaskThickness(Number(value));

    setNewTemplates((prevTemplates) => ({
      ...prevTemplates,
      [selectedTemplate]: {
        ...prevTemplates[selectedTemplate],
        imageMaskThickness: Number(value),
      },
    }));
  }

  const handleLogoMaskThickness = (e) => {
    const { value } = e.target;


    setLogoMaskThickness(Number(value));

    setNewTemplates((prevTemplates) => ({
      ...prevTemplates,
      [selectedTemplate]: {
        ...prevTemplates[selectedTemplate],
        logoMaskThickness: Number(value),
      },
    }));
  }



  const handleCircle = (e, maskVal) => {
    setImageCircle((prevMask) => ({
      ...prevMask,
      is_circle: maskVal,
    }));

    setNewTemplates((prevTemplates) => ({
      ...prevTemplates,
      [selectedTemplate]: {
        ...prevTemplates[selectedTemplate],
        photo: {
          ...(prevTemplates[selectedTemplate]?.photo || {}),
          is_circle: maskVal,
        },
      },
    }));
  };

  const handleLogoCircle = (e, maskVal) => {
    setLogoCircle((prevMask) => ({
      ...prevMask,
      logo_is_circle: maskVal,
    }));

    setNewTemplates((prevTemplates) => ({
      ...prevTemplates,
      [selectedTemplate]: {
        ...prevTemplates[selectedTemplate],
        logo: {
          ...(prevTemplates[selectedTemplate]?.logo || {}),
          logo_is_circle: maskVal,
        },
      },
    }));
  };


  const handleSaveTemplateDetail = (newTemplates) => {


    /*const enabledText = () => {
      return Object.values(newTemplates[selectedTemplate]?.textFields || {})
        .filter(field => field.status === 'active');
    };

    const enabledTextName = () => {
      return Object.values(newTemplates[selectedTemplate]?.textFields || {})
        .filter(field => field.status === 'active')
        .map(field => field.field_name);
    };*/


    /*  const enabledImages = () => {
        return Object.values(newTemplates[selectedTemplate]?.imageFields || {})
          .filter(field => field.shareddetails.status === 'active')
      }*/


    //console.log(enabledText())
    //console.log(enabledImages());


    /*const detaildata = {
      field_names: textFields.map(field_name => {
        return newTemplates[selectedTemplate]?.textFields?.[field_name]
      }),
      field_labels: textFields.map(field_name => {
        return newTemplates[selectedTemplate]?.textFields?.[field_name]?.field_label
      }),
      label_lengths: textFields.map(field_name => {
        return newTemplates[selectedTemplate]?.textFields?.[field_name]?.label_length
      }),
      types: textFields.map(field_name => {
        return newTemplates[selectedTemplate]?.textFields?.[field_name]?.type
      }),
      text_positionxValues: textFields.map(field_name => {
        return newTemplates[selectedTemplate]?.textFields?.[field_name]?.text_positionx
      }),
      text_positionyValues: textFields.map(field_name => {
        return newTemplates[selectedTemplate]?.textFields?.[field_name]?.text_positiony
      }),
      text_fontTypes: textFields.map(field_name => {
        return newTemplates[selectedTemplate]?.textFields?.[field_name]?.text_font_type
      }),
      text_fontSizes: textFields.map(field_name => {
        return newTemplates[selectedTemplate]?.textFields?.[field_name]?.text_font_size
      }),
      text_fontColors: textFields.map(field_name => {
        return newTemplates[selectedTemplate]?.textFields?.[field_name]?.text_font_color
      }),
      imageWidths: imageFields.map(name => {
        return newTemplates[selectedTemplate]?.textFields?.[name]?.image_width
      }),
      imageHeights: imageFields.map(name => {
        return newTemplates[selectedTemplate]?.textFields?.[name]?.image_height
      }),
      masks: imageFields.map(name => {
        return newTemplates[selectedTemplate]?.textFields?.[name]?.has_mask
      }),
      circle_diameters: imageFields.map(name => {
        return newTemplates[selectedTemplate]?.textFields?.[name]?.circle_diameter
      }),
      circle_positionxValues: imageFields.map(name => {
        return newTemplates[selectedTemplate]?.textFields?.[name]?.circle_positionx
      }),
      circle_positionyValues: imageFields.map(name => {
        return newTemplates[selectedTemplate]?.textFields?.[name]?.circle_positiony
      }),
      circle_backgrounds: imageFields.map(name => {
        return newTemplates[selectedTemplate]?.textFields?.[name]?.circle_background
      }),
    }*/
    //console.log(enableField)
    //dispatch(saveIdDetails({Side:selectedTemplate,Text:enabledText(),TextName:enabledTextName().field_name,Image:enabledImages()}));
    console.log("template data",newTemplates);
    console.log("enabled",enableField);
    dispatch(saveIdDetails({side:selectedTemplate,detailData:newTemplates}));
  }

  const handleSaveTemplate=(newTemplates,selected)=>{
    console.log(selected)
    dispatch(saveTemplate({TemplateData:newTemplates,selected:selected,enabled:enableField}));
  }

  const handleViewTemplate = (id) => {
    setSelectedTemplate(id);
  }

const textFieldsToRender = newTemplates?.[selectedTemplate]?.textFields;

const fieldsToRender = textFieldsToRender
  ? Object.entries(textFieldsToRender).filter(
      ([key, field]) => enableField?.[selectedTemplate]?.[key]
    )
  : [];

  console.log(selectedTemplateFields)




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
              ID Details
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
              <li className="breadcrumb-item text-muted">ID Details</li>
            </ul>
          </div>



        </div>
      </div>

      {/* Page content goes here */}
      <div className="page-flexed">
        <div className="template">
          <select className='select-pag' value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
            <option value="front">Front</option>
            <option value="back">Back</option>
            <option value="badge">Badge</option>
          </select>

          

          
          {selectedTemplateFields && Object.entries(selectedTemplateFields).length > 0 && (
            <>
            <svg ref={qrRef} style={{display:"none"}}>
          <QRCode value="hi" />
        </svg>

            <Stage className="stage" width={700} height={600}>
              <Layer>
                <KonvaImage
                  image={templateImage}
                  width={700}
                  height={600}

                />
                
  {
  (
    image && 
    newTemplates?.[selectedTemplate]?.imageFields?.['photo']?.status==='active'
  ) && (
    <Image
      x={Number(newTemplates[selectedTemplate]?.imageFields?.photo?.circle_positionx) || 50}
      y={Number(newTemplates[selectedTemplate]?.imageFields?.photo?.circle_positiony) || 50}
      image={image}
      width={Number(newTemplates[selectedTemplate]?.imageFields?.photo?.image_width) || 150}
      height={Number(newTemplates[selectedTemplate]?.imageFields?.photo?.image_height) || 150}
      stroke={
        newTemplates[selectedTemplate]?.imageFields?.photo?.circle_background || imageMaskColor
      }
      strokeWidth={
        Number(newTemplates[selectedTemplate]?.imageFields?.photo?.circle_mask_thickness) || 2
      }
      cornerRadius={
        Number(newTemplates[selectedTemplate]?.imageFields?.photo?.circle_diameter || imageCircleDiameter) / 2
      }
      rotation={0}
    />
  )
}

{(qrCodeImage && newTemplates?.[selectedTemplate]?.imageFields?.['qrcode']?.status==='active')&&(
  <>
  <Image image={qrCodeImage}
 x={newTemplates[selectedTemplate]?.imageFields?.qrcode?.circle_positionx || 50} 
 y={newTemplates[selectedTemplate]?.imageFields?.qrcode?.circle_positiony || 50}
  width={newTemplates[selectedTemplate]?.imageFields?.qrcode?.image_width || 150} 
  height={newTemplates[selectedTemplate]?.imageFields?.qrcode?.image_height || 150}/>
  </>
)}






                {(
    logo && 
    newTemplates?.[selectedTemplate]?.imageFields?.['logo']?.status==='active'
  ) && (
                  <>



                    <Image
                      x={newTemplates[selectedTemplate]?.imageFields?.logo?.circle_positionx || 50}
                      y={newTemplates[selectedTemplate]?.imageFields?.logo?.circle_positiony || 50}
                      image={logo}
                      width={newTemplates[selectedTemplate]?.imageFields?.logo?.image_width || 150}
                      height={newTemplates[selectedTemplate]?.imageFields?.logo?.image_height || 150}
                      stroke={newTemplates[selectedTemplate]?.imageFields?.logo?.circle_background || imageMaskColor}
                      strokeWidth={newTemplates[selectedTemplate]?.imageFields?.logo?.circle_mask_thickness || 2}
                      cornerRadius={
                        //newTemplates[selectedTemplate]?.logo?.logo_is_circle
                           (newTemplates[selectedTemplate]?.imageFields?.logo?.circle_diameter || imageCircleDiameter) / 2
                         // : 0
                      }
                      rotation={0}
                    />
                  </>
                )}
                {newTemplates?.[selectedTemplate]?.textFields &&
  Object.entries(newTemplates[selectedTemplate].textFields)
    .filter(([_, field]) => field.status !== "inactive")
    .map(([fieldKey, field]) => {
      // Optional debugging:
      // console.log('Rendering field:', fieldKey, field);

      let fieldValue = "N/A";
      switch (field.field_name) {
        case "orgname": fieldValue = orgname; break;
        case "motto": fieldValue = motto; break;
        case "mission": fieldValue = mission; break;
        case "vision": fieldValue = vision; break;
        case "coreValue": fieldValue = coreValue; break;
        case "orgAddress": fieldValue = orgAddress; break;
        case "orgPhone": fieldValue = orgPhone; break;
        case "website": fieldValue = website; break;
        case "orgEmail": fieldValue = orgEmail; break;
        case "fax": fieldValue = fax; break;
        case "tin": fieldValue = tin; break;
        case "abbreviation": fieldValue = abbreviation; break;
        default:
          fieldValue = sampleProfile?.[field.field_name] ?? "N/A";
      }

      const displayText = Array.isArray(fieldValue)
        ? fieldValue[0]
        : (fieldValue || "N/A");

      const xPos = field.text_positionx ? Number(field.text_positionx) : 0;
      const yPos = field.text_positiony ? Number(field.text_positiony) : 0;
      const gap = Number(field.text_gap) || 0;

      return (
        <Group key={fieldKey}>
          <Text
            x={xPos}
            y={yPos}
            text={field.field_label}
            fill={field.text_font_color || "black"}
            fontFamily={field.text_font_type || "Arial"}
            fontSize={Number(field.text_font_size) || 16}
            fontStyle="bold"
          />
          <Text
            x={xPos + gap}
            y={yPos}
            text={displayText}
            fill={field.text_font_color || "black"}
            fontFamily={field.text_font_type || "Arial"}
            fontSize={Number(field.text_font_size) || 16}
          />
        </Group>
      );
    })}

              </Layer>
            </Stage>
            </>
          )}


        </div>
        <div className="template-settings">
          <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-5 fs-6">
            <li className="nav-item">
              <a className="nav-link active" data-bs-toggle="tab" href="#kt_tab_pane_4">Template</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="tab" href="#kt_tab_pane_5">Edit Details</a>
            </li>

          </ul>

          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" id="kt_tab_pane_4" role="tabpanel">
              <div className="table-responsive">
                <table className="table table-striped table-rounded">
                  <thead>
                    <tr>
                      <td>#</td>
                      <td>Template Type</td>
                      <td>File</td>
                      <td>Actions</td>
                    </tr>

                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Front Template</td>
                      <td>
                        <i
                          className="bi bi-eye-fill"
                          onClick={() => {
                            setIsViewModalOpen(true);
                            handleViewTemplate('front');
                          }}
                        ></i>


                        <div
                          className={`modal fade ${isViewModalOpen ? 'show' : ''}`}
                          tabIndex="-1"
                          id="kt_modal_1"
                          style={{ display: isViewModalOpen ? 'block' : 'none' }}
                        >
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-body">
                                {backObj && (
                                  <Stage width={300} height={200}>
                                    <Layer>
                                      <Image image={backObj} />
                                    </Layer>
                                  </Stage>
                                )}
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="btn btn-light"
                                  onClick={() => setIsViewModalOpen(false)}
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <label htmlFor="template-front">
                          <i className="bi bi-pencil-fill"></i>
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageSelect(e,"front")}
                          style={{ display: 'none' }}
                          id="template-front"
                        />
                        <label><i className="bi bi-trash-fill" onClick={() => setBackObj(null)}></i></label>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Back Template</td>
                      <td>
                        <i
                          className="bi bi-eye-fill"
                          onClick={() => {
                            setIsViewModalOpen(true);
                            handleViewTemplate('back');
                          }}
                        ></i>


                        <div
                          className={`modal fade ${isViewModalOpen ? 'show' : ''}`}
                          tabIndex="-1"
                          id="kt_modal_1"
                          style={{ display: isViewModalOpen ? 'block' : 'none' }}
                        >
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-body">
                                {backObj && (
                                  <Stage width={300} height={200}>
                                    <Layer>
                                      <Image image={backObj} />
                                    </Layer>
                                  </Stage>
                                )}
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="btn btn-light"
                                  onClick={() => setIsViewModalOpen(false)}
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <label htmlFor="template-back">
                          <i className="bi bi-pencil-fill"></i>
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageSelect(e,"back")}
                          style={{ display: 'none' }}
                          id="template-back"
                        />
                        <label><i className="bi bi-trash-fill" onClick={() => setBackObj(null)}></i></label>
                      </td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Badge Template</td>
                      <td>
                        <i
                          className="bi bi-eye-fill"
                          onClick={() => {
                            setIsViewModalOpen(true);
                            handleViewTemplate('badge');
                          }}
                        ></i>


                        <div
                          className={`modal fade ${isViewModalOpen ? 'show' : ''}`}
                          tabIndex="-1"
                          id="kt_modal_1"
                          style={{ display: isViewModalOpen ? 'block' : 'none' }}
                        >
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-body">
                                {backObj && (
                                  <Stage width={300} height={200}>
                                    <Layer>
                                      <Image image={backObj} />
                                    </Layer>
                                  </Stage>
                                )}
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="btn btn-light"
                                  onClick={() => setIsViewModalOpen(false)}
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <label htmlFor="template-badge">
                          <i className="bi bi-pencil-fill"></i>
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageSelect(e,"badge")}
                          style={{ display: 'none' }}
                          id="template-badge"
                        />
                        <label><i className="bi bi-trash-fill" onClick={() => setBackObj(null)}></i></label>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button className="btn btn-primary" onClick={() => handleSaveTemplate(newTemplates,selectedTemplate)}>Save Template</button>
              </div>

            </div>
            <div className="tab-pane fade" id="kt_tab_pane_5" role="tabpanel">
              <label>Choose fields to include</label>
              <select className="form-select">
                <option value="photo" name="photo">Image</option>
                <option value="qrcode" name="qrcode">QRCode</option>
                <option value="en_name" name="en_name">Name</option>
                <option value="job_position" name="job_position">Role</option>
                <option value="id_issue_date" name="id_issue_date">Issue Date</option>
                <option value="id_expire_date" name="id_expire_date">Expiry Date</option>
                <option value="phone_number" name="phone_number">Phone Number</option>
                <option value="email" name="email">Email Address</option>
                <option value="address" name="address">Address</option>
                <option value="sex" name="sex">Sex</option>
                <option value="title" name="title">Title</option>
                <option value="date_of_birth" name="date_of_birth">Date of Birth</option>
                <option value="joined_date" name="joined_date">Joined Date</option>
                <option value="job_title_category" name="job_title_category">Job Title Category</option>
                <option value="nation" name="nation">Nation</option>
                <option value="region" name="region">Region</option>
                <option value="zone" name="zone">Zone</option>
                <option value="woreda" name="woreda">Woreda</option>
                <option value="house_number" name="house_number">House Number</option>
                <option value="marital_status" name="marital_status">Marital Status</option>
                <option value="salary_amount" name="salary_amount">Salary ID</option>
                <option value="job_position_start_date" name="job_position_start_date">Job Position Start Date</option>
                <option value="job_position_end_date" name="job_position_end_date">Job Position End Date</option>
                <option value="employment_id" name="employment_id">Employment ID</option>
                <option value="organization_unit" name="organization_unit">Organization Unit</option>
                <option value="orgname" name="orgname">Organization Name</option>
                <option value="motto" name="motto">Motto</option>
                <option value="mission" name="mission">Mission</option>
                <option value="vision" name="vision">Vision</option>
                <option value="coreValue" name="coreValue">Core Value</option>
                <option value="logo" name="logo">Logo</option>
                <option value="orgAddress" name="orgAddress"> Organization Address</option>
                <option value="website" name="website">Website</option>
                <option value="orgPhone" name="orgPhone">Organization Phone</option>
                <option value="fax" name="fax">Fax number</option>
                <option value="poBox" name="poBox">P.O.Box</option>
                <option value="tin" name="tin">Tin Number</option>
                <option value="abbreviation" name="abbreviation">Abbreviation</option>

              </select>
              <button className="btn btn-primary" onClick={(e) => handleEnableField(e)}>Add Field</button>
              {enableField[selectedTemplate]?.['photo'] && (<Group className="controls">
                <Group>
                  <details className="collapsable">
                    <summary className="field" style={{ display: 'flex', alignItems: 'center', padding: '10px', cursor: 'pointer' }}>
                      <i className="bi bi-x-lg" onClick={(e) => handleDisableImageField(e, selectedTemplate, 'photo')} style={{ marginRight: '8px' }}></i>
                      {newTemplates[selectedTemplate]?.['photo']?.field_label || 'PHOTO'}
                    </summary>


                    <div className="nested-fields">

                      <input
                        type="radio"
                        name="type"
                        className="form-control"
                        value="text"
                        checked={newTemplates[selectedTemplate]?.imageFields?.['photo'].type === "text"}
                        onChange={(e) => handleImageChange(selectedTemplate, 'photo',e.target.name,e.target.value)} />Text

                      <input
                        type="radio"
                        name="type"
                        className="form-control"
                        value="number"
                        checked={newTemplates[selectedTemplate]?.imageFields?.['photo'].type === "number"}
                        onChange={(e) => handleImageChange(selectedTemplate, 'photo',e.target.name,e.target.value)} />Number

                      <input
                        type="radio"
                        name="type"
                        className="form-control"
                        value="image"
                        checked={newTemplates[selectedTemplate]?.imageFields?.['photo'].type === "image"}
                        onChange={(e) => handleImageChange(selectedTemplate, 'photo',e.target.name,e.target.value)} />Image

                      <details className="collapsable">
                        <summary className="field">Field Label</summary>
                        <input
                          type="text"
                          className="form-control"
                          name="field_label"
                          //value={newTemplates[selectedTemplate]['photo']?.circle_positionx }
                          onChange={(e) =>
                            handleImageChange(selectedTemplate, 'photo', e.target.name, e.target.value)
                          }
                        />
                      </details>

                      <details className="collapsable">
                        <summary className="field">Label Length</summary>
                        <input
                          type="number"
                          className="form-control"
                          name="label_length"
                          //value={newTemplates[selectedTemplate]['photo']?.circle_positionx }
                          onChange={(e) =>
                            handleImageChange(selectedTemplate, 'photo', e.target.name, e.target.value)
                          }
                        />
                      </details>

                      <details className="collapsable">
                        <summary className="field">Image X Position</summary>
                        <input
                          type="number"
                          className="form-control"
                          name="circle_positionx"
                          //value={newTemplates[selectedTemplate]['photo']?.circle_positionx }
                          onChange={(e) =>
                            handleImageChange(selectedTemplate, 'photo', e.target.name, e.target.value)
                          }
                        />
                      </details>
                      <details className="collapsable">
                        <summary className="field">Image Y Position</summary>
                        <input
                          type="number"
                          className="form-control"
                          name="circle_positiony"
                          onChange={(e) => handleImageChange(selectedTemplate, 'photo', e.target.name, e.target.value)}


                        />
                      </details>

                      <details className="collapsable">
                        <summary className="field">Image Width</summary>
                        <input
                          type="number"
                          className="form-control"
                          name="image_width"
                          onChange={(e) => handleImageChange(selectedTemplate, 'photo', e.target.name, e.target.value)}

                          placeholder="width"
                        />
                      </details>

                      <details className="collapsable">
                        <summary className="field">Image Height</summary>
                        <input
                          type="number"
                          className="form-control"
                          name="image_height"
                          onChange={(e) => handleImageChange(selectedTemplate, 'photo', e.target.name, e.target.value)}

                          placeholder="height"
                        />
                      </details>

                      <details className="collapsable">
                        <summary className="field">Mask</summary>
                        <label>
                          <input
                            type="radio"
                            name="has_mask"
                            className="form-control"
                            onChange={(e) => handleImageChange(selectedTemplate, 'photo', e.target.name, true)}
                          />
                          Apply
                        </label>

                        <label style={{ marginLeft: '1rem' }}>
                          <input
                            type="radio"
                            name="has_mask"
                            className="form-control"
                            onChange={(e) => handleImageChange(selectedTemplate, 'photo', e.target.name, false)}
                          />
                          Disable
                        </label>

                      </details>
                      <details className="collapsable">
                        <summary className="field">Mask thickness</summary>
                        <input
                          type="number"
                          className="form-control"
                          name="circle_mask_thickness"
                          onChange={(e) => handleImageChange(selectedTemplate, 'photo', e.target.name,e.target.value)}

                          disabled={!newTemplates[selectedTemplate]?.imageFields?.photo?.has_mask}

                        />
                      </details>
                      <details className="collapsable">
                        <summary className="field">Mask color</summary>
                        <input
                          type="color"
                          className="form-control"
                          name="circle_background"
                          onChange={(e) => handleImageChange(selectedTemplate, 'photo', e.target.name, e.target.value)}
                          disabled={!newTemplates[selectedTemplate]?.imageFields?.photo?.has_mask}

                        />
                      </details>

                      <details className="collapsable">
                        <summary className="field">Circle</summary>
                        <label>
                          <input
                            type="radio"
                            className="form-control"
                            name="is_circle"

                            onChange={(e) => handleCircle(e, true)}
                          />
                          Apply
                        </label>

                        <label style={{ marginLeft: '1rem' }}>
                          <input
                            type="radio"
                            className="form-control"
                            name="is_circle"

                            onChange={(e) => handleCircle(e, false)}
                          />
                          Disable
                        </label>

                      </details>
                      <details className="collapsable">
                        <summary className="field">Circle Diameter</summary>
                        <input
                          type="number"
                          className="form-control"
                          name="circle_diameter"
                          onChange={(e) => handleImageChange(selectedTemplate, 'photo', e.target.name, e.target.value)}
                         // disabled={!newTemplates[selectedTemplate]?.photo?.is_circle}
                        />
                      </details>


                    </div>
                  </details>


                </Group>

              </Group>)}


              {enableField[selectedTemplate]?.['qrcode'] && (<Group className="controls">
                <Group>
                  <details className="collapsable">
                    <summary className="field" style={{ display: 'flex', alignItems: 'center', padding: '10px', cursor: 'pointer' }}>
                      <i className="bi bi-x-lg" onClick={(e) => handleDisableImageField(e, 'front', 'qrcode')} style={{ marginRight: '8px' }}></i>
                      {newTemplates[selectedTemplate]?.['qrcode']?.field_label || 'qrcode'}
                    </summary>


                    <div className="nested-fields">

                      <input
                        type="radio"
                        name="type"
                        className="form-control"
                        value="text"
                        checked={newTemplates[selectedTemplate]?.imageFields?.['qrcode']?.type === "text"}
                        onChange={(e) => handleImageChange(selectedTemplate, 'qrcode',e.target.name,e.target.value)} />Text

                      <input
                        type="radio"
                        name="type"
                        className="form-control"
                        value="number"
                        checked={newTemplates[selectedTemplate]?.imageFields?.['qrcode']?.type === "number"}
                        onChange={(e) => handleImageChange(selectedTemplate, 'qrcode',e.target.name,e.target.value)} />Number

                      <input
                        type="radio"
                        name="type"
                        className="form-control"
                        value="image"
                        checked={newTemplates[selectedTemplate]?.imageFields?.['qrcode']?.type === "image"}
                        onChange={(e) => handleImageChange(selectedTemplate, 'qrcode',e.target.name,e.target.value)} />Image

                      <details className="collapsable">
                        <summary className="field">Field Label</summary>
                        <input
                          type="text"
                          className="form-control"
                          name="field_label"
                          //value={newTemplates[selectedTemplate]['qrcode']?.circle_positionx }
                          onChange={(e) =>
                            handleImageChange(selectedTemplate, 'qrcode', e.target.name, e.target.value)
                          }
                        />
                      </details>

                      <details className="collapsable">
                        <summary className="field">Label Length</summary>
                        <input
                          type="number"
                          className="form-control"
                          name="label_length"
                          //value={newTemplates[selectedTemplate]['qrcode']?.circle_positionx }
                          onChange={(e) =>
                            handleImageChange(selectedTemplate, 'qrcode', e.target.name, e.target.value)
                          }
                        />
                      </details>

                      <details className="collapsable">
                        <summary className="field">Image X Position</summary>
                        <input
                          type="number"
                          className="form-control"
                          name="circle_positionx"
                          //value={newTemplates[selectedTemplate]['qrcode']?.circle_positionx }
                          onChange={(e) =>
                            handleImageChange(selectedTemplate, 'qrcode', e.target.name, e.target.value)
                          }
                        />
                      </details>
                      <details className="collapsable">
                        <summary className="field">Image Y Position</summary>
                        <input
                          type="number"
                          className="form-control"
                          name="circle_positiony"
                          onChange={(e) => handleImageChange(selectedTemplate, 'qrcode', e.target.name, e.target.value)}


                        />
                      </details>

                      <details className="collapsable">
                        <summary className="field">Image Width</summary>
                        <input
                          type="number"
                          className="form-control"
                          name="image_width"
                          onChange={(e) => handleImageChange(selectedTemplate, 'qrcode', e.target.name, e.target.value)}

                          placeholder="width"
                        />
                      </details>

                      <details className="collapsable">
                        <summary className="field">Image Height</summary>
                        <input
                          type="number"
                          className="form-control"
                          name="image_height"
                          onChange={(e) => handleImageChange(selectedTemplate, 'qrcode', e.target.name, e.target.value)}

                          placeholder="height"
                        />
                      </details>

                      <details className="collapsable">
                        <summary className="field">Mask</summary>
                        <label>
                          <input
                            type="radio"
                            name="has_mask"
                            className="form-control"
                            onChange={(e) => handleImageChange(selectedTemplate, 'qrcode', e.target.name, true)}
                          />
                          Apply
                        </label>

                        <label style={{ marginLeft: '1rem' }}>
                          <input
                            type="radio"
                            name="has_mask"
                            className="form-control"
                            onChange={(e) => handleImageChange(selectedTemplate, 'qrcode', e.target.name, false)}
                          />
                          Disable
                        </label>

                      </details>
                      <details className="collapsable">
                        <summary className="field">Mask thickness</summary>
                        <input
                          type="number"
                          className="form-control"
                          name="circle_mask_thickness"
                          onChange={(e) => handleImageChange(selectedTemplate, 'qrcode', e.target.name,e.target.value)}

                          disabled={!newTemplates[selectedTemplate]?.imageFields?.qrcode?.has_mask}

                        />
                      </details>
                      <details className="collapsable">
                        <summary className="field">Mask color</summary>
                        <input
                          type="color"
                          className="form-control"
                          name="circle_background"
                          onChange={(e) => handleImageChange(selectedTemplate, 'qrcode', e.target.name, e.target.value)}
                          disabled={!newTemplates[selectedTemplate]?.imageFields?.qrcode?.has_mask}

                        />
                      </details>

                      <details className="collapsable">
                        <summary className="field">Circle</summary>
                        <label>
                          <input
                            type="radio"
                            className="form-control"
                            name="is_circle"

                            onChange={(e) => handleCircle(e, true)}
                          />
                          Apply
                        </label>

                        <label style={{ marginLeft: '1rem' }}>
                          <input
                            type="radio"
                            className="form-control"
                            name="is_circle"

                            onChange={(e) => handleCircle(e, false)}
                          />
                          Disable
                        </label>

                      </details>
                      <details className="collapsable">
                        <summary className="field">Circle Diameter</summary>
                        <input
                          type="number"
                          className="form-control"
                          name="circle_diameter"
                          onChange={(e) => handleImageChange(selectedTemplate, 'qrcode', e.target.name, e.target.value)}
                         // disabled={!newTemplates[selectedTemplate]?.photo?.is_circle}
                        />
                      </details>


                    </div>
                  </details>


                </Group>

              </Group>)}


              {enableField[selectedTemplate]?.['logo'] && (<Group className="controls">

                <Group>
                  <details className="collapsable">
                    <summary className="field" style={{ display: 'flex', alignItems: 'center', padding: '10px', cursor: 'pointer' }}>
                      <i className="bi bi-x-lg" onClick={(e) => handleDisableImageField(e, 'front', 'logo')} style={{ marginRight: '8px' }}></i>
                      {newTemplates[selectedTemplate]?.['logo']?.field_label || 'LOGO'}
                    </summary>


                    <div className="nested-fields">

                      <input
                        type="radio"
                        name="type"
                        className="form-control"
                        value="text"
                        checked={newTemplates[selectedTemplate]?.imageFields?.['logo'].type === "text"}
                        onChange={(e) => handleImageChange(selectedTemplate, 'logo',e.target.name,e.target.value)} />Text

                      <input
                        type="radio"
                        name="type"
                        className="form-control"
                        value="number"
                        checked={newTemplates[selectedTemplate]?.imageFields?.['logo'].type === "number"}
                        onChange={(e) => handleImageChange(selectedTemplate, 'logo',e.target.name,e.target.value)} />Number

                      <input
                        type="radio"
                        name="type"
                        className="form-control"
                        value="image"
                        checked={newTemplates[selectedTemplate]?.imageFields?.['logo'].type === "image"}
                        onChange={(e) => handleImageChange(selectedTemplate, 'logo',e.target.name,e.target.value)} />Image

                      <details className="collapsable">
                        <summary className="field">Field Label</summary>
                        <input
                          type="text"
                          className="form-control"
                          name="field_label"
                          //value={newTemplates[selectedTemplate]['photo']?.circle_positionx }
                          onChange={(e) =>
                            handleImageChange(selectedTemplate, 'logo', e.target.name, e.target.value)
                          }
                        />
                      </details>

                      <details className="collapsable">
                        <summary className="field">Label length</summary>
                        <input
                          type="number"
                          className="form-control"
                          name="label_length"
                          //value={newTemplates[selectedTemplate]['photo']?.circle_positionx }
                          onChange={(e) =>
                            handleImageChange(selectedTemplate, 'logo', e.target.name, e.target.value)
                          }
                        />
                      </details>

                      <details className="collapsable">
                        <summary className="field">Logo X Position</summary>
                        <input
                          type="number"
                          className="form-control"
                          name="circle_positionx"
                          onChange={(e) => handleImageChange(selectedTemplate, 'logo', e.target.name, e.target.value)}

                          placeholder="x-axis"

                        />
                      </details>
                      <details className="collapsable">
                        <summary className="field">Logo Y Position</summary>
                        <input
                          type="number"
                          className="form-control"
                          name="circle_positiony"
                          onChange={(e) => handleImageChange(selectedTemplate, 'logo', e.target.name, e.target.value)}


                        />
                      </details>

                      <details className="collapsable">
                        <summary className="field">Logo Width</summary>
                        <input
                          type="number"
                          className="form-control"
                          name="image_width"
                          onChange={(e) => handleImageChange(selectedTemplate, 'logo', e.target.name, e.target.value)}

                          placeholder="width"
                        />
                      </details>

                      <details className="collapsable">
                        <summary className="field">Logo Height</summary>
                        <input
                          type="number"
                          className="form-control"
                          name="image_height"
                          onChange={(e) => handleImageChange(selectedTemplate, 'logo', e.target.name, e.target.value)}

                          placeholder="height"
                        />
                      </details>

                      <details className="collapsable">
                        <summary className="field">Mask</summary>
                        <label>
                          <input
                            type="radio"
                            className="form-control"
                            name="has_mask"

                            onChange={(e) => handleImageChange(selectedTemplate, 'logo', e.target.name, true)}
                          />
                          Apply
                        </label>

                        <label style={{ marginLeft: '1rem' }}>
                          <input
                            type="radio"
                            className="form-control"
                            name="has_mask"

                            onChange={(e) => handleImageChange(selectedTemplate, 'logo', e.target.name, false)}
                          />
                          Disable
                        </label>

                      </details>
                      <details className="collapsable">
                        <summary className="field">Mask thickness</summary>
                        <input
                          type="number"
                          className="form-control"
                          name="circle_mask_thickness"
                          onChange={(e) => handleImageChange(selectedTemplate, 'logo', e.target.name,e.target.value)}

                          disabled={!newTemplates[selectedTemplate]?.imageFields?.logo?.has_mask}

                        />
                      </details>
                      <details className="collapsable">
                        <summary className="field">Mask color</summary>
                        <input
                          type="color"
                          className="form-control"
                          name="circle_background"
                          onChange={(e) => handleImageChange(selectedTemplate, 'logo', e.target.name, e.target.value)}
                          disabled={!newTemplates[selectedTemplate]?.imageFields?.logo?.has_mask}

                        />
                      </details>

                      <details className="collapsable">
                        <summary className="field">Circle</summary>
                        <label>
                          <input
                            type="radio"
                            className="form-control"
                            name="logo_is_circle"

                            onChange={(e) => handleLogoCircle(e, true)}
                          />
                          Apply
                        </label>

                        <label style={{ marginLeft: '1rem' }}>
                          <input
                            type="radio"
                            className="form-control"
                            name="logo_is_circle"

                            onChange={(e) => handleLogoCircle(e, false)}
                          />
                          Disable
                        </label>

                      </details>
                      <details className="collapsable">
                        <summary className="field">Circle Diameter</summary>
                        <input
                          type="number"
                          className="form-control"
                          name="circle_diameter"
                          onChange={(e) => handleImageChange(selectedTemplate, 'logo', e.target.name, e.target.value)}
                          //disabled={!newTemplates[selectedTemplate]?.logo?.logo_is_circle}
                        />
                      </details>

                    </div>
                  </details>


                </Group>

              </Group>)}

              <div className="temp-settings">
                {fieldsToRender.map(([key, field]) => (
                  <div key={key}>
                    <details className="collapsable">

                      <summary className="field" style={{ display: 'flex', alignItems: 'center', padding: '10px', cursor: 'pointer' }}>
                        <i className="bi bi-x-lg" onClick={(e) => handleDisableField(e, key, field.field_name)} style={{ marginRight: '8px' }}></i>
                        {console.log('LABEL:', field.field_label)
                        }
                        {field.field_label}
                      </summary>

                      <input
                        type="radio"
                        name="type"
                        className="form-control"
                        value="text"
                        checked={field.type === "text"}
                        onChange={(e) => handleTemplateChange(e, key)} />Text

                      <input
                        type="radio"
                        name="type"
                        className="form-control"
                        value="number"
                        checked={field.type === "number"}
                        onChange={(e) => handleTemplateChange(e, key)} />Number

                      <input
                        type="radio"
                        name="type"
                        className="form-control"
                        value="image"
                        checked={field.type === "image"}
                        onChange={(e) => handleTemplateChange(e, key)} />Image

                      <label className="field">X Position</label>
                      <input
                        type="number"
                        className="form-control"
                        name="text_positionx"
                        value={field.text_positionx ?? ''}
                        onChange={(e) => handleTemplateChange(e, key)}

                      />
                      <label className="field">Y Position</label>
                      <input
                        type="number"
                        className="form-control"
                        name="text_positiony"
                        value={field.text_positiony ?? ''}
                        onChange={(e) => handleTemplateChange(e, key)}

                      />
                      <label className="field">Font Size</label>
                      <input
                        type="number"
                        className="form-control"
                        name="text_font_size"
                        value={field.text_font_size ?? ''}
                        onChange={(e) => handleTemplateChange(e, key)}

                      />
                      <label className="field">Label length</label>
                      <input type="number"
                        className="form-control"
                        name="label_length"
                        value={field.label_length ?? 'Label length'}
                        onChange={(e) => handleTemplateChange(e, key)} />
                        <label className="field">Field Label</label>
                      <input
                        type="text"
                        className="form-control"
                        name="field_label"
                        value={field.field_label ?? ''}
                        onChange={(e) => handleTemplateChange(e, key)} />
                        <label className="field">Font Color</label>
                      <input
                        type="color"
                        className="form-control"
                        name="text_font_color"
                        value={field.text_font_color ?? ''}
                        onChange={(e) => handleTemplateChange(e, key)}
                      />
                      <label className="field">Text gap</label>
                      <input
                        type="number"
                        className="form-control"
                        name="text_gap"
                        value={field.text_gap ?? ''}
                        onChange={(e) => handleTemplateChange(e, key)} />
                        <label className="field">Font Type</label>
                      <select
                        name="text_font_type"
                        value={field.text_font_type ?? ''}
                        onChange={(e) => handleTemplateChange(e, key)}
                        className="form-select"
                      >
                        <option value="arial">Arial</option>
                        <option value="calibri">Calibri</option>
                        <option value="gothic">Gothic</option>
                      </select>

                    </details>


                  </div>
                ))}
                <button className="btn btn-primary" onClick={() => handleSaveTemplateDetail(newTemplates)}>Update</button>

              </div>
            </div>

          </div>
        </div>

      </div>








    </>
  );
}
