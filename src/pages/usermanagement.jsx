import { useEffect } from "react";


import { useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify";

import { addUser, deleteUser, updateUser, getUser, deleteBunch } from "../features/userSlice";
import { fetchRoles } from "../features/roleSlice";
import { useTranslation } from "react-i18next";

export default function UserManagement() {
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
  const { users } = useSelector((state => state.user));
  const { user } = useSelector((state => state.user.user));

  const [selectedFilter, setSelectedFilter] = useState("show all");
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRoleSelectionOpen, setIsRoleSelectionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState({
    name: '',
    email: '',
    password: '',
    first_time: '',
    active: '',
    profile_image: '' || 'No image available',
    role: ''
  });
  const [selectedUsers, setSelectedUsers] = useState({});
  const [startSelection, setStartSelection] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    first_time: '',
    active: '',
    profile_image: '' || 'No image available',
    role: ''
  })
  const [searchItem, setSearch] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [userdata, setUserData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const role = useSelector((state) => state.user.role);
  const [currentRole, setCurrentRole] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  console.log(role)



  useEffect(() => {
    setIsLoading(true);
    dispatch(getUser())
      .then((data) => {
        const dataitem = data.payload;
        console.log(dataitem)

        const normalizedData = Array.isArray(dataitem) ? dataitem : [dataitem];
        setUserData(normalizedData);
      })
      .catch((error) => {
        console.log('Error fetching data', error);
      })
      .finally(() => setIsLoading(false));
  }, [dispatch, users]);

  useEffect(() => {
    console.log('userdata type check:', Array.isArray(userdata), userdata);
  }, [userdata]);

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
      setRoles(normalizedData);
      if (role?.length !== 0) {
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
        const rolesExist = dataitem.filter(data => currentRole?.includes(data.name)).map(data => ({
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(userdata.length / itemsPerPage);

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  console.log('bfr slice', userdata)


  const currentdata = Array.isArray(userdata) ? userdata.slice(firstItemIndex, lastItemIndex) : [userdata].slice(firstItemIndex, lastItemIndex);


  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }



  useEffect(() => {
    if (selectedFilter === "show all") {
      setFilteredData(userdata);
    } else {
      const filtered = userdata.filter(
        (data) => data.roles?.some((role => role.name.includes(selectedFilter)))
      );
      console.log(filtered)
      setFilteredData(filtered);
    }
  }, [selectedFilter, userdata]);


  const imageUploader = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profile_image: file });
      }
      reader.readAsDataURL(file);
    }

  }


  const getDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0]
  }

  const USERNAME_REGX = /^[\p{L}\s\-.'’]+$/u;
  const EMAIL_REGX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/;

  const [validUsername, setValidUsername] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPwd, setValidPwd] = useState(false);
  const [validConfPwd, setValidConfPwd] = useState(false);

  useEffect(() => {
    const res = USERNAME_REGX.test(formData.name);
    console.log(res);
    console.log(formData.name);
    setValidUsername(res);
  }, [formData]);

  useEffect(() => {
    const res = EMAIL_REGX.test(formData.email);
    console.log(res);
    console.log(formData.email);
    setValidEmail(res);
  }, [formData]);

  useEffect(() => {
    const res = PWD_REGEX.test(formData.password);
    console.log(res);
    console.log(formData.password);
    setValidPwd(res);
  }, [formData]);

  useEffect(() => {
    const res = PWD_REGEX.test(confPassword);
    console.log(res);
    console.log(confPassword);
    const match = formData.password === confPassword
    setValidConfPwd(match);
  }, [formData, confPassword]);

  const [usernameFocus, setUsernameFocus] = useState();
  const [emailFocus, setEmailFocus] = useState();
  const [passwordFocus, setPasswordFocus] = useState();
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState();

  const handleSaveUser = () => {
    if (!validUsername || !validEmail || !validPwd) {
      toast.error(t('therearemissingfields'));
      return;
    } else {
      if (validPwd == validConfPwd) {

        console.log('adding');
        dispatch(addUser({ rawForm: formData, Date: getDate() }));

        setIsModalOpen(false);




      } else {
        console.log(validPwd);
        console.log(valid)
        toast.error(t('passwordmismatch'));
        return;
      }
    }
    setIsModalOpen(false);
  }

  const handleUpdateUser = (Id) => {
    if (!validUsername || !validEmail || !validPwd) {
      toast.error(t('therearemissingfields'));
      return;
    }
    else {
      dispatch(updateUser({ Id: Id, rawForm: formData }))
      setIsEditModalOpen(false);
    }

  }

  const handleDeleteUser = (id) => {
    console.log(id)
    dispatch(deleteUser({ id: id }))
    setIsDeleteModalOpen(false)
  }



  const handleSelectedRows = (rowId) => {
    setSelectedUsers((prev) => {
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

    if (Object.keys(selectedUsers).length === userdata.length) {



      setSelectedUsers({});

      setStartSelection({});

    } else {



      const newSelected = {};

      userdata.forEach((user) => {

        newSelected[user.id] = true;

      });

      setSelectedUsers(newSelected);

      setStartSelection(newSelected)

    }

  };

  const handleDeleteBunch = () => {
    console.log(selectedUsers);
    dispatch(deleteBunch(selectedUsers));
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

  }
  console.log(formData)
  const handleRoleChange = (roleId) => {
    setFormData(prev => {
      const newRoles = [...prev?.role];
      const index = newRoles.indexOf(roleId);

      if (index > -1) {
        newRoles.splice(index, 1);
      } else {
        newRoles.push(roleId);
      }

      return { ...prev, role: newRoles };
    });


  };
  console.log(formData)
  console.log(selectedRoles)


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
  console.log(selectedUser);

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
              {t('usermanagement')}
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
              <li className="breadcrumb-item text-muted">{t('usermanagement')}</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            {permissions.some(p =>
              p.name.includes('create User')) ? (<a
                href="#"
                className="btn btn-sm fw-bold btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setIsModalOpen(true);
                }}
              >
                {t('adduser')}
              </a>) : null}

            {permissions.some(p =>
              p.name.includes('delete User')) ? (<a
                href="#"
                className={Object.keys(selectedUsers).length > 0

                  ? "btn btn-sm fw-bold bg-body btn-color-gray-700 btn-active-color-primary"

                  : "hide"

                }
                onClick={handleDeleteBunch}
              >
                {t('deleteselected')}
              </a>) : null}
          </div>

          {isModalOpen && (
            <div
              className="modal fade show"
              tabIndex="-1"
              id="kt_modal_scrollable_1"
              style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{t('adduser')}</h5>
                    <span className="svg-icon svg-icon-1" onClick={() => setIsModalOpen(false)}>
                      <CloseIcon />
                    </span>
                  </div>

                  <fieldset>
                    <legend className="text-start">{t('userdetails')}</legend>
                    <form className="p-5 bg-white rounded shadow-sm text-start">
                      <div className="row g-4">
                        <div className="col-md-6">
                          <input type="file" onChange={imageUploader}></input>
                          <label className="form-label fw-semibold required">{t('username')}</label>
                          <input type="text"
                            className="form-control"
                            name="name"
                            onChange={(e) => handleChange(e)}
                            required
                            onFocus={() => setUsernameFocus(true)}
                            onBlur={() => setUsernameFocus(false)}
                            placeholder={t('name')}></input>
                        </div>
                        <p style={{ backgroundColor: "lightgreen", width: "60%", borderRadius: "10px", margin: "2px 0px" }} className={usernameFocus && !validUsername ? "visible" : "hide"}><i className="bi bi-exclamation-circle-fill" style={{ color: 'red' }}></i>
                          Please enter a correct username</p>
                        <br />
                        <div className="col-md-6">
                          <label className="form-label fw-semibold required">{t('email')}</label>
                          <input type="email"
                            className="form-control"
                            name="email"
                            onChange={(e) => handleChange(e)}
                            required
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                            placeholder={t('email')}></input>
                        </div>
                        <p style={{ backgroundColor: "lightgreen", width: "60%", borderRadius: "10px", margin: "2px 200px" }} className={emailFocus && !validEmail ? "visible" : "hide"}><i className="bi bi-exclamation-circle-fill" style={{ color: 'red' }}></i>
                          Please enter a correct email</p>
                        <br />
                        <div className="col-md-6">
                          <label className="form-label fw-semibold required">{t('role')}</label>

                          {/* Toggle button */}
                          <div className="mb-3">
                            {/* Role selection toggle button */}
                            <div
                              className="btn btn-primary w-100 text-start d-flex flex-wrap align-items-center gap-2 px-3 py-2"
                              onClick={() => setIsRoleSelectionOpen(!isRoleSelectionOpen)}
                              style={{
                                minHeight: "48px",
                                borderRadius: "0.5rem",
                                cursor: "pointer",
                              }}
                            >
                              {formData?.role?.length === 0 ? (
                                <span className="text-muted">{t('selectroles')}</span>
                              ) : (
                                roles
                                  .filter((role) => formData.role?.includes(role.id))
                                  .map((role) => (
                                    <span
                                      key={role.id}
                                      className="badge d-flex align-items-center bg-primary text-white px-2 py-1 me-1"
                                      style={{
                                        borderRadius: "1rem",
                                        fontSize: "0.85rem",
                                      }}
                                    >
                                      {role.name}
                                      <button
                                        type="button"
                                        className="btn-close btn-close-white btn-sm ms-2"
                                        aria-label="Remove"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRoleChange(role.id);
                                        }}
                                        style={{ fontSize: "0.65rem", marginLeft: "0.5rem" }}
                                      />
                                    </span>
                                  ))
                              )}
                            </div>

                            {/* Role checkbox list */}
                            {isRoleSelectionOpen && (
                              <div
                                className="border rounded mt-2 p-3 bg-light shadow-sm"
                                style={{
                                  maxHeight: "200px",
                                  overflowY: "auto",
                                  borderRadius: "0.5rem",
                                }}
                              >
                                {roles.map((role) => (
                                  <div className="form-check mb-2" key={role.id}>
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={`role-${role.id}`}
                                      checked={formData.role?.includes(role.id)}
                                      onChange={() => handleRoleChange(role.id)}
                                    />
                                    <label className="form-check-label" htmlFor={`role-${role.id}`}>
                                      {role.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>



                        </div>
                        <br />

                        <div className="col-md-6" >
                          <label className="form-label fw-semibold required">{t('password')}</label>
                          <input type="password"
                            className="form-control"
                            name="password"
                            onChange={(e) => handleChange(e)}
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)}
                            required
                            placeholder={t('password')}></input>
                        </div>
                        <p style={{ backgroundColor: "lightgreen", width: "80%", borderRadius: "10px", margin: "2px 110px" }} className={passwordFocus && !validPwd ? "visible" : "hide"}>
                          <i className="bi bi-exclamation-circle-fill" style={{ color: 'red' }}></i>8 to 24 characters.<br />
                          Must include uppercase and lowercase letters, a number and a special character.<br /></p>
                        <br />
                        <div className="col-md-6">
                          <label className="form-label fw-semibold required">{t('confirmpassword')}</label>
                          <input type="password"
                            name="confPassword"
                            className="form-control"
                            onChange={(e) => setConfPassword(e.target.value)}
                            onFocus={(e) => setConfirmPasswordFocus(true)}
                            onBlur={(e) => setConfirmPasswordFocus(false)}
                            required
                            placeholder={t('confirmpassword')}></input>
                        </div>
                        <p style={{ backgroundColor: "lightgreen", width: "60%", borderRadius: "10px", margin: "2px 0px" }} className={confirmPasswordFocus && !validConfPwd ? "visible" : "hide"}>
                          <i className="bi bi-exclamation-circle-fill" style={{ color: 'red' }}></i>
                          Passwords must match
                        </p>
                      </div>

                    </form>

                  </fieldset>

                  <div className="modal-footer">

                    <button type="button" className="btn btn-primary" onClick={handleSaveUser}>
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
                  <span className="card-label fw-bold text-gray-800">{t('userstable')}</span>

                </h3>
                {/*end::Title*/}
                {/*begin::Actions*/}
                <div className="card-toolbar">
                  {/*begin::Filters*/}
                  <div className="d-flex flex-stack flex-wrap gap-4">
                    {/*begin::Destination*/}
                    <div className="d-flex align-items-center fw-bold">
                      {/*begin::Label*/}
                      <div className="text-gray-400 fs-7 me-2">{t('role')}</div>
                      {/*end::Label*/}
                      {/*begin::Select*/}
                      <select
                        className="form-select form-select-transparent text-gray-800 fs-base lh-1 fw-bold py-0 ps-3 w-auto"
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                      >
                        <option value="show all">{t('showall')}</option>
                        {roles.map((data) => {
                          return (
                            <option key={data.id} value={data.name}>
                              {data.name}
                            </option>
                          );
                        })}
                      </select>


                      {/*end::Select*/}
                    </div>
                    {/*end::Destination*/}

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
                            checked={Object.keys(selectedUsers).length === userdata.length}
                            onChange={handleSelectAll}
                            title={Object.keys(selectedUsers).length === userdata.length ? 'Deselect All' : 'Select All'}
                            style={{ cursor: 'pointer' }}
                          />{t('sn')}.
                        </div>
                      </th>

                      <th className="text-start min-w-100px">{t('name')}</th>
                      <th className="text-start min-w-125px">{t('email')}</th>
                      <th className="text-start min-w-100px">{t('role')}</th>
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
                          <Loader /> {/* Use the loader here */}
                        </td>
                      </tr>
                    ) :
                      Array.isArray(userdata) ? (
                        currentdata.length > 0 ? (
                          currentdata.filter((row) => {
                            const matchSearch = searchItem.toLowerCase() === '' ? row : String(row.name).toLowerCase().includes(searchItem);
                            const filterLower = selectedFilter.toLowerCase();
                            const matchFilter =
                              filterLower === 'show all' ||
                              (Array.isArray(row.roles) && row.roles.some(role => {
                                const roleNameLower = role.name.toLowerCase();
                                console.log("Checking role:", roleNameLower);
                                return roleNameLower.includes(filterLower);
                              }));
                            //  console.log(matchFilter)

                            return matchSearch && matchFilter
                          })
                            .map((row, index) => {

                              return (
                                <tr key={index} data-kt-table-widget-4="subtable_template">
                                  <td >
                                    <div className="d-flex align-items-center gap-4">
                                      <input type="checkbox"
                                        checked={!!selectedUsers[row.id]}
                                        onChange={() => handleSelectedRows(row.id)} />
                                      {index + 1}
                                    </div>
                                  </td>


                                  <td className="text-start">
                                    {row.name}
                                  </td>
                                  <td className="text-start">
                                    {row.email}
                                  </td>
                                  <td className="text-start">
                                    {row.roles.map(data => data.name).join(",") || row?.roles[0]?.name}
                                  </td>
                                  <td className="text-start">

                                    {permissions.some(p =>
                                      p.name.includes('read User')) ? (<button className="btn btn-icon btn-bg-light btn-color-primary btn-sm me-2"
                                        onClick={() => { setIsShowModalOpen(true), setSelectedUser(row) }}>
                                        <i className="bi bi-eye-fill"></i></button>) : null}


                                    {isShowModalOpen && (

                                      <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} >
                                        <div className="modal-dialog modal-dialog-centered" role="document">
                                          <div className="modal-content">
                                            <div className="modal-header">
                                              <h5 className="modal-title">User Details</h5>
                                              <div
                                                className="btn btn-icon btn-sm btn-active-icon-primary"
                                                onClick={() => setIsShowModalOpen(false)}
                                              >
                                                <span className="svg-icon svg-icon-1">
                                                  <CloseIcon />
                                                </span>
                                              </div>
                                            </div>
                                            <div className="modal-body">


                                              <div className="mb-3">
                                                <div className="form-label fw-semibold">{t('name')}</div>
                                                <div className="form-control form-control-solid">{selectedUser.name}</div>
                                              </div>
                                              <br />
                                              <div className="mb-3">
                                                <div className="form-label fw-semibold">{t('email')}</div>
                                                <div className="form-control form-control-solid">{selectedUser.email}</div>
                                              </div>
                                              <br />
                                              <div className="mb-3">
                                                <div className="form-label fw-semibold">{t('role')}</div>
                                                <div className="form-control form-control-solid">{selectedUser.role}</div>
                                              </div>

                                              <br />



                                            </div>
                                          </div>


                                        </div>
                                      </div>



                                    )}

                                    {permissions.some(p =>
                                      p.name.includes('update User')) ?
                                      (<button className="btn btn-icon btn-bg-light btn-color-warning btn-sm me-2" onClick={() => {
                                        setFormData(row);
                                        setIsEditModalOpen(true),
                                          setSelectedUser(row)
                                      }}><i className="bi bi-pencil-fill"></i></button>) : null}

                                    {isEditModalOpen && (
                                      <div
                                        className="modal fade show d-block"
                                        tabIndex="-1"
                                        id="kt_modal_scrollable_1"
                                        style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}

                                      >
                                        <div className="modal-dialog">
                                          <div className="modal-content">
                                            <div className="modal-header">
                                              <h5 className="modal-title">{t('edituser')}</h5>
                                              <span className="svg-icon svg-icon-1"
                                                onClick={() => { setIsEditModalOpen(false) }}>
                                                <CloseIcon />
                                              </span>
                                            </div>

                                            <fieldset>
                                              <legend className="text-start">{t('editdetails')}</legend>
                                              <form className="p-5 bg-white rounded shadow-sm text-start">
                                                <div className="row g-4">
                                                  <div className="col-md-6">
                                                    <input type="file" onChange={imageUploader}></input>
                                                    <label className="fw-semibold form-label required">{t('username')}</label>
                                                    <input type="text"
                                                      className="form-control"
                                                      name="name"
                                                      onChange={(e) => handleChange(e)}
                                                      value={formData?.name || ''}
                                                      required
                                                      onFocus={() => setUsernameFocus(true)}
                                                      onBlur={() => setUsernameFocus(false)}
                                                    ></input>
                                                  </div>
                                                  <p style={{ backgroundColor: "lightgreen", width: "60%", borderRadius: "10px", margin: "2px 0px" }} className={usernameFocus && !validUsername ? "visible" : "hide"}><i className="bi bi-exclamation-circle-fill" style={{ color: 'red' }}></i>
                                                    Please enter a correct username</p>
                                                  <br />
                                                  <div className="col-md-6">
                                                    <label className="fw-semibold form-label required">{t('email')}</label>
                                                    <input type="email"
                                                      className="form-control"
                                                      name="email"
                                                      value={formData?.email || ''}
                                                      onChange={(e) => handleChange(e)}
                                                      onFocus={() => setEmailFocus(true)}
                                                      onBlur={() => setEmailFocus(false)}
                                                      required
                                                    ></input>
                                                  </div>
                                                  <p style={{ backgroundColor: "lightgreen", width: "60%", borderRadius: "10px", margin: "2px 200px" }} className={emailFocus && !validEmail ? "visible" : "hide"}><i className="bi bi-exclamation-circle-fill" style={{ color: 'red' }}></i>
                                                    Please enter a correct email</p>
                                                  <br />
                                                  <div className="col-md-6">
                                                    <label className="form-label fw-semibold required">{t('role')}</label>

                                                    {/* Toggle button */}
                                                    <div className="mb-3">
                                                      {/* Role selection toggle button */}
                                                      <div
                                                        className="btn btn-outline-secondary w-100 text-start d-flex flex-wrap align-items-center gap-2 px-3 py-2"
                                                        onClick={() => setIsRoleSelectionOpen(!isRoleSelectionOpen)}
                                                        value={formData.role || ''}
                                                        style={{
                                                          minHeight: "48px",
                                                          borderRadius: "0.5rem",
                                                          cursor: "pointer",
                                                        }}
                                                      >
                                                        {formData?.role?.length === 0 ? (
                                                          <span className="text-muted">{t('selectroles')}</span>
                                                        ) : (
                                                          roles
                                                            .filter((role) => formData?.role?.includes(role.id))
                                                            .map((role) => (
                                                              <span
                                                                key={role.id}
                                                                className="badge d-flex align-items-center bg-primary text-white px-2 py-1 me-1"
                                                                style={{
                                                                  borderRadius: "1rem",
                                                                  fontSize: "0.85rem",
                                                                }}
                                                              >
                                                                {role.name}
                                                                <button
                                                                  type="button"
                                                                  className="btn-close btn-close-white btn-sm ms-2"
                                                                  aria-label="Remove"
                                                                  onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRoleChange(role.id);
                                                                  }}
                                                                  style={{ fontSize: "0.65rem", marginLeft: "0.5rem" }}
                                                                />
                                                              </span>
                                                            ))
                                                        )}
                                                      </div>

                                                      {/* Role checkbox list */}
                                                      {isRoleSelectionOpen && (
                                                        <div
                                                          className="border rounded mt-2 p-3 bg-light shadow-sm"
                                                          style={{
                                                            maxHeight: "200px",
                                                            overflowY: "auto",
                                                            borderRadius: "0.5rem",
                                                          }}
                                                        >
                                                          {roles.map((role) => (
                                                            <div className="form-check mb-2" key={role.id}>
                                                              <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`role-${role.id}`}
                                                                checked={formData?.role?.includes(role.id)}
                                                                onChange={() => handleRoleChange(role.id)}
                                                              />
                                                              <label className="form-check-label" htmlFor={`role-${role.id}`}>
                                                                {role.name}
                                                              </label>
                                                            </div>
                                                          ))}
                                                        </div>
                                                      )}
                                                    </div>



                                                  </div>
                                                  <br />

                                                  <div className="col-md-6" >
                                                    <label className="fw-semibold form-label required">{t('password')}</label>
                                                    <input type="password"
                                                      className="form-control"
                                                      name="password"
                                                      value={formData?.password || ''}
                                                      onChange={(e) => handleChange(e)}
                                                      required
                                                    ></input>
                                                  </div>
                                                  <br />
                                                  <div className="col-md-6">
                                                    <label className="fw-semibold form-label required">{t('confirmpassword')}</label>
                                                    <input type="password"
                                                      name="confPassword"
                                                      className="form-control"
                                                      onChange={(e) => setConfPassword(e.target.value)}
                                                      value={formData?.password || ''}
                                                      required
                                                      placeholder={t('confirmpassword')}></input>
                                                  </div>
                                                </div>



                                              </form>

                                            </fieldset>

                                            <div className="modal-footer">

                                              <button type="button" className="btn btn-primary" onClick={() => handleUpdateUser(selectedUser.id)}>
                                                {t('savechanges')}
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {permissions.some(p =>
                                      p.name.includes('delete User')) ? (
                                      <button className="btn btn-icon btn-bg-light btn-color-danger btn-sm"
                                        onClick={() => { setSelectedUser(row), setIsDeleteModalOpen(true) }}><i className="bi bi-trash-fill"></i></button>) : null}



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
                                                {t('confirmuserdeletion')}
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
                                                {t('areyousureyouwanttopermanentlydeletethisuser')}
                                                <br />
                                                {t('thisactioncannotbeundone')}
                                              </p>
                                            </div>

                                            {/* Modal Footer */}
                                            <div className="modal-footer">
                                              <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() => handleDeleteUser(selectedUser.id)}
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
                          <tr className="text-center"><td colSpan="8">{t('loading')}</td></tr>
                        )
                      ) : (
                        <tr>
                          <td colSpan="8">{t('nousersfound')}</td>
                        </tr>
                      )}





                  </tbody>
                  {/*end::Table body*/}
                </table>
                <div className="pagination d-flex justify-content-between align-items-center mt-5">
                  <div>
                    {t('showing')} {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} to{' '}
                    {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
                    {filteredData.length} {t('entries')}
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
                {/*end::Table*/}
              </div>
              {/*end::Card body*/}
            </div>
          </div>



        </div>


      </div>







    </>
  );
}
