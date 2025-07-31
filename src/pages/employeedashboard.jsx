
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../features/idCardSlice";
import { getOrganizationInfo } from "../features/organizationSlice";
import QRCode from "react-qr-code"
import { useTranslation } from "react-i18next";


import { getTemplate, getIdDetails } from '../features/idCardSlice'
import { Stage, Layer, Text, Image, Circle, Group, Image as KonvaImage } from "react-konva";

export default function EmployeeDashboard() {

  const { t } = useTranslation();

  const dispatch = useDispatch();
  const qrRef = useRef();
  const { user } = useSelector((state) => state.user.user);
  const [frontImage, setFrontImage] = useState();
  const [backImage, setBackImage] = useState();
  const [badgeImage, setBadgeImage] = useState();
  const [image, setImage] = useState(null);
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
  const [currentUser, setCurrentUser] = useState();
  const [currentRole, setCurrentRole] = useState();

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


  useEffect(() => {
    dispatch(getOrganizationInfo()).then((data) => {
      const org = data.payload;

      if (org) {
        setOrgName(org.en_name);
        setMotto(org.motto);
        setMission(org.mission);
        setVision(org.vision);
        setCoreValue(org.core_value);
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

  const [userProfile, setUserProfile] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const logged = useSelector((state) => state.user.logged);
  const role = useSelector((state) => state.user.role);
  const employeeId = useSelector((state) => state.user.employee_id);
  const [selectedTemplate, setSelectedTemplate] = useState("front");
  const selectedTemplateFields = templates[selectedTemplate] || {};
  const [qrImage, setQRImage] = useState();

  console.log(userProfile)
  useEffect(() => {
    if (
      logged &&
      role.includes("Employee") &&
      String(userProfile?.id_status).toLowerCase() === "active" &&
      qrRef.current
    ) {
      const svgData = new XMLSerializer().serializeToString(qrRef.current);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new window.Image();
      img.onload = () => {
        setQRImage(img);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  }, [logged, role, userProfile]);


  useEffect(() => {
    console.log(qrImage)
  }, [qrImage])


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
    console.log(currentRole);
  }, [currentRole])

  useEffect(() => {  //get the saved template
    setIsLoading(true)
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
      };

      img.onerror = (e) => {
        console.error("Failed to load image", e);
      };
    }).catch((error) => {
      console.error("Error loading templates:", error);
    }).finally(() => setIsLoading(false));
  }, [dispatch]);

  useEffect(() => {  //get the saved template
    setIsLoading(true);
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
      };

      img.onerror = (e) => {
        console.error("Failed to load image", e);
      };
    }).catch((error) => {
      console.error("Error loading templates:", error);
    }).finally(() => setIsLoading(false));
  }, [dispatch]);

  useEffect(() => {  //get the saved template
    setIsLoading(true)
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
      };

      img.onerror = (e) => {
        console.error("Failed to load image", e);
      };
    }).catch((error) => {
      console.error("Error loading templates:", error);
    }).finally(() => setIsLoading(false));
  }, [dispatch]);
  console.log(templates);

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
  }, [dispatch]);


  useEffect(() => {
    setIsLoading(true)
    if (employeeId) {
      dispatch(getProfile({ Id: employeeId })).then((data) => {
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

      })
    }
  }, [dispatch])

  const Loader = () => (
    <div className="d-flex justify-content-center py-10">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  console.log(userProfile)
  const userRole = role.length !== 0 ? role : currentRole?.[0]
  console.log(userRole);

  return (
    <>
      <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
        <div className="app-container container-xxl d-flex flex-stack">
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
            <h1 className="page-heading text-dark fw-bold fs-3 my-0">
              {t('dashboard')}
            </h1>
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
              <li className="breadcrumb-item text-muted">
                <a href="/" className="text-muted text-hover-primary">{t('home')}</a>
              </li>
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted"> {t('dashboard')}</li>
            </ul>
          </div>
        </div>
      </div>
      <div id="kt_app_content" className="app-content flex-column-fluid">

        {logged && (role.includes("Employee") || currentRole?.includes("Employee")) && String(userProfile?.id_status).toLowerCase() === 'active' ? (
          <div id="kt_app_content_container" className="app-container container-xxl">
            <div className="row g-5 g-xl-10">


              <QRCode
                ref={qrRef}
                style={{ display: "none" }}
                value={`http://localhost:5173/employeeid?data=${userProfile.employment_id}`}
              />

              <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button className="nav-link active" id="tab-id-tab" data-bs-toggle="tab" data-bs-target="#kt_tab_pane_1" type="button" role="tab" aria-controls="kt_tab_pane_1" aria-selected="true">
                    {t('seeId')}
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="tab-badge-tab" data-bs-toggle="tab" data-bs-target="#kt_tab_pane_2" type="button" role="tab" aria-controls="kt_tab_pane_2" aria-selected="false">
                    {t('seeBadge')}
                  </button>
                </li>
              </ul>

              <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="kt_tab_pane_1" role="tabpanel" aria-labelledby="tab-id-tab">


                  {/* ID Content */}
                  <div id="emp-id">

                    <div className="id" >
                      <div className="front">
                        {isLoading ? (<div colSpan="8" className="text-center">
                          <Loader /> {/* Use the loader here */}
                        </div>) : selectedTemplateFields && Object.entries(selectedTemplateFields).length > 0 && (
                          <div style={{ width: '100%', overflow: 'auto' }}>
                            <Stage className="stage" width={700} height={600}>
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
                                    cornerRadius={Number(templates['front']?.imageFields?.photo?.circle_diameter || 0) / 2}
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
                                    stroke={templates['front']?.imageFields?.logo?.circle_background || 'black'}
                                    strokeWidth={templates['front']?.imageFields?.logo?.circle_mask_thickness || 2}
                                    cornerRadius={
                                      //templates['front']?.logo?.logo_is_circle
                                      (templates['front']?.imageFields?.logo?.circle_diameter || 0) / 2
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
                                  console.log(fieldValue)
                                  const displayText = Array.isArray(fieldValue) ? fieldValue[0] : fieldValue;
                                  console.log(displayText)
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
                        )}

                      </div>
                      <div className="back">
                        {isLoading ? (<div colSpan="8" className="text-center">
                          <Loader /> {/* Use the loader here */}
                        </div>) : selectedTemplateFields && Object.entries(selectedTemplateFields).length > 0 && (
                          <div style={{ width: '100%', overflow: 'auto' }}>
                            <Stage className="stage" width={700} height={600}>
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
                                    cornerRadius={Number(templates['back']?.imageFields?.photo?.circle_diameter || 0) / 2}
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
                                    stroke={templates['back']?.imageFields?.logo?.circle_background || 'black'}
                                    strokeWidth={templates['back']?.imageFields?.logo?.circle_mask_thickness || 2}
                                    cornerRadius={
                                      //templates['back']?.logo?.logo_is_circle
                                      (templates['back']?.imageFields?.logo?.circle_diameter || 0) / 2
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
                                      height={templates['back']?.imageFields?.qrcode?.image_height || 150}
                                    />
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
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tab-pane fade" id="kt_tab_pane_2" role="tabpanel" aria-labelledby="tab-badge-tab">
                  {/* Badge Content */}


                  {isLoading ? (<div colSpan="8" className="text-center">
                    <Loader /> {/* Use the loader here */}
                  </div>) : selectedTemplateFields && Object.entries(selectedTemplateFields).length > 0 && (


                    <div className="d-flex justify-content-center"
                      style={{ width: '100%', padding: '20px' }}>

                      <Stage className="stage"
                        width={700}
                        height={600}
                        scale={{ x: 0.9, y: 1 }}>
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
                              cornerRadius={Number(templates['badge']?.imageFields?.photo?.circle_diameter || 0) / 2}
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
                              stroke={templates['badge']?.imageFields?.logo?.circle_background || 'black'}
                              strokeWidth={templates['badge']?.imageFields?.logo?.circle_mask_thickness || 2}
                              cornerRadius={
                                //templates['badge']?.logo?.logo_is_circle
                                (templates['badge']?.imageFields?.logo?.circle_diameter || 0) / 2
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
                  )}

                </div>
              </div>
            </div>
          </div>) : (<div id="kt_app_content" className="app-content flex-column-fluid">
            <h1 className="text-center">Welcome to {userRole}  Dashboard</h1>
          </div>)}
      </div>

    </>
  );
}
