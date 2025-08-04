import { useEffect, useRef } from "react";


import { useState } from 'react'

import { getOrganizationInfo } from "../features/organizationSlice";
import QRCode from "react-qr-code";


import { generateId, getTemplate, getIdDetails } from '../features/idCardSlice'
import { getEmployee } from "../features/employeeSlice";
import { fetchRoles } from "../features/roleSlice";

import { useDispatch, useSelector } from 'react-redux'

import { Stage, Layer, Text, Image, Group, Image as KonvaImage, Circle } from 'react-konva'
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();
  const dispatch = useDispatch()
  const { idCards } = useSelector((state) => state.idCard);
  const { user } = useSelector((state) => state.user.user);
  const { role } = useSelector((state) => state.user.role);
  const [image, setImage] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState([]);
  const [extractData, setExtractData] = useState([]);
  const [id, setId] = useState();
  const [empId, setEmpId] = useState();
  const [selectedTemplate, setSelectedTemplate] = useState("front");
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

  const [frontImage, setFrontImage] = useState();
  const [backImage, setBackImage] = useState();
  const [badgeImage, setBadgeImage] = useState();

  const [permissions, setPermissions] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [currentRole, setCurrentRole] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let token = JSON.parse(localStorage.getItem('token'));
    if (token) {
      let userId = JSON.parse(localStorage.getItem('userId'));
      console.log(userId);
      async function fetchUser() {
        let response = await axios.get(`http://localhost:8000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        console.log(response);
        let data = response.data;
        console.log(data);
        setCurrentUser(data.user);
        setCurrentRole(data.role);
      }
      fetchUser();

    }
    else {
      console.log('no current user');
    }
  }, [user]);

  useEffect(() => {
    dispatch(fetchRoles()).then((data) => {
      const dataitem = data.payload;
      const normalizedData = Array.isArray(dataitem) ? dataitem : [dataitem];
      // setRoles(normalizedData);
      console.log(role)
      if (role && role.length !== 0) {
        console.log('non zero')
        const rolesExist = normalizedData.filter(data => role?.includes(data.name)).map(data => ({
          id: data.id,
          name: data.name,
          permissions: data.permissions
        }))
        console.log(rolesExist);
        const allPermissions = rolesExist.flatMap(role => role.permissions);
        setPermissions(allPermissions);
      }
      else {
        console.log(currentRole)
        const rolesExist = dataitem.filter(data => currentRole.includes(data.name)).map(data => ({
          id: data.id,
          name: data.name,
          permissions: data.permissions
        }))
        console.log(rolesExist);
        const allPermissions = rolesExist.flatMap(role => role.permissions);
        setPermissions(allPermissions);
      }
    }).catch((error) => {
      console.log('Error fetching data', error);
    })
      .finally(() => setIsLoading(false));
  }, [dispatch, currentRole]);


  useEffect(() => {
    dispatch(getOrganizationInfo()).then((data) => {
      const org = data.payload;
      console.log(org);
      console.log(org?.logo)
      if (org) {
        setOrgName(org.en_name);
        setMotto(org.motto);
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


  const imageFields = ['photo', 'logo'];
  const textFields = [
    'en_name', 'job_position', 'id_issue_date', 'id_expire_date', 'title',
    'sex', 'date_of_birth', 'joined_date', 'phone_number', 'organization_unit',
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
    circle_mask_thickness: 0


  }

  const textdetails = {
    //label_length: 20, //add
    text_content: null, //to be filled when generated
    text_positionx: 400,
    text_positiony: 80,
    text_font_type: 'arial',
    text_font_size: 18,
    text_font_color: 'black',
    text_gap: 200
  }

  const shareddetails = {
    type: 'active', //add- you'll use this to determine the text_content or image_file
    status: 'inactive', //to be filled when generated,
    label_length: 20
  }

  const [templates, setTemplates] = useState({
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


  const [enableField, setEnableField] = useState();
  const frontRef = useRef();
  const backRef = useRef();
  const badgeRef = useRef();
  const qrRef = useRef();

  const [qrImage, setQRImage] = useState();

  useEffect(() => {
    const canvas = qrRef.current;
    if (canvas) {
      console.log('canvas');
      const svgData = new XMLSerializer().serializeToString(canvas);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new window.Image();
      img.onload = () => {
        setQRImage(img)
        URL.revokeObjectURL(url);
      };
      img.src = url
    }
    else{
      console.log('no canvas')
    }

  }, [empId]);



  useEffect(() => {
    if (userProfile && userProfile.photo_url) {
      console.log(`http://localhost:8000/cors-image/${userProfile.photo_url}`)
      const img = new window.Image()
      img.crossOrigin = 'anonymous';
      img.src = `http://localhost:8000/cors-image/${userProfile.photo_url}`;
      img.onload = () => setImage(img)
    }
    else {
      const fallback = new window.Image()
      fallback.crossOrigin = 'anonymous';
      fallback.src = "https://th.bing.com/th/id/OIP.30Yq02E10j8tn6kKBO1qdQHaHa?rs=1&pid=ImgDetMain"
      fallback.onload = () => setImage(fallback)
    }
  }, [userProfile])
  console.log(userProfile)
  console.log(image);



  useEffect(() => {

    const querySearchParams = new URLSearchParams(window.location.search);
    const dataString = querySearchParams.get("data");

    if (dataString) {

      setId(decodeURIComponent(dataString));
    }

  }, []);

  console.log(id)

  useEffect(() => {
    setIsLoading(true)
    if (id) {
      dispatch(getEmployee({ Id: id })).then((data) => {
        console.log(data)
        const dataitem = data.payload;
        console.log(dataitem);
        if (dataitem) {
          setUserProfile(dataitem);
          console.log(dataitem)
        }
        else {
          console.log('no id found');
          setUserProfile(null);
        }

      }).finally(() => setIsLoading(false))
    }
  }, [dispatch, id, idCards])
  console.log(userProfile);

  useEffect(() => {  //get the saved template
    setIsLoading(true);
    dispatch(getTemplate()).then((action) => {
      console.log(action)
      const dataitem = action.payload;
      console.log(dataitem);
      const matchingTemplate = dataitem.find(data =>
        data.type === 'front'
      )
      console.log(matchingTemplate)
      const img = new window.Image();
      img.crossOrigin = 'anonymous'; // Optional: in case image is from another origin
      img.src = `http://localhost:8000/cors-image/${matchingTemplate.file}`;



      img.onload = () => {

        setFrontImage(img);
        setTemplateImage(img);

      };

      img.onerror = (e) => {
        console.error("Failed to load image", e);
      };

      /*if (dataitem && typeof dataitem === 'object') {
        
  
        const keys = Object.keys(dataitem);
        if (keys.length === 0) {
          console.log("No templates found.");
          settemplates(null);
        } else {
          console.log("Loaded templates:", dataitem);
          settemplates(dataitem); // optional: auto-select first template
        }
      } else {
        console.warn("Invalid template payload.");
      }*/
    }).catch((error) => {
      console.error("Error loading templates:", error);
    }).finally(() => setIsLoading(false));
  }, [dispatch, selectedTemplate]);
  console.log(templates);


  useEffect(() => {  //get the saved template
    dispatch(getTemplate()).then((action) => {
      console.log(action)
      const dataitem = action.payload;
      console.log(dataitem);
      const matchingTemplate = dataitem.find(data =>
        data.type === 'back'
      )
      console.log(matchingTemplate)
      const img = new window.Image();
      img.crossOrigin = 'anonymous'; // Optional: in case image is from another origin
      img.src = `http://localhost:8000/cors-image/${matchingTemplate.file}`;



      img.onload = () => {

        setBackImage(img);
        setTemplateImage(img);

      };

      img.onerror = (e) => {
        console.error("Failed to load image", e);
      };

      /*if (dataitem && typeof dataitem === 'object') {
        
  
        const keys = Object.keys(dataitem);
        if (keys.length === 0) {
          console.log("No templates found.");
          settemplates(null);
        } else {
          console.log("Loaded templates:", dataitem);
          settemplates(dataitem); // optional: auto-select first template
        }
      } else {
        console.warn("Invalid template payload.");
      }*/
    }).catch((error) => {
      console.error("Error loading templates:", error);
    });
  }, [dispatch, selectedTemplate]);


  useEffect(() => {  //get the saved template
    dispatch(getTemplate()).then((action) => {
      console.log(action)
      const dataitem = action.payload;
      console.log(dataitem);
      const matchingTemplate = dataitem.find(data =>
        data.type === 'badge'
      )
      console.log(matchingTemplate)
      const img = new window.Image();
      img.crossOrigin = 'anonymous'; // Optional: in case image is from another origin
      img.src = `http://localhost:8000/cors-image/${matchingTemplate.file}`;



      img.onload = () => {

        setBadgeImage(img);
        setTemplateImage(img);

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
  }, [dispatch, selectedTemplate]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
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

          if (item.field_name === "photo" || item.field_name === "logo" || item.field_name === "qrcode") {
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
              status: item.status,
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

        setTemplates((prev) => ({
          ...prev,
          ...templates // merged by template type like 'front', 'back', etc.
        }));



      } catch (error) {
        console.error("Error fetching ID details or templates:", error);
      }
    };

    fetchData();
    setIsLoading(false);
  }, [dispatch]);
  console.log(templates)

  console.log(frontImage);
  console.log(backImage);
  console.log(badgeImage);
  console.log(image);
  console.log(logo)

  const handleDownload = async () => {
    if (!frontRef.current || !backRef.current ||!badgeRef.current) {
      console.error("Stage refs not available");
      
      return;
    }

    try {

      let frontUri = await frontRef.current.toImage({ mimeType: 'image/png', pixelRatio: 2 });


      let backUri = await backRef.current.toImage({ mimeType: 'image/png', pixelRatio: 2 });

      let badgeUri=await badgeRef.current.toImage({mimeType:'image/png',pixelRatio:2});


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

      if (badgeUri instanceof HTMLImageElement || badgeUri instanceof HTMLCanvasElement) {
        const badgeCanvas = document.createElement('canvas');
        const badgeCtx = badgeCanvas.getContext('2d');
        badgeCanvas.width = badgeUri.width || badgeUri.naturalWidth;
        badgeCanvas.height = badgeUri.height || badgeUri.naturalHeight;
        badgeCtx.drawImage(badgeUri, 0, 0);
        badgeUri = badgeCanvas.toDataURL('image/png');
      } else if (typeof badgeUri === 'string') {
        badgeUri = badgeUri.trim();
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

      const badgeLink = document.createElement('a');
      badgeLink.download = `${userProfile.en_name}-badge.png`;
      badgeLink.href = badgeUri;
      document.body.appendChild(badgeLink);
      badgeLink.click();
      document.body.removeChild(badgeLink);

    } catch (error) {
      console.error("Error generating images: ", error);
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const response = await axios.get("http://localhost:8000/api/employees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data.data;
        console.log("All employees:", data);

        if (id != null) {
          console.log("ID from query:", id);
          const match = data.filter((d) => d.id == id)
          console.log("Match(es):", match);
          const empIds = match.map((d) => d.employment_id);
          const employeeId = empIds[0].toString();
          console.log("Employment ID(s):", employeeId)
          setEmpId(employeeId);
        } else {
          console.log("No ID found in URL.");
        }
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };

    if (id != null) {
      fetchEmployees();
    }
  }, [id]);

console.log(empId)





  console.log(templates)
  const selectedTemplateFields = templates[selectedTemplate] || {};
  console.log(selectedTemplateFields)


  const handleIdChange = (e) => {
    setExtractData({ ...extractData, [e.target.name]: e.target.value })
    console.log(extractData);
  }

  const handleCreateId = () => {

    const frontUri = frontRef.current.toDataURL();
    const backUri = backRef.current.toDataURL();
    const badgeUri = badgeRef.current.toDataURL();

    const images = { frontUri, backUri, badgeUri };
    console.log(images);
    dispatch(generateId({ Id: id, UserInfo: userProfile, rawData: extractData, templates: templates, Images: images }));

    setIsCreateModalOpen(false)

  }


  const [templateImage, setTemplateImage] = useState();
  const [imageMaskColor, setImageMaskColor] = useState('black');
  const [imageCircleDiameter, setImageCircleDiameter] = useState(0);
  const [imageMaskThickness, setImageMaskThickness] = useState(0);
  const [logoPosition, setLogoPosition] = useState({ x: 250, y: 50 });
  const [logoDimension, setLogoDimension] = useState({ width: 150, height: 150 });
  const [logoMask, setLogoMask] = useState(false);
  const [logoMaskThickness, setLogoMaskThickness] = useState(0);
  const [logoCircle, setLogoCircle] = useState({ is_circle: false });
  const [logoCircleDiameter, setLogoCircleDiameter] = useState(0);
  const [logoMaskColor, setLogoMaskColor] = useState('black');

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

  const Loader = () => (
    <div className="d-flex justify-content-center py-10">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );












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
              {t('idmanagement')}
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
              <li className="breadcrumb-item text-muted">{t('idmanagement')}</li>
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
              <a class="nav-link active" data-bs-toggle="tab" href="#kt_tab_pane_1">{t('employeeinformation')}</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="tab" href="#kt_tab_pane_2">{t('employeeid')}</a>
            </li>

          </ul>

          <div class="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" id="kt_tab_pane_1" role="tabpanel">
              <div className="d-flex justify-content-between align-items-start">
    <svg ref={qrRef} style={{ display: "none" }}>
                        <QRCode value={`http://localhost:5173/employeeid?data=${empId}`} />
                      </svg>
                {/* User Info Card */}
                
                <div className="card card-flush h-md-50 mb-5 mb-xl-10" style={{ width: '50%', margin: '20px auto', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>

                  {/* Card Header */}
                  <div className="card-header" style={{ backgroundColor: '#f8f9fa', padding: '10px 20px' }}>
                    <h5 className="card-title" style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>{t('employeeinformation')}</h5>
                  </div>

                  {/* Card Body */}
                  <div className="card-body pt-4 pb-4" style={{ backgroundColor: '#fff' }}>
                    <div className="mb-3">
                      {['en_name', 'title', 'date_of_birth', 'joined_date', 'job_title_category', 'salary_amount', 'marital_status', 'nation',
                        'job_position_start_date', 'job_position_end_date', 'address', 'house_number', 'region', 'zone', 'woreda',
                        'id_issue_date', 'id_expire_date'].map((field) => (
                          <p key={field} style={{ margin: '8px 0', fontSize: '1rem' }}>
                            <strong>{field.replace('_', ' ').toUpperCase()}:</strong> <span>
                              {field === 'job_position'
                                ? userProfile?.[field]?.job_description || 'N/A'
                                : typeof userProfile?.[field] === 'object'
                                  ? userProfile?.[field]?.name || 'N/A'
                                  : userProfile?.[field] || 'N/A'}

                            </span>

                          </p>
                        ))}
                    </div>
                  </div>
                </div>


                {isLoading ? (<div colSpan="8" className="text-center">
                  <Loader /> {/* Use the loader here */}
                </div>) : permissions?.some(p =>
                  p.name.includes('read IdentityCardTemplateDetail')) ? (selectedTemplateFields && Object.entries(selectedTemplateFields).length > 0 && (


                    <div className="d-flex justify-content-center"
                      style={{ width: '100%', padding: '20px' }}>
                      
                     
                      <Stage className="stage"
                        width={700}
                        height={600}
                        ref={badgeRef} scale={{ x: 0.73, y: 0.61 }}>
                        <Layer>
                          <KonvaImage width={700} height={600} scale={{ x: 0.9, y: 1 }} image={badgeImage} />
                          {image && templates?.['badge']?.['imageFields']?.['photo'] && (
                            <Image
                              x={Number(templates['badge']?.imageFields?.photo?.circle_positionx) || 50}
                              y={Number(templates['badge']?.imageFields?.photo?.circle_positiony) || 50}
                              image={image}
                              width={Number(templates['badge']?.imageFields?.photo?.image_width) || 150}
                              height={Number(templates['badge']?.imageFields?.photo?.image_height) || 150}
                              stroke={templates['badge']?.imageFields?.photo?.circle_background || 'black'}
                              strokeWidth={Number(templates['badge']?.imageFields?.photo?.circle_mask_thickness) || 0}
                              cornerRadius={Number(templates['badge']?.imageFields?.photo?.circle_diameter || imageCircleDiameter) / 2}
                              rotation={0}

                            />
                          )}

                          {(qrImage && templates?.['badge']?.imageFields?.['qrcode']?.status === 'active') && (
                            <>
                              <Image
                                image={qrImage}
                                x={templates['badge']?.imageFields?.qrcode?.circle_positionx || 50}
                                y={templates['badge']?.imageFields?.qrcode?.circle_positiony || 50}
                                width={templates['badge']?.imageFields?.qrcode?.image_width || 150}
                                height={templates['badge']?.imageFields?.qrcode?.image_height || 150} />
                            </>
                          )}




                          {logo && templates?.['badge']?.['imageFields']?.['logo'] && (
                            <Image
                              x={templates['badge']?.imageFields?.logo?.circle_positionx || 50}
                              y={templates['badge']?.imageFields?.logo?.circle_positiony || 50}
                              image={logo}
                              width={templates['badge']?.imageFields?.logo?.image_width || 150}
                              height={templates['badge']?.imageFields?.logo?.image_height || 150}
                              stroke={templates['badge']?.imageFields?.logo?.circle_background || imageMaskColor}
                              strokeWidth={templates['badge']?.imageFields?.logo?.circle_mask_thickness || 2}
                              cornerRadius={
                                //templates['badge']?.logo?.logo_is_circle
                                (templates['badge']?.imageFields?.logo?.circle_diameter || imageCircleDiameter) / 2
                                // : 0
                              }
                              rotation={0}
                            />
                          )}

                          {Object.entries(templates['badge']?.textFields).map(([key, field]) => {
                            console.log(field);
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
                                fieldValue = orgAddress;
                                break;
                              case "orgPhone":
                                fieldValue = orgPhone;
                                break;
                              case "orgAddress":
                                fieldValue = orgAddress;
                                break;
                              case "website":
                                fieldValue = website;
                                break;
                              case "orgEmail":
                                fieldValue = orgEmail;
                                break;
                              case "fax":
                                fieldValue = fax;
                                break;
                              case "tin":
                                fieldValue = tin;
                                break;
                              case "abbreviation":
                                fieldValue = abbreviation;
                                break;
                              default:
                                if (field.field_name === 'job_position') {
                                  fieldValue = userProfile?.job_position?.job_description ?? 'N/A';
                                } else if (typeof userProfile?.[field.field_name] === 'object') {
                                  fieldValue = userProfile?.[field.field_name]?.name ?? 'N/A';
                                } else {
                                  fieldValue = userProfile?.[field.field_name] ?? 'N/A';
                                }
                            }

                            const displayText = Array.isArray(fieldValue) ? fieldValue[0] : fieldValue;
                            const xPos = Number(field.text_positionx || 0);
                            const yPos = Number(field.text_positiony || 0);
                            const gap = Number(field.text_gap) || 0;

                            return (
                              <Group key={key}>
                                <Text
                                  x={xPos}
                                  y={yPos}
                                  text={field.field_label}
                                  fill={field.text_font_color || "black"}
                                  fontFamily={field.text_font_type || "Arial"}
                                  fontSize={field.text_font_size}
                                  fontStyle="bold"
                                />
                                <Text
                                  x={xPos + gap}
                                  y={yPos}
                                  text={displayText}
                                  fill={field.text_font_color || "black"}
                                  fontFamily={field.text_font_type || "Arial"}
                                  fontSize={field.text_font_size}
                                />

                              </Group>
                            );
                          })}


                        </Layer>
                      </Stage>
                    </div>
                  )) : null}
              </div>
            </div>

            <div className="tab-pane fade" id="kt_tab_pane_2" role="tabpanel">
              <div className="id-show d-flex flex-wrap gap-5 w-100">

                <div className="card card-flush h-md-50 mb-5 mb-xl-10 flex-grow-1" style={{ minWidth: '350px', maxWidth: '48%' }} >
                  <div className="card-header"><h2>{t('fronttemplate')}</h2></div>

                  {isLoading ? (<div colSpan="8" className="text-center">
                    <Loader /> {/* Use the loader here */}
                  </div>) : permissions?.some(p =>
                    p.name.includes('read IdentityCardTemplateDetail')) ? (selectedTemplateFields && Object.entries(selectedTemplateFields).length > 0 && (
                      <div style={{ width: '100%', overflow: 'auto' }}>
                        <Stage width={700} height={600} ref={frontRef} scale={{ x: 0.73, y: 0.61 }}>
                          <Layer>
                            <KonvaImage width={700} height={600} image={frontImage} />
                            {image && templates?.['front']?.['imageFields']?.['photo'] && (
                              <Image
                                x={Number(templates['front']?.imageFields?.photo?.circle_positionx) || 50}
                                y={Number(templates['front']?.imageFields?.photo?.circle_positiony) || 50}
                                image={image}
                                width={Number(templates['front']?.imageFields?.photo?.image_width) || 150}
                                height={Number(templates['front']?.imageFields?.photo?.image_height) || 150}
                                stroke={templates['front']?.imageFields?.photo?.circle_background || 'black'}
                                strokeWidth={Number(templates['front']?.imageFields?.photo?.circle_mask_thickness) || 0}
                                cornerRadius={Number(templates['front']?.imageFields?.photo?.circle_diameter || imageCircleDiameter) / 2}
                                rotation={0}

                              />
                            )}

                            {logo && templates?.['front']?.['imageFields']?.['logo'] && (
                              <Image
                                x={templates['front']?.imageFields?.logo?.circle_positionx || 50}
                                y={templates['front']?.imageFields?.logo?.circle_positiony || 50}
                                image={logo}
                                width={templates['front']?.imageFields?.logo?.image_width || 150}
                                height={templates['front']?.imageFields?.logo?.image_height || 150}
                                stroke={templates['front']?.imageFields?.logo?.circle_background || imageMaskColor}
                                strokeWidth={templates['front']?.imageFields?.logo?.circle_mask_thickness || 2}
                                cornerRadius={
                                  //templates['front']?.logo?.logo_is_circle
                                  (templates['front']?.imageFields?.logo?.circle_diameter || imageCircleDiameter) / 2
                                  // : 0
                                }
                                rotation={0}
                              />
                            )}
                            {(qrImage && templates?.['front']?.imageFields?.['qrcode']?.status === 'active') && (
                              <>
                                <Image
                                  image={qrImage}
                                  x={templates['front']?.imageFields?.qrcode?.circle_positionx || 50}
                                  y={templates['front']?.imageFields?.qrcode?.circle_positiony || 50}
                                  width={templates['front']?.imageFields?.qrcode?.image_width || 150}
                                  height={templates['front']?.imageFields?.qrcode?.image_height || 150} />
                              </>
                            )}
                            {Object.entries(templates['front']?.textFields).map(([key, field]) => {

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
                                  fieldValue = orgAddress;
                                  break;
                                case "orgPhone":
                                  fieldValue = orgPhone;
                                  break;
                                case "orgAddress":
                                  fieldValue = orgAddress;
                                  break;
                                case "website":
                                  fieldValue = website;
                                  break;
                                case "orgEmail":
                                  fieldValue = orgEmail;
                                  break;
                                case "fax":
                                  fieldValue = fax;
                                  break;
                                case "tin":
                                  fieldValue = tin;
                                  break;
                                case "abbreviation":
                                  fieldValue = abbreviation;
                                  break;
                                default:
                                  if (field.field_name === 'job_position') {
                                    fieldValue = userProfile?.job_position?.job_description ?? 'N/A';
                                  } else if (typeof userProfile?.[field.field_name] === 'object') {
                                    fieldValue = userProfile?.[field.field_name]?.name ?? 'N/A';
                                  } else {
                                    fieldValue = userProfile?.[field.field_name] ?? 'N/A';
                                  }
                              }
                              const displayText = Array.isArray(fieldValue) ? fieldValue[0] : fieldValue;
                              const xPos = Number(field.text_positionx || 0);
                              const yPos = Number(field.text_positiony || 0);
                              const gap = Number(field.text_gap) || 0;

                              return (
                                <Group key={key}>
                                  <Text
                                    x={xPos}
                                    y={yPos}
                                    text={field.field_label}
                                    fill={field.text_font_color || "black"}
                                    fontFamily={field.text_font_type || "Arial"}
                                    fontSize={field.text_font_size}
                                    fontStyle="bold"
                                  />
                                  <Text
                                    x={xPos + gap}
                                    y={yPos}
                                    text={displayText}
                                    fill={field.text_font_color || "black"}
                                    fontFamily={field.text_font_type || "Arial"}
                                    fontSize={field.text_font_size}
                                  />
                                </Group>
                              );
                            })}


                          </Layer>
                        </Stage>
                      </div>
                    )) : null}


                </div>
                <div className="card card-flush h-md-50 mb-5 mb-xl-10 flex-grow-1" id="back-id" style={{ minWidth: '350px', maxWidth: '48%' }} >
                  <div className="card-header"><h2>{t('backtemplate')}</h2></div>
                  {isLoading ? (<div colSpan="8" className="text-center">
                    <Loader /> {/* Use the loader here */}
                  </div>) : permissions?.some(p =>
                    p.name.includes('read IdentityCardTemplateDetail')) ? (selectedTemplateFields && Object.entries(selectedTemplateFields).length > 0 && (
                      <div style={{ width: '100%', overflow: 'auto' }}>
                        <Stage width={700} height={600} ref={backRef} scale={{ x: 0.73, y: 0.61 }}>
                          <Layer>
                            <KonvaImage width={700} height={600} image={backImage} />
                            {image && templates?.['back']?.['imageFields']?.['photo'] && (
                              <Image
                                x={Number(templates['back']?.imageFields?.photo?.circle_positionx) || 50}
                                y={Number(templates['back']?.imageFields?.photo?.circle_positiony) || 50}
                                image={image}
                                width={Number(templates['back']?.imageFields?.photo?.image_width) || 150}
                                height={Number(templates['back']?.imageFields?.photo?.image_height) || 150}
                                stroke={templates['back']?.imageFields?.photo?.circle_background || 'black'}
                                strokeWidth={Number(templates['back']?.imageFields?.photo?.circle_mask_thickness) || 0}
                                cornerRadius={Number(templates['back']?.imageFields?.photo?.circle_diameter || imageCircleDiameter) / 2}
                                rotation={0}

                              />
                            )}

                            {logo && templates?.['back']?.['imageFields']?.['logo'] && (
                              <Image
                                x={templates['back']?.imageFields?.logo?.circle_positionx || 50}
                                y={templates['back']?.imageFields?.logo?.circle_positiony || 50}
                                image={logo}
                                width={templates['back']?.imageFields?.logo?.image_width || 150}
                                height={templates['back']?.imageFields?.logo?.image_height || 150}
                                stroke={templates['back']?.imageFields?.logo?.circle_background || imageMaskColor}
                                strokeWidth={templates['back']?.imageFields?.logo?.circle_mask_thickness || 2}
                                cornerRadius={
                                  //templates['back']?.logo?.logo_is_circle
                                  (templates['back']?.imageFields?.logo?.circle_diameter || imageCircleDiameter) / 2
                                  // : 0
                                }
                                rotation={0}
                              />
                            )}

                            {(qrImage && templates?.['back']?.imageFields?.['qrcode']?.status === 'active') && (
                              <>
                                <Image
                                  image={qrImage}
                                  x={templates['back']?.imageFields?.qrcode?.circle_positionx || 50}
                                  y={templates['back']?.imageFields?.qrcode?.circle_positiony || 50}
                                  width={templates['back']?.imageFields?.qrcode?.image_width || 150}
                                  height={templates['back']?.imageFields?.qrcode?.image_height || 150} />
                              </>
                            )}

                            {templates?.['back']?.textFields &&
                              Object.entries(templates['back'].textFields)
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
                                      if (field.field_name === 'job_position') {
                                        fieldValue = userProfile?.job_position?.job_description ?? 'N/A';
                                      } else if (typeof userProfile?.[field.field_name] === 'object') {
                                        fieldValue = userProfile?.[field.field_name]?.name ?? 'N/A';
                                      } else {
                                        fieldValue = userProfile?.[field.field_name] ?? 'N/A';
                                      }
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
                      </div>
                    )) : null}
                </div>



              </div>
              {permissions?.some(p =>
                p.name.includes('update IdentityCardTemplateDetail') || p.name.includes('create IdentityCardTemplateDetail')) ? (<form style={{ margin: '20px auto', width: '50%' }}>
                  <div className="mb-3">
                    <label htmlFor="issuedate" className="form-label">{t('issuedate')}</label>
                    <input
                      type="date"
                      id="issuedate"
                      className="form-control"
                      name="id_issue_date"
                      onChange={handleIdChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="expiredate" className="form-label">{t('expirydate')}</label>
                    <input
                      type="date"
                      id="expiredate"
                      className="form-control"
                      name="id_expire_date"
                      onChange={handleIdChange}
                    />
                  </div>
                </form>) : null}

              {permissions?.some(p =>
                p.name.includes('update IdentityCardTemplateDetail') || p.name.includes('create IdentityCardTemplateDetail')) ? (<button className="btn btn-primary" style={{ width: '150px' }} onClick={handleCreateId}>
                  {t('generateid')}
                </button>) : null}

              <button className="btn btn-primary" style={{ width: '150px' }} onClick={handleDownload}>{t('printid')}</button>
            </div>



          </div>





        </div>


      </div>




    </>
  );
}
