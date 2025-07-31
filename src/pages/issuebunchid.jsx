import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Stage, Layer, Text, Image, Group, Image as KonvaImage, Circle } from 'react-konva'
import QRCode from "react-qr-code";

import { getTemplate, getIdDetails, getProfile,generateId } from "../features/idCardSlice";
import { getOrganizationInfo } from "../features/organizationSlice";
export default function BulkIDGenerator() {
    const { t } = useTranslation();
    const location = useLocation();
    const selectedEmployeeIds = location?.state?.selectedEmployees
    console.log(selectedEmployeeIds)
    const dispatch = useDispatch();

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
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState([]);

    const [frontImage, setFrontImage] = useState();
    const [backImage, setBackImage] = useState();
    const [badgeImage, setBadgeImage] = useState();
    const [templateImage, setTemplateImage] = useState();
    const [employees, setEmployees] = useState();
    const [extractData, setExtractData] = useState([]);

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

    const [qrImages, setQRImages] = useState();

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

    useEffect(() => {

        const fetchProfiles = async () => {
            setIsLoading(true)
            console.log(selectedEmployeeIds)
            try {
                const results = await Promise.all(selectedEmployeeIds.map(async (id) => {
                    if (!id) return null;
                    console.log(id)
                    const response = await dispatch(getProfile({ Id: id }));
                    console.log(response.payload)
                    return response.payload || null
                }))
                console.log(results);
                setEmployees(results);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false)
            }
        }
        fetchProfiles();
    }, [dispatch]);

    console.log(employees)

    useEffect(() => {
        if (employees) {
            employees.forEach(employee => {
                if (employee.photo_url) {
                    const img = new window.Image()
                    img.crossOrigin = 'anonymous';
                    img.src = `http://localhost:8000/cors-image/${employee.photo_url}`;
                    img.onload = () => {
                        console.log(img);
                        setImages(prev => ({
                            ...prev,
                            [employee.id]: img,  // Use employee ID as key
                        }));
                    }
                }
                else {
                    const fallback = new window.Image()
                    fallback.crossOrigin = 'anonymous';
                    fallback.src = "https://th.bing.com/th/id/OIP.30Yq02E10j8tn6kKBO1qdQHaHa?rs=1&pid=ImgDetMain"
                    fallback.onload = () =>
                        setImages(prev => ({
                            ...prev,
                            [employee.id]: fallback,  // Use employee ID as key
                        }));
                }
            })

        }
        else {
            console.log('no employee')
        }

    }, [employees])
    console.log(images)

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
        
        const generateIds=async()=>{
            for(const employee of employees){
                await dispatch(generateId({ Id: employee.id, UserInfo: employee, rawData: extractData, templates: templates, Images: images }));
            }
        }
       
    
      generateIds();
    
      }
    console.log(extractData)
    return (
        <>
            <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
                <div className="app-container container-xxl d-flex flex-stack">
                    <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                        <h1 className="page-heading text-dark fw-bold fs-3 my-0">
                            ID Generator
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
                            <li className="breadcrumb-item text-muted">
                                <a href="/" className="text-muted text-hover-primary">{t('home')}</a>
                            </li>
                            <li className="breadcrumb-item">
                                <span className="bullet bg-gray-400 w-5px h-2px"></span>
                            </li>
                            <li className="breadcrumb-item text-muted"> ID Generator</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div id="kt_app_content" className="app-content flex-column-fluid">
                <div class="card ">
                    <div class="card-header card-header-stretch">
                        <h3 class="card-title">Title</h3>
                        <div class="card-toolbar">
                            <ul class="nav nav-tabs nav-line-tabs nav-stretch fs-6 border-0">
                                <li class="nav-item">
                                    <a class="nav-link active" data-bs-toggle="tab" href="#kt_tab_pane_7">Front</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-bs-toggle="tab" href="#kt_tab_pane_8">Back</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-bs-toggle="tab" href="#kt_tab_pane_9">Badge</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="tab-content" id="myTabContent">
                            <div class="tab-pane fade show active" id="kt_tab_pane_7" role="tabpanel">
                                {employees?.map(employee => (
                                    <svg ref={qrRef} style={{ display: "none" }}>
                                        <QRCode value={`/employeeid?data=${employee.employment_id}`} />
                                    </svg>
                                ))}
                                {employees?.map((employee, index) => (
                                    <div style={{ width: '100%', overflow: 'auto' }}>
                                        <Stage width={700} height={600} ref={frontRef} scale={{ x: 0.73, y: 0.61 }}>
                                            <Layer>
                                                <KonvaImage width={700} height={600} image={frontImage} />
                                                {images?.[employee.id] && templates?.['front']?.['imageFields']?.['photo'] && (
                                                    <Image
                                                        x={Number(templates['front']?.imageFields?.photo?.circle_positionx) || 50}
                                                        y={Number(templates['front']?.imageFields?.photo?.circle_positiony) || 50}
                                                        image={images[employee.id]}
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
                                                        stroke={templates['front']?.imageFields?.logo?.circle_background || imageMaskColor}
                                                        strokeWidth={templates['front']?.imageFields?.logo?.circle_mask_thickness || 2}
                                                        cornerRadius={
                                                            //templates['front']?.logo?.logo_is_circle
                                                            (templates['front']?.imageFields?.logo?.circle_diameter || 0) / 2
                                                            // : 0
                                                        }
                                                        rotation={0}
                                                    />
                                                )}
                                                {(templates?.['front']?.imageFields?.['qrcode']?.status === 'active') && (
                                                    <>
                                                        <Image
                                                            //   image={qrImage}
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
                                                                fieldValue = employee?.job_position?.job_description ?? 'N/A';
                                                            } else if (typeof employee?.[field.field_name] === 'object') {
                                                                fieldValue = employee?.[field.field_name]?.name ?? 'N/A';
                                                            } else {
                                                                fieldValue = employee?.[field.field_name] ?? 'N/A';
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
                                ))}
                            </div>

                            <div class="tab-pane fade" id="kt_tab_pane_8" role="tabpanel">
                                {employees?.map((employee, index) => (
                                    <div style={{ width: '100%', overflow: 'auto' }}>
                                        <Stage width={700} height={600} ref={backRef} scale={{ x: 0.73, y: 0.61 }}>
                                            <Layer>
                                                <KonvaImage width={700} height={600} image={backImage} />
                                                {images?.[employee.id] && templates?.['back']?.['imageFields']?.['photo'] && (
                                                    <Image
                                                        x={Number(templates['back']?.imageFields?.photo?.circle_positionx) || 50}
                                                        y={Number(templates['back']?.imageFields?.photo?.circle_positiony) || 50}
                                                        image={images[employee.id]}
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
                                                        stroke={templates['back']?.imageFields?.logo?.circle_background || imageMaskColor}
                                                        strokeWidth={templates['back']?.imageFields?.logo?.circle_mask_thickness || 2}
                                                        cornerRadius={
                                                            //templates['back']?.logo?.logo_is_circle
                                                            (templates['back']?.imageFields?.logo?.circle_diameter || 0) / 2
                                                            // : 0
                                                        }
                                                        rotation={0}
                                                    />
                                                )}

                                                {(qrImages?.[index] && templates?.['back']?.imageFields?.['qrcode']?.status === 'active') && (
                                                    <>
                                                        <Image
                                                            image={qrImages[index]}
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
                                                                        fieldValue = employee?.job_position?.job_description ?? 'N/A';
                                                                    } else if (typeof employee?.[field.field_name] === 'object') {
                                                                        fieldValue = employee?.[field.field_name]?.name ?? 'N/A';
                                                                    } else {
                                                                        fieldValue = employee?.[field.field_name] ?? 'N/A';
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
                                ))}
                            </div>

                            <div class="tab-pane fade" id="kt_tab_pane_9" role="tabpanel">
                                {employees?.map((employee, index) => (
                                    <div style={{ width: '100%', overflow: 'auto' }}>
                                        <Stage width={700} height={600} ref={backRef} scale={{ x: 0.73, y: 0.61 }}>
                                            <Layer>
                                                <KonvaImage width={700} height={600} scale={{ x: 0.9, y: 1 }} ref={badgeRef} image={badgeImage} />
                                                {images?.[employee.id] && templates?.['badge']?.['imageFields']?.['photo'] && (
                                                    <Image
                                                        x={Number(templates['badge']?.imageFields?.photo?.circle_positionx) || 50}
                                                        y={Number(templates['badge']?.imageFields?.photo?.circle_positiony) || 50}
                                                        image={images[employee.id]}
                                                        width={Number(templates['badge']?.imageFields?.photo?.image_width) || 150}
                                                        height={Number(templates['badge']?.imageFields?.photo?.image_height) || 150}
                                                        stroke={templates['badge']?.imageFields?.photo?.circle_background || 'black'}
                                                        strokeWidth={Number(templates['badge']?.imageFields?.photo?.circle_mask_thickness) || 0}
                                                        cornerRadius={Number(templates['badge']?.imageFields?.photo?.circle_diameter || 0) / 2}
                                                        rotation={0}

                                                    />
                                                )}

                                                {(qrImages?.[index] && templates?.['badge']?.imageFields?.['qrcode']?.status === 'active') && (
                                                    <>
                                                        <Image
                                                            image={qrImages[index]}
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
                                                                fieldValue = employee?.job_position?.job_description ?? 'N/A';
                                                            } else if (typeof employee?.[field.field_name] === 'object') {
                                                                fieldValue = employee?.[field.field_name]?.name ?? 'N/A';
                                                            } else {
                                                                fieldValue = employee?.[field.field_name] ?? 'N/A';
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
                                ))}
                            </div>
                        </div>
                    </div>
                    <form style={{ margin: '20px auto', width: '50%' }}>
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
                    </form>
                    <button className="btn btn-primary" style={{ width: '150px' }}
                    onClick={handleCreateId}
                    >{t('generateid')}</button>
                </div>
            </div>
        </>
    )
}