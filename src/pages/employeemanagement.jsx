import { useEffect } from "react";


import { useState } from "react"

import { addEmployee, getEmployees, updateEmployee, deleteEmployee, deleteEmployeeBunch, getEmployee, } from "../features/employeeSlice"
import { getUsers } from "../features/userSlice";

import { fetchJobPositions } from "../features/jobPositionSlice";
import { fetchJobTitleCategories } from "../features/jobTitleCategorySlice";
import { getWoreda } from "../features/woredaSlice";
import { getRegion } from "../features/regionSlice";
import { getMaritalStatus } from "../features/maritalStatusSlice";
import { fetchOrganizationUnits } from "../features/organizationUnitSlice";
import { getZone } from "../features/zoneSlice";

import { fetchRoles } from "../features/roleSlice";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function EmployeeManagement() {
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState();
  const [zoneInfo, setZoneInfo] = useState();
  const [woredaInfo, setWoredaInfo] = useState();
  const [regionInfo, setRegionInfo] = useState();
  const [maritalInfo, setMaritalInfo] = useState();
  const [jobPositionInfo, setJobPositionInfo] = useState();
  const [jobTitleCatInfo, setJobTitleCatInfo] = useState();
  const [organizationUnitInfo, setOrganizationUnitInfo] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState([]);


  const [profilePhoto, setProfilePhoto] = useState();

  useEffect(() => {
    setIsLoading(true);
    dispatch(getZone())
      .then((data) => {

        const dataitem = data.payload;


        const normalizedData = Array.isArray(dataitem) ? dataitem : [dataitem];
        setZoneInfo(normalizedData);
      })
      .catch((error) => {
        console.log('Error fetching data', error);
      })
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  //get user data
  useEffect(() => {
    setIsLoading(true);
    dispatch(getUsers())
      .then((data) => {

        const dataitem = data.payload;
        console.log(dataitem)

        const normalizedData = Array.isArray(dataitem) ? dataitem : [dataitem];
        setUserInfo(normalizedData);
      })
      .catch((error) => {
        console.log('Error fetching data', error);
      })
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(true);
    dispatch(getRegion())
      .then((data) => {

        const dataitem = data.payload;


        const normalizedData = Array.isArray(dataitem) ? dataitem : [dataitem];
        setRegionInfo(normalizedData);
      })
      .catch((error) => {
        console.log('Error fetching data', error);
      })
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(true);
    dispatch(getWoreda())
      .then((data) => {

        const dataitem = data.payload;


        const normalizedData = Array.isArray(dataitem) ? dataitem : [dataitem];
        setWoredaInfo(normalizedData);
      })
      .catch((error) => {
        console.log('Error fetching data', error);
      })
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(true);
    dispatch(getMaritalStatus())
      .then((data) => {

        const dataitem = data.payload;


        const normalizedData = Array.isArray(dataitem) ? dataitem : [dataitem];
        setMaritalInfo(normalizedData);
      })
      .catch((error) => {
        console.log('Error fetching data', error);
      })
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchOrganizationUnits())
      .then((data) => {

        const dataitem = data.payload.data;


        const normalizedData = Array.isArray(dataitem) ? dataitem : [dataitem];
        setOrganizationUnitInfo(normalizedData);
      })
      .catch((error) => {
        console.log('Error fetching data', error);
      })
      .finally(() => setIsLoading(false));
  }, [dispatch]);



  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchJobPositions())
      .then((data) => {

        const dataitem = data.payload;


        const normalizedData = Array.isArray(dataitem) ? dataitem : [dataitem];
        setJobPositionInfo(normalizedData);
      })
      .catch((error) => {
        console.log('Error fetching data', error);
      })
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchJobTitleCategories())
      .then((data) => {

        const dataitem = data.payload;


        const normalizedData = Array.isArray(dataitem) ? dataitem : [dataitem];
        setJobTitleCatInfo(normalizedData);
      })
      .catch((error) => {
        console.log('Error fetching data', error);
      })
      .finally(() => setIsLoading(false));
  }, [dispatch]);


  const [selectedEmployees, setSelectedEmployees] = useState({});
  const [startSelection, setStartSelection] = useState(false);
  const { profiles } = useSelector((state => state.profile));
  const [selectedFilter, setSelectedFilter] = useState("show all");
  const [filteredData, setFilteredData] = useState([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const role = useSelector((state) => state.user.role);
  const user = useSelector((state) => state.user.user);
  console.log(role)

  const [formData, setFormData] = useState({
    id: '',
    en_name: '',
    title: '',
    sex: '',
    date_of_birth: '',
    joined_date: '',
    user_id: '',
    photo: '',
    phone_number: '',
    organization_unit_id: '',
    job_position_id: '',
    job_title_category_id: '',
    salary: '',
    marital_status_id: '',
    nation: '',
    employment_id: '',
    job_position_start_date: '',
    job_position_end_date: '',
    address: '',
    house_number: '',
    region_id: '',
    zone_id: '',
    woreda_id: '',
    status: '',
    id_issue_date: '',
    id_expire_date: '',
    id_status: ''
  })
  const [profileData, setProfileData] = useState({
    id: '',
    en_name: FormData?.en_name || "",
    title: FormData?.title || "",
    sex: FormData?.sex || "",
    date_of_birth: FormData?.date_of_birth || "",
    joined_date: FormData?.joined_date || "",
    user_id: FormData?.user_id || "",
    photo: FormData?.photo || "",
    phone_number: FormData?.phone_number || "",
    organization_unit_id: FormData?.organization_unit_id || "",
    job_position_id: FormData?.job_position_id || "",
    job_title_category_id: FormData?.job_title_category_id || "",
    salary: FormData?.salary || "",
    marital_status_id: FormData?.marital_status_id || "",
    nation: FormData?.nation || "",
    employment_id: FormData?.employment_id || "",
    job_position_start_date: FormData?.job_position_start_date || "",
    job_position_end_date: FormData?.job_position_end_date || "",
    address: FormData?.address || "",
    house_number: FormData?.house_number || "",
    region_id: FormData?.region_id || "",
    woreda_id: FormData?.woreda_id || "",
    zone_id: FormData?.zone_id || "",
  });

  useEffect(() => {
    setProfileData(formData);

  }, []);



  const [employeeProfile, setEmployeeProfile] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [searchItem, setSearch] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil((employeeProfile?.length || 0) / itemsPerPage);


  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentdata = (employeeProfile || []).slice(firstItemIndex, lastItemIndex);

  const [extractData, setExtractData] = useState([]);


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
      //setRoles(normalizedData);
      if (role.length !== 0) {
        const rolesExist = normalizedData.filter(data => role.includes(data.name)).map(data => ({
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

  console.log(permissions)

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    setFormData({ ...formData, [e.target.name]: e.target.value });
    //console.log(formData);
  }
  console.log(formData);

  useEffect(() => {
    const users = Object.values(profileData || {});

    if (selectedFilter === "show all") {
      setFilteredData(users);
    } else {
      const filtered = users.filter(
        (data) => data.id_status?.toLowerCase() === selectedFilter.toLowerCase()
      );
      setFilteredData(filtered);
    }
  }, [selectedFilter, profileData]);


  useEffect(() => {
    dispatch(getEmployees())
      .then((action) => {
        if (action.meta.requestStatus === 'fulfilled') {
          // If payload is an array with data
          if (Array.isArray(action.payload) && action.payload.length > 0) {
            setEmployeeProfile(action.payload[0]?.data);
            setProfilePhoto(action.payload[0]?.data?.photo_url);

          } else {
            // Handle empty or unexpected payload gracefully
            setEmployeeProfile(null);
            console.log("No profile data available");
          }
        } else {
          console.error("Fetch failed:", action.payload);
        }
      })
      .catch((error) => {
        console.error('Unexpected error', error);
      });

  }, [dispatch, profiles]);
  console.log(employeeProfile)

  useEffect(() => {
    if (selectedFilter === "show all") {
      setFilteredData(employeeProfile);
    } else {
      const filtered = Object.entries(employeeProfile).filter((data) => data.id?.toLowerCase() === selectedFilter.toLowerCase());

      setFilteredData(filtered);
    }
  }, [selectedFilter, employeeProfile]);

  const imageUploader = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: file });
      }
      reader.readAsDataURL(file);
    }
  }

  const PHONE_REGX = /^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  const NAME_REGX = /^[\p{L}\s\-.'’]+$/u;


  const [validName, setValidName] = useState();
  const [validPhone, setValidPhone] = useState();

  const [nameFocus, setNameFocus] = useState();
  const [phoneFocus, setPhoneFocus] = useState();

  useEffect(() => {
    const res = NAME_REGX.test(formData.en_name);
    console.log(res);
    console.log(formData.en_name);
    setValidName(res);
  }, [formData]);

  useEffect(() => {
    const res = PHONE_REGX.test(formData.phone_number);
    console.log(res);
    console.log(formData.phone_number);
    setValidPhone(res);
  }, [formData]);

  const handleSelectedRows = (rowId) => {

    setSelectedEmployees((prev) => {

      const updatedSelection = {

        ...prev,

        [rowId]: !prev[rowId],

      };

      const hasSelectedRows = Object.values(updatedSelection).some((isSelected) => isSelected);



      setStartSelection(hasSelectedRows);

      if (!updatedSelection[rowId]) {

        delete updatedSelection[rowId];

      }





      if (Object.keys(updatedSelection).length === 0) {

        return {};

      }



      return updatedSelection;

    })
  };

  const handleSelectAll = () => {

    if (Object.keys(selectedEmployees).length === employeeProfile.length) {



      setSelectedEmployees({});

      setStartSelection({});

    } else {



      const newSelected = {};

      employeeProfile.forEach((user) => {

        newSelected[user.id] = true;

      });

      setSelectedEmployees(newSelected);

      setStartSelection(newSelected)

    }

  };

  const handleCreateProfile = () => {
    if (!validName || !formData.sex || !formData.title || !formData.user_id || !formData.employment_id || !validPhone ||
      !formData.organization_unit_id || !formData.job_position_id || !formData.job_title_category_id || !formData.marital_status_id || !formData.nation ||
      !formData.region_id || !formData.zone_id || !formData.woreda_id
    ) {
      console.log(validName);
      console.log(validPhone)
      toast.error(t('therearemissingfields'));

      return;

    }
    else {
      dispatch(addEmployee(formData));
      setIsCreateModalOpen(false)
    }
  }

  const handleUpdateProfile = (id) => {
    console.log(id);
    console.log(formData)
    if (!validName || !formData.sex || !formData.title || !formData.user_id || !formData.employment_id || !validPhone ||
      !formData.organization_unit?.id || !formData.job_position?.id || !formData.job_title_category?.id || !formData.marital_status?.id || !formData.nation ||
      !formData.region?.id || !formData.zone?.id || !formData.woreda?.id
    ) {

      toast.error(t('therearemissingfields'));

      return;

    }
    else {
      dispatch(updateEmployee({ Id: id, rawForm: formData }));
      setIsEditModalOpen(false);
    }

  }

  const handleDeleteProfile = (id) => {
    console.log('to delete', id);
    dispatch(deleteEmployee({ Id: id }));
    setIsDeleteModalOpen(false);
  }

  const handleDeleteBunch = () => {
    console.log(selectedEmployees);
    dispatch(deleteEmployeeBunch(selectedEmployees)).then((data) => {
      console.log("Updated Users:", data.payload);
    });
  };
 
  const CloseIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        opacity="0.5"
        x="6"
        y="17.3137"
        width="16"
        height="2"
        rx="1"
        transform="rotate(-45 6 17.3137)"
        fill="currentColor"
      />
      <rect
        x="7.41422"
        y="6"
        width="16"
        height="2"
        rx="1"
        transform="rotate(45 7.41422 6)"
        fill="currentColor"
      />
    </svg>
  );


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
              {t('employeemanagement')}
            </h1>
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
              <li className="breadcrumb-item text-muted">
                <a
                  href="/"
                  className="text-muted text-hover-primary"
                >
                  {t('home')}
                </a>
              </li>
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted">{t('employeemanagement')}</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            {permissions.some(p =>
              p.name.includes('create Employee')) ? (<a
                href="#"
                className="btn btn-sm fw-bold btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setIsCreateModalOpen(true);
                }}
              >
                {t('addemployee')}
              </a>) : null}

            {permissions.some(p =>
              p.name.includes('delete Employee')) ? (<a
                href="#"
                className={Object.keys(selectedEmployees).length > 0
                  ? "btn btn-sm fw-bold bg-body btn-color-gray-700 btn-active-color-primary"
                  : "hide"
                }
                onClick={handleDeleteBunch}
              >
                {t('deleteselected')}
              </a>) : null}

            {permissions.some(p =>
              p.name.includes('create IdentityCardTemplateDetail')) ? (<a
                className={Object.keys(selectedEmployees).length > 0
                  ? "btn btn-sm fw-bold bg-body btn-color-gray-700 btn-active-color-primary"
                  : "hide"
                }
                onClick={(e) => {
                  e.preventDefault();
                  console.log(Object.keys(selectedEmployees))
                  navigate('/idmanagement/bulk', {
                    state: { selectedEmployees: Object.keys(selectedEmployees) }
                  })
                }}
              >
                Issue bunch ids
              </a>) : null}
          </div>
          {isCreateModalOpen && (
            <div
              className="modal fade show"
              tabIndex="-1"
              id="kt_modal_scrollable_1"
              style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{t('addemployee')}</h5>

                    <span className="svg-icon svg-icon-1" onClick={() => setIsCreateModalOpen(false)}>
                      <CloseIcon /></span>
                  </div>

                  <fieldset>
                    <legend>{t('employeedetails')}</legend>



                    <form className="p-5 bg-white rounded shadow-sm text-start">
                      <div className="row g-4">
                        {formData.photo ? <img src={formData.photo || ""} /> : null}
                        <div className="col-12 text-center">
                          <input type="file" onChange={imageUploader} className="form-control" />
                        </div>
                        {/* Name */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold required">{t('name')}</label>
                          <input type="text" name="en_name" className="form-control" onChange={handleChange}
                            onFocus={() => setNameFocus(true)}
                            onBlur={() => setNameFocus(false)} />
                        </div>
                        <p style={{ backgroundColor: "lightgreen", width: "60%", borderRadius: "10px", margin: "2px 0px" }} className={nameFocus && !validName ? "visible" : "hide"}><i className="bi bi-exclamation-circle-fill" style={{ color: 'red' }}></i>
                          Please enter a correct name</p>

                        {/* Title */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold required">{t('title')}</label>
                          <input type="text" name="title" className="form-control" onChange={handleChange} />
                        </div>

                        {/* Sex */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold required">{t('sex')}</label>
                          <select className="form-select" name="sex" onChange={handleChange}>
                            <option value="">{t('select')}</option>
                            <option value="male">{t('male')}</option>
                            <option value="female">{t('female')}</option>
                          </select>
                        </div>

                        {/* Date of Birth */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">{t('dateofbirth')}</label>
                          <input type="date" name="date_of_birth" className="form-control" onChange={handleChange} />
                        </div>

                        {/* Joined Date */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">{t('joineddate')}</label>
                          <input type="date" name="joined_date" className="form-control" onChange={handleChange} />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold required">{t('username')}</label>
                          <select className="form-select" name="user_id" onChange={handleChange}>
                            <option value="">{t('select')}</option>
                            {userInfo.map((data) => {
                              return <option value={data.id}>{data.name}</option>
                            })}
                          </select>
                        </div>

                        {/* Phone Number */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold required">{t('phonenumber')}</label>
                          <input type="tel" name="phone_number" className="form-control" onChange={handleChange}
                            onFocus={() => setPhoneFocus(true)}
                            onBlur={() => setPhoneFocus(false)} />
                        </div>
                        <p style={{ backgroundColor: "lightgreen", width: "60%", borderRadius: "10px", margin: "2px 0px" }} className={phoneFocus && !validPhone ? "visible" : "hide"}><i className="bi bi-exclamation-circle-fill" style={{ color: 'red' }}></i>
                          Please enter a correct phone number</p>

                        {/* Organization Unit */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold required">{t('organizationunit')}</label>
                          <select className="form-select" name="organization_unit_id" onChange={handleChange}>
                            <option value="">Select...</option>
                            {organizationUnitInfo.map((data) => {
                              return <option value={data.id}>{data.en_name}</option>
                            })}
                          </select>
                        </div>

                        {/* Job Position */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold required">{t('jobposition')}</label>
                          <select className="form-select" name="job_position_id" onChange={handleChange}>
                            <option value="">{t('select')}</option>
                            {jobPositionInfo.map((data) => {
                              return <option value={data.id}>{data.job_description}</option>
                            })}
                          </select>
                        </div>

                        {/* Job Title Category */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold required">{t('jobtitlecategory')}</label>
                          <select className="form-select" name="job_title_category_id" onChange={handleChange}>
                            <option value="">{t('select')}</option>
                            {jobTitleCatInfo.map((data) => {
                              return <option value={data.id}>{data.name}</option>
                            })}
                          </select>
                        </div>

                        {/* Salary Amount */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">{t('salary')}</label>
                          <input type="text" name="salary" className="form-control" onChange={handleChange} />
                        </div>

                        {/* Marital Status */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold required">{t('maritalstatus')}</label>
                          <select className="form-select" name="marital_status_id" onChange={handleChange}>
                            <option value="">{t('select')}</option>
                            {maritalInfo.map((data) => {
                              console.log(maritalInfo)
                              return <option value={data.id}>{data.name}</option>
                            })}
                          </select>
                        </div>

                        {/* Nation */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold required">{t('nation')}</label>
                          <input type="text" name="nation" className="form-control" onChange={handleChange} />
                        </div>

                        {/* Employment ID */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold required">{t('employmentid')}</label>
                          <input type="text" name="employment_id" className="form-control" onChange={handleChange} required />
                        </div>

                        {/* Job Position Start */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">{t('jobpositionstartdate')}</label>
                          <input type="date" name="job_position_start_date" className="form-control" onChange={handleChange} />
                        </div>

                        {/* Job Position End */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">{t('jobpositionenddate')}</label>
                          <input type="date" name="job_position_end_date" className="form-control" onChange={handleChange} />
                        </div>

                        {/* Address */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">{t('address')}</label>
                          <input type="text" name="address" className="form-control" onChange={handleChange} />
                        </div>

                        {/* House Number */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">{t('housenumber')}</label>
                          <input type="text" name="house_number" className="form-control" onChange={handleChange} />
                        </div>

                        {/* Region */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold required">{t('region')}</label>
                          <select className="form-select" name="region_id" onChange={handleChange}>
                            <option value="">{t('select')}</option>
                            {regionInfo.map((data) => {
                              return <option value={data.id}>{data.name}</option>
                            })}
                          </select>
                        </div>

                        {/* Zone */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold required">{t('zone')}</label>
                          <select className="form-select" name="zone_id" onChange={handleChange}>
                            <option value="">{t('select')}</option>
                            {zoneInfo.map((data) => {
                              console.log(zoneInfo)
                              return <option value={data.id}>{data.name}</option>
                            })}
                          </select>
                        </div>

                        {/* Woreda */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold required">{t('woreda')}</label>
                          <select className="form-select" name="woreda_id" onChange={handleChange}>
                            <option value="">{t('select')}</option>
                            {woredaInfo.map((data) => {
                              return <option value={data.id}>{data.name}</option>
                            })}
                          </select>
                        </div>
                      </div>


                    </form>

                  </fieldset>

                  <div className="modal-footer">

                    <button type="button" className="btn btn-primary" onClick={handleCreateProfile}>
                      {t('savechanges')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Page content goes here */}
      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div id="kt_app_content_container" className="app-container container-xxl">
          <div className="row g-5 g-xl-10">
            <div className="card card-flush h-xl-100">
              {/*begin::Card header*/}
              <div className="card-header pt-7">
                {/*begin::Title*/}
                <h3 className="card-title align-items-start flex-column">
                  <span className="card-label fw-bold text-gray-800">{t('employeeinformation')}</span>

                </h3>
                {/*end::Title*/}
                {/*begin::Actions*/}
                <div className="card-toolbar">
                  {/*begin::Filters*/}
                  <div className="d-flex flex-stack flex-wrap gap-4">
                    {/*begin::Destination*/}
                    <div className="d-flex align-items-center fw-bold">
                      {/*begin::Label*/}
                      <div className="text-gray-400 fs-7 me-2">{t('idstatus')}</div>
                      {/*end::Label*/}
                      {/*begin::Select*/}
                      <select className="form-select form-select-transparent text-graY-800 fs-base lh-1 fw-bold py-0 ps-3 w-auto"
                        data-control="select" data-hide-search="true" data-dropdown-css-classname="w-150px"
                        data-placeholder="ID status" value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}>

                        <option value="show all" >{t('showall')}</option>
                        <option value="Active">Active</option>
                        <option value="Expired">Expired</option>
                      </select>
                      {/*end::Select*/}
                    </div>
                    {/*end::Destination*/}
                    {/*begin::Status*/}

                    {/*end::Status*/}
                    {/*begin::Search*/}
                    <div className="position-relative my-1">
                      {/*begin::Svg Icon | path: icons/duotune/general/gen021.svg*/}
                      <span className="svg-icon svg-icon-2 position-absolute top-50 translate-middle-y ms-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1" transform="rotate(45 17.0365 15.1223)" fill="currentColor" />
                          <path d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z" fill="currentColor" />
                        </svg>
                      </span>
                      {/*end::Svg Icon*/}
                      <input type="text" data-kt-table-widget-4="search" className="form-control w-150px fs-7 ps-12" placeholder={t('search')} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    {/*end::Search*/}
                  </div>
                  {/*begin::Filters*/}
                </div>
                {/*end::Actions*/}
              </div>
              {/*end::Card header*/}
              {/*begin::Card body*/}
              <div className="card-body pt-2">
                {/*begin::Table*/}
                <table className="table table-striped align-middle table-row-dashed fs-6 gy-3" id="kt_table_widget_4_table">
                  {/*begin::Table head*/}
                  <thead>
                    {/*begin::Table row*/}
                    <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                      <th className="min-w-100px">
                        <div className="d-flex align-items-center gap-4">
                          <input
                            type="checkbox"
                            checked={Object.keys(selectedEmployees).length === (employeeProfile?.length || 0)}

                            onChange={handleSelectAll}
                            title={
                              Object.keys(selectedEmployees).length === (employeeProfile?.length || 0)
                                ? 'Deselect All'
                                : 'Select All'
                            }

                            style={{ cursor: 'pointer' }}
                          />      {t('sn')}.
                        </div>
                      </th>
                      <th className="text-start min-w-100px">{t('profilepicture')}</th>
                      <th className="text-start min-w-100px">{t('name')}</th>
                      <th className="text-start min-w-125px">{t('employmentid')}</th>
                      <th className="text-start min-w-100px">{t('sex')}</th>
                      <th className="text-start min-w-100px">{t('phonenumber')}</th>
                      <th className="text-start min-w-100px">{t('organizationunit')}</th>
                      <th className="text-start min-w-100px">{t('jobposition')}</th>
                      <th className="text-start min-w-100px">{t('idstatus')}</th>
                      <th className="text-start min-w-100px">{t('actions')}</th>

                    </tr>
                    {/*end::Table row*/}
                  </thead>
                  {/*end::Table head*/}
                  {/*begin::Table body*/}
                  <tbody className="fw-bold text-gray-600">

                    {isLoading ? (
                      <tr>
                        <td colSpan="8" className="text-center">
                          <Loader />
                        </td>
                      </tr>
                    ) :
                      Array.isArray(employeeProfile) ? (
                        currentdata.length > 0 ? (
                          currentdata.filter((row) => {
                            // console.log(row);
                            const matchSearch = searchItem.toLowerCase() === ''
                              ? true
                              : String(row.en_name).toLowerCase().includes(searchItem.toLowerCase());

                            //console.log(matchSearch)
                            const matchFilter =
                              selectedFilter === 'show all' ||
                              row.id_status?.toLowerCase() === selectedFilter.toLowerCase();
                            /*console.log(row.id_status)
                            console.log(selectedFilter);
                            console.log(matchFilter)*/

                            return matchSearch && matchFilter
                          })
                            .map((row, index) => {

                              return (
                                <tr key={index} data-kt-table-widget-4="subtable_template">
                                  <td >
                                    <div className="d-flex align-items-center gap-4">
                                      <input type="checkbox"
                                        checked={!!selectedEmployees[row.id]}
                                        onChange={() => handleSelectedRows(row.id)} />
                                      {index + 1}
                                    </div>
                                  </td>
                                  <td className="text-start pe-4">
                                    <img
                                      src={`http://localhost:8000/cors-image/${row.photo_url}`}
                                      width="50"
                                      height="50"
                                      alt="User"
                                      style={{
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                      }}
                                    />

                                  </td>

                                  <td className="text-start">
                                    {row.en_name}
                                  </td>
                                  <td className="text-start">
                                    {row.employment_id}
                                  </td>
                                  <td className="text-start">
                                    {row.sex}
                                  </td>
                                  <td className="text-start">
                                    {row.phone_number}
                                  </td>
                                  <td className="text-start">
                                    {row?.organization_unit?.en_name}
                                  </td>
                                  <td className="text-start">
                                    {row?.job_position?.job_description}
                                  </td>

                                  <td className="text-start">
                                    <span className={`badge badge-${row.id_status && row.id_status.toLowerCase() === 'active' ? 'success' : 'danger'
                                      }`}>
                                      {row.id_status || 'Unknown'}
                                    </span>
                                  </td>



                                  <td className="text-start">
                                    {permissions.some(p =>
                                      p.name.includes('read IdentityCardTemplateDetail')) ? (
                                      <button className="btn btn-icon btn-bg-light btn-color-primary btn-sm me-2" onClick={() => navigate(`/idmanagement?data=${row.id}`)}>
                                        <i className="bi bi-eye-fill"></i>
                                      </button>
                                    ) : null}


                                    {permissions.some(p =>
                                      p.name.includes('update Employee')) ? (
                                      <button className="btn btn-icon btn-bg-light btn-color-warning btn-sm me-2"
                                        onClick={() => {
                                          setFormData(row),
                                            setIsEditModalOpen(true),
                                            setSelectedEmployee(row)
                                        }}><i className="bi bi-pencil-fill"></i></button>
                                    ) : null}


                                    {isEditModalOpen && (
                                      <div
                                        className="modal fade show"
                                        tabIndex="-1"
                                        id="kt_modal_scrollable_1"
                                        style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.1)' }}
                                      >
                                        <div className="modal-dialog">
                                          <div className="modal-content">
                                            <div className="modal-header">
                                              <h5 className="modal-title">{t('editemployee')}</h5>

                                              <span className="svg-icon svg-icon-1" onClick={() => setIsEditModalOpen(false)}>
                                                <CloseIcon />
                                              </span>
                                            </div>

                                            <fieldset>
                                              <legend className="text-start">{t('employeedetails')}</legend>
                                              <form className="p-5 bg-white rounded shadow-sm text-start">
                                                <div className="row g-4">
                                                  {/* Image Preview and Upload */}
                                                  <div className="col-12 text-center">

                                                    <input type="file" onChange={imageUploader} className="form-control" />
                                                  </div>

                                                  {/* Name */}
                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold required">{t('name')}</label>
                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      value={formData?.en_name || ""}
                                                      name="en_name"
                                                      onChange={handleChange}
                                                      required
                                                      onFocus={() => setNameFocus(true)}
                                                      onBlur={() => setNameFocus(false)} />
                                                  </div>
                                                  <p style={{ backgroundColor: "lightgreen", width: "60%", borderRadius: "10px", margin: "2px 0px" }} className={nameFocus && !validName ? "visible" : "hide"}><i className="bi bi-exclamation-circle-fill" style={{ color: 'red' }}></i>
                                                    Please enter a correct name</p>

                                                  {/* Title */}
                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold required">{t('title')}</label>
                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      value={formData?.title || ""}
                                                      name="title"
                                                      onChange={handleChange}
                                                    />
                                                  </div>

                                                  {/* Gender */}
                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold required">{t('sex')}</label>
                                                    <select
                                                      className="form-select"
                                                      name="sex"
                                                      value={formData?.sex || ""}
                                                      onChange={handleChange}
                                                    >
                                                      <option value="">{t('select')}</option>
                                                      <option value="male">{t('male')}</option>
                                                      <option value="female">{t('female')}</option>
                                                    </select>
                                                  </div>

                                                  {/* Date of Birth */}
                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold">{t('dateofbirth')}</label>
                                                    <input
                                                      type="date"
                                                      className="form-control"
                                                      name="date_of_birth"
                                                      value={formData?.date_of_birth || ""}
                                                      onChange={handleChange}
                                                    />
                                                  </div>

                                                  {/* Joined Date */}
                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold">{t('joineddate')}</label>
                                                    <input
                                                      type="date"
                                                      className="form-control"
                                                      value={formData?.joined_date || ""}
                                                      name="joined_date"
                                                      onChange={handleChange}
                                                    />
                                                  </div>

                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold required">{t('username')}</label>
                                                    <select className="form-select" name="user_id" value={formData?.user_id || ""} onChange={handleChange}>
                                                      <option value="">{t('select')}</option>
                                                      {userInfo.map((data) => {
                                                        return <option value={data.id}>{data.name}</option>
                                                      })}
                                                    </select>
                                                  </div>


                                                  {/* Phone Number */}
                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold required">{t('phonenumber')}</label>
                                                    <input
                                                      type="tel"
                                                      className="form-control"
                                                      name="phone_number"
                                                      value={formData?.phone_number || ""}
                                                      onChange={handleChange}
                                                      onFocus={() => setPhoneFocus(true)}
                                                      onBlur={() => setPhoneFocus(false)} />
                                                  </div>
                                                  <p style={{ backgroundColor: "lightgreen", width: "60%", borderRadius: "10px", margin: "2px 0px" }} className={phoneFocus && !validPhone ? "visible" : "hide"}><i className="bi bi-exclamation-circle-fill" style={{ color: 'red' }}></i>
                                                    Please enter a correct name</p>

                                                  {/* Organization Unit */}
                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold required">{t('organizationunit')}</label>
                                                    <select className="form-select" name="organization_unit_id" value={formData?.organization_unit?.id || ""} onChange={handleChange}>
                                                      <option value="">{t('select')}</option>
                                                      {organizationUnitInfo.map((data) => {
                                                        return <option key={data.id} value={data.id}>{data.en_name}</option>
                                                      })}
                                                    </select>
                                                  </div>

                                                  {/* Job Position */}
                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold required">{t('jobposition')}</label>
                                                    <select className="form-select" name="job_position_id" value={formData?.job_position?.id || ""} onChange={handleChange}>
                                                      <option value="">{t('select')}</option>
                                                      {jobPositionInfo.map((data) => {
                                                        return <option key={data.id} value={data.id}>{data.job_description}</option>
                                                      })}
                                                    </select>
                                                  </div>

                                                  {/* Job Title Category */}
                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold required">{t('jobtitlecategory')}</label>
                                                    <select className="form-select" name="job_title_category_id" value={formData?.job_title_category?.id || ""} onChange={handleChange}>
                                                      <option value="">{t('select')}</option>
                                                      {jobTitleCatInfo.map((data) => {
                                                        return <option key={data.id} value={data.id}>{data.name}</option>
                                                      })}
                                                    </select>
                                                  </div>

                                                  {/* Salary Amount */}
                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold">{t('salary')}</label>
                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      value={formData?.salary || ""}
                                                      name="salary"
                                                      onChange={handleChange}
                                                    />
                                                  </div>

                                                  {/* Marital Status */}
                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold required">{t('maritalstatus')}</label>
                                                    <select className="form-select" name="marital_status_id" value={formData?.marital_status?.id || ""} onChange={handleChange}>
                                                      <option value="">{t('select')}</option>
                                                      {maritalInfo.map((data) => {

                                                        return <option key={data.id} value={data.id}>{data.name}</option>
                                                      })}
                                                    </select>
                                                  </div>

                                                  {/* Nation */}
                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold required">{t('nation')}</label>
                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      name="nation"
                                                      value={formData?.nation || ""}
                                                      onChange={handleChange}
                                                    />
                                                  </div>

                                                  {/* Employment ID */}
                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold required">{t('employmentid')}</label>
                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      name="employment_id"
                                                      value={formData?.employment_id || ""}
                                                      onChange={handleChange}
                                                      required
                                                    />
                                                  </div>

                                                  {/* Job Position Start Date */}
                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold">{t('jobpositionstartdate')}</label>
                                                    <input
                                                      type="date"
                                                      className="form-control"
                                                      name="job_position_start_date"
                                                      value={formData?.job_position_start_date || ""}
                                                      onChange={handleChange}
                                                    />
                                                  </div>

                                                  {/* Job Position End Date */}
                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold">{t('jobpositionenddate')}</label>
                                                    <input
                                                      type="date"
                                                      className="form-control"
                                                      name="job_position_end_date"
                                                      value={formData?.job_position_end_date || ""}
                                                      onChange={handleChange}
                                                    />
                                                  </div>

                                                  {/* Address */}
                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold">{t('address')}</label>
                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      name="address"
                                                      value={formData?.address || ""}
                                                      onChange={handleChange}
                                                    />
                                                  </div>

                                                  {/* House Number */}
                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold">{t('housenumber')}</label>
                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      name="house_number"
                                                      value={formData?.house_number || ""}
                                                      onChange={handleChange}
                                                    />
                                                  </div>

                                                  {/* Region */}
                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold required">{t('region')}</label>
                                                    <select className="form-select" name="region_id" value={formData?.region?.id || ""} onChange={handleChange}>
                                                      <option value="">{t('select')}</option>
                                                      {regionInfo.map((data) => {
                                                        return <option key={data.id} value={data.id}>{data.name}</option>
                                                      })}
                                                    </select>
                                                  </div>

                                                  {/* Zone */}
                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold required">{t('zone')}</label>
                                                    <select className="form-select" name="zone_id" value={formData?.zone?.id || ""} onChange={handleChange}>
                                                      <option value="">{t('select')}</option>
                                                      {zoneInfo.map((data) => {
                                                        return <option key={data.id} value={data.id}>{data.name}</option>
                                                      })}
                                                    </select>
                                                  </div>

                                                  {/* Woreda */}
                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold required">{t('woreda')}</label>
                                                    <select className="form-select" name="woreda_id" value={formData?.woreda?.id || ""} onChange={handleChange}>
                                                      <option value="">{t('select')}</option>
                                                      {woredaInfo.map((data) => {
                                                        return <option key={data.id} value={data.id}>{data.name}</option>
                                                      })}
                                                    </select>
                                                  </div>
                                                </div>
                                              </form>


                                            </fieldset>

                                            <div className="modal-footer">

                                              <button type="button" className="btn btn-primary" onClick={() => handleUpdateProfile(selectedEmployee.id)}>
                                                {t('savechanges')}
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {permissions.some(p =>
                                      p.name.includes('delete Employee')) ? (
                                      <button className="btn btn-icon btn-bg-light btn-color-danger btn-sm"
                                        onClick={() => { setSelectedEmployee(row), setIsDeleteModalOpen(true) }}><i className="bi bi-trash-fill"></i></button>
                                    ) : null}

                                    {isDeleteModalOpen && (
                                      <div
                                        className="modal fade show"
                                        tabIndex="-1"
                                        style={{
                                          display: "block",
                                          backgroundColor: "rgba(0,0,0,0.1)",
                                        }}
                                      >
                                        <div className="modal-dialog">
                                          <div className="modal-content">
                                            {/* Modal Header */}
                                            <div className="modal-header">
                                              <h5 className="modal-title">
                                                {t('confirmdeletion')}
                                              </h5>
                                              <div
                                                className="btn btn-icon btn-sm btn-active-icon-primary"
                                                onClick={() =>
                                                  setIsDeleteModalOpen(false)
                                                }
                                              >
                                                <span className="svg-icon svg-icon-1">
                                                  <CloseIcon />
                                                </span>
                                              </div>
                                            </div>

                                            {/* Modal Body */}
                                            <div className="modal-body text-center">
                                              <p className="fs-5 text-gray-800">
                                                {t('areyousureyouwanttopermanentlydeletethisemployee')}?
                                                <br />
                                                {t('thisactioncannotbeundone')}
                                              </p>
                                            </div>

                                            {/* Modal Footer */}
                                            <div className="modal-footer">
                                              <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() => handleDeleteProfile(selectedEmployee.id)}
                                              >
                                                {t('deletepermanently')}
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                    )}
                                  </td>
                                </tr>
                              );
                            })
                        ) : (
                          <tr><td colSpan="8">No data available</td></tr>
                        )
                      ) : (
                        <tr>
                          <td colSpan="8">No users found</td>
                        </tr>
                      )}
                  </tbody>
                  {/*end::Table body*/}
                </table>

                {/*end::Table*/}
                <div className="pagination d-flex justify-content-between align-items-center mt-5">
                  <div>
                    {t('showing')} {Math.min((currentPage - 1) * itemsPerPage + 1, (filteredData?.length || 0))} to{' '}
                    {Math.min(currentPage * itemsPerPage, (filteredData?.length || 0))} of{' '}
                    {(filteredData?.length || 0)} {t('entries')}
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-icon btn-light-primary"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>
                    <span className="px-3 d-flex align-items-center">
                      {t('page')} {currentPage} {t('of')} {totalPages}
                    </span>
                    <button
                      className="btn btn-sm btn-icon btn-light-primary"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
              {/*end::Card body*/}
            </div>
          </div>

        </div>
      </div>








    </>
  );
}
