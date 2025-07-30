
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { createOrganizationInfo, getOrganizationInfo } from "../features/organizationSlice"
import { fetchRoles } from "../features/roleSlice"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"
export default function DynamicDetails() {
  const { t } = useTranslation();
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
  const { user } = useSelector((state) => state.user.user);
  const { role } = useSelector((state) => state.user.role);

  const [permissions, setPermissions] = useState();
  const [currentRole, setCurrentRole] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState([{
    en_name: '',
    motto: '',
    mission: '',
    vision: '',
    core_value: '',
    logo: '',
    address: '',
    website: '',
    email: '',
    phone_number: '',
    fax_number: '',
    po_box: '',
    tin_number: '',
    abbreviation: ''
  }])


  const [organizationData, setOrganizationData] = useState({
    en_name: '',
    motto: '',
    mission: '',
    vision: '',
    core_value: '',
    logo: '',
    address: '',
    website: '',
    email: '',
    phone_number: '',
    fax_number: '',
    po_box: '',
    tin_number: '',
    abbreviation: ''
  })

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
      console.log(data);
      console.log(data.payload);
      setOrganizationData(data.payload);
      setFormData(data.payload)
    })
  }, []);

  console.log(organizationData)
  console.log(formData)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  console.log(formData)


  const imageUploader = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          logo: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const EMAIL_REGX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PHONE_REGX = /^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

  const [validEmail, setValidEmail] = useState();
  const [validPhone, setValidPhone] = useState();

  const [emailFocus, setEmailFocus] = useState();
  const [phoneFocus, setPhoneFocus] = useState();

  useEffect(() => {
    const res = EMAIL_REGX.test(formData.email);
    console.log(res);
    console.log(formData.email);
    setValidEmail(res);
  }, [formData]);

  useEffect(() => {
    const res = PHONE_REGX.test(formData.phone_number);
    console.log(res);
    console.log(formData.phone_number);
    setValidPhone(res);
  }, [formData]);



  const handleCreateInformation = (e) => {
    e.preventDefault();
    if (!formData.en_name || !formData.motto || !formData.mission || !formData.vision || !formData.core_value || !formData.email
      || !formData.phone_number || !formData.fax_number || !formData.po_box || !formData.tin_number || !formData.abbreviation
    ) {
      toast.error(t('therearemissingfields'));
      return;
    }
    else {
      dispatch(createOrganizationInfo({ rawData: formData }));
    }
  }



  return (
    <>

      <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
        <div
          id="kt_app_toolbar_container"
          className="app-container container-xxl d-flex flex-stack"
        >
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
            <h1 className="page-heading text-dark fw-bold fs-3 my-0">
              {t('organizationdetails')}
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
              <li className="breadcrumb-item text-muted">{t('organizationdetails')}</li>
            </ul>
          </div>
        </div>
      </div>
      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div id="kt_app_content_container " className="app-container container-xxl d-flex justify-space-between align-items-center gap-5">
          <form className="p-5 bg-white rounded shadow-sm">
            <div className="row g-4">
              {/* Organization name */}
              <div className="col-md-6">
                <label htmlFor="en_name" className="form-label fw-semibold required">{t('organizationname')}</label>
                <input type="text" name="en_name" id="en_name" className="form-control" disabled={permissions?.some(p =>
                  p.name.includes('update')) ? false : true} onChange={handleChange} value={formData?.en_name || ""} />
              </div>

              {/* Motto */}
              <div className="col-md-6">
                <label htmlFor="motto" className="form-label fw-semibold required">{t('motto')}</label>
                <input type="text" name="motto" id="motto" className="form-control" onChange={handleChange} value={formData?.motto || ""}
                  disabled={permissions?.some(p =>
                    p.name.includes('update')) ? false : true} />
              </div>

              {/* Mission */}
              <div className="col-md-6">
                <label htmlFor="mission" className="form-label fw-semibold required">{t('mission')}</label>
                <input type="text" name="mission" id="mission" className="form-control" onChange={handleChange} value={formData?.mission || ""}
                  disabled={permissions?.some(p =>
                    p.name.includes('update')) ? false : true} />
              </div>

              <div className="col-md-6">
                <label htmlFor="vision" className="form-label fw-semibold required">{t('vision')}</label>
                <input type="text" name="vision" id="vision" className="form-control" onChange={handleChange} value={formData?.vision || ""}
                  disabled={permissions?.some(p =>
                    p.name.includes('update')) ? false : true} />
              </div>

              {/* Core Values */}
              <div className="col-md-6">
                <label htmlFor="core_value" className="form-label fw-semibold required">{t('corevalues')}</label>
                <input type="text" name="core_value" id="core_value" className="form-control" onChange={handleChange} value={formData?.core_value || ""}
                  disabled={permissions?.some(p =>
                    p.name.includes('update')) ? false : true} />
              </div>

              {/* Logo */}
              <div className="col-md-6">
                <label htmlFor="logo" className="form-label fw-semibold">{t('logo')}</label>
                <input type="file" name="logo" id="logo" className="form-control" onChange={imageUploader}
                  disabled={permissions?.some(p =>
                    p.name.includes('update')) ? false : true} />
              </div>

              {/* Website */}
              <div className="col-md-6">
                <label htmlFor="website" className="form-label fw-semibold">{t('website')}</label>
                <input type="text" name="website" id="website" className="form-control" onChange={handleChange} value={formData?.website || ""}
                  disabled={permissions?.some(p =>
                    p.name.includes('update')) ? false : true} />
              </div>

              {/* Email */}
              <div className="col-md-6">
                <label htmlFor="email" className="form-label fw-semibold required">{t('email')}</label>
                <input type="email" name="email" id="email" className="form-control" onChange={handleChange}
                  onBlur={() => setEmailFocus(false)}
                  onFocus={() => setEmailFocus(true)}
                  value={formData?.email || ""}
                  disabled={permissions?.some(p =>
                    p.name.includes('update')) ? false : true} />
              </div>
              <p style={{ backgroundColor: "lightgreen", width: "40%", borderRadius: "10px", marginTop: "2px", marginLeft: "600px" }} className={emailFocus && !validEmail ? "visible" : "hide"}><i className="bi bi-exclamation-circle-fill" style={{ color: 'red' }}></i>
                Please enter a correct email</p>

              <div className="col-md-6">
                <label htmlFor="address" className="form-label fw-semibold">{t('address')}</label>
                <input type="text" name="address" id="address" className="form-control" onChange={handleChange} value={formData?.address || ""}
                  disabled={permissions?.some(p =>
                    p.name.includes('update')) ? false : true} />
              </div>
              {/* Phone Number */}
              <div className="col-md-6">
                <label htmlFor="phone_number" className="form-label fw-semibold required">{t('phonenumber')}</label>
                <input type="tel" name="phone_number" id="phone_number" className="form-control" onChange={handleChange}
                  onFocus={() => setPhoneFocus(true)}
                  onBlur={() => setPhoneFocus(false)}
                  value={formData?.phone_number || ""}
                  disabled={permissions?.some(p =>
                    p.name.includes('update')) ? false : true} />
              </div>
              <p style={{ backgroundColor: "lightgreen", width: "40%", borderRadius: "10px", marginTop: "2px", marginLeft: "600px" }} className={phoneFocus && !validPhone ? "visible" : "hide"}><i className="bi bi-exclamation-circle-fill" style={{ color: 'red' }}></i>
                Please enter a correct phone number</p>

              {/* Fax Number */}
              <div className="col-md-6">
                <label htmlFor="fax_number" className="form-label fw-semibold required">{t('faxnumber')}</label>
                <input type="number" name="fax_number" id="fax_number" className="form-control" onChange={handleChange} value={formData?.fax_number || ""}
                  disabled={permissions?.some(p =>
                    p.name.includes('update')) ? false : true} />
              </div>

              {/* P.O. Box */}
              <div className="col-md-6">
                <label htmlFor="po_box" className="form-label fw-semibold required">{t('pobox')}</label>
                <input type="number" name="po_box" id="po_box" className="form-control" onChange={handleChange} value={formData?.po_box || ""}
                  disabled={permissions?.some(p =>
                    p.name.includes('update')) ? false : true} />
              </div>

              {/* Tin Number */}
              <div className="col-md-6">
                <label htmlFor="tin_number" className="form-label fw-semibold required">{t('tinnumber')}</label>
                <input type="number" name="tin_number" id="tin_number" className="form-control" onChange={handleChange} value={formData?.tin_number || ""}
                  disabled={permissions?.some(p =>
                    p.name.includes('update')) ? false : true} />
              </div>

              {/* Abbreviation */}
              <div className="col-md-6">
                <label htmlFor="abbreviation" className="form-label fw-semibold required">{t('abbreviation')}</label>
                <input type="text" name="abbreviation" id="abbreviation" className="form-control" onChange={handleChange} value={formData?.abbreviation || ""}
                  disabled={permissions?.some(p =>
                    p.name.includes('update')) ? false : true} />
              </div>
            </div>


            <div className="mt-5">
              <button type="button" className="btn btn-primary" onClick={(e) => handleCreateInformation(e)}
                disabled={permissions?.some(p =>
                  p.name.includes('update')) ? false : true}>{t('update')}</button>
            </div>
          </form>


        </div>
      </div>

    </>
  )
}
