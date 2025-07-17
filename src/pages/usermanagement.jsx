import { useEffect } from "react";


import { useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify";

import { addUser, deleteUser, updateUser, getUser, deleteBunch } from "../features/userSlice";
import { fetchRoles } from "../features/roleSlice";

export default function UserManagement() {

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

  const [selectedFilter, setSelectedFilter] = useState("show all");
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState({
    name: '',
    email: '',
    password: '',
    first_time: '',
    active: '',
    profile_image: '' || 'No image available'
  });
  const [selectedUsers, setSelectedUsers] = useState({});
  const [startSelection, setStartSelection] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    first_time: '',
    active: '',
    profile_image: '' || 'No image available'
  })
  const [searchItem, setSearch] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [userdata, setUserData] = useState([]);
  const [roles,setRoles]=useState([]);



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


  useEffect(()=>{
    dispatch(fetchRoles()).then((data)=>{
      const dataitem=data.payload;
      const normalizedData = Array.isArray(dataitem) ? dataitem : [dataitem];
      setRoles(normalizedData);
    }).catch((error) => {
        console.log('Error fetching data', error);
      })
      .finally(() => setIsLoading(false));
  },[dispatch]);

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
        (data) => data.role?.toLowerCase() === selectedFilter.toLowerCase()
      );
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

  const validateForm = (formData) => {



    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {

      toast.error('Email format is incorrect');

      return false;

    }

    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/.test(formData.password)) {

      toast.error('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');

      return false;

    }

    else return true;

  }

  const handleSaveUser = () => {
    if (!formData.name || !formData.email || !formData.profile_image || !formData.password) {
      toast.error('There are missing fields');
      return;
    } else {
      if (formData.password == confPassword) {
        if (validateForm(formData)) {

          dispatch(addUser({ rawForm: formData, Date: getDate() }));

          setIsModalOpen(false);

        }


      } else {
        toast.error('Password mismatch');
        return;
      }
    }
    setIsModalOpen(false);
  }

  const handleUpdateUser = (Id) => {
    dispatch(updateUser({ Id: Id, rawForm: formData }))
    setIsEditModalOpen(false);
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
              User Management
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
              <li className="breadcrumb-item text-muted">User Management</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <a
              href="#"
              className="btn btn-sm fw-bold btn-primary"
              onClick={(e) => {
                e.preventDefault();
                setIsModalOpen(true);
              }}
            >
              Add User
            </a>

            <a
              href="#"
              className={Object.keys(selectedUsers).length > 0

                ? "btn btn-sm fw-bold bg-body btn-color-gray-700 btn-active-color-primary"

                : "hide"

              }
              onClick={handleDeleteBunch}
            >
              Delete Selected
            </a>
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
                    <h5 className="modal-title">Add User</h5>

                  </div>

                  <fieldset>
                    <legend className="text-start">User Details</legend>
                    <form className="p-5 bg-white rounded shadow-sm text-start">
                      <div className="row g-4">
                        <div className="col-md-6">
                          <input type="file" onChange={imageUploader}></input>
                          <label className="form-label fw-semibold required">Username</label>
                          <input type="text"
                            className="form-control"
                            name="name"
                            onChange={(e) => handleChange(e)}
                            required
                            placeholder="Name"></input>
                        </div>
                        <br />
                        <div className="col-md-6">
                          <label className="form-label fw-semibold required">Email</label>
                          <input type="email"
                            className="form-control"
                            name="email"
                            onChange={(e) => handleChange(e)}
                            required
                            placeholder="Email"></input>
                        </div>
                        <br />
                        <div className="col-md-6">
                          <label className="form-label fw-semibold required">Role</label>
                          <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                            <option value="">Select</option>
                            {roles.map((data) => (
                          <option key={data.id} value={data.id}>
                            {data.name}
                          </option>
                        ))}
                          </select>
                        </div>
                        <br />

                        <div className="col-md-6" >
                          <label className="form-label fw-semibold required">Password</label>
                          <input type="password"
                            className="form-control"
                            name="password"
                            onChange={(e) => handleChange(e)}
                            required
                            placeholder="Password"></input>
                        </div>
                        <br />
                        <div className="col-md-6">
                          <label className="form-label fw-semibold required">Confirm Password</label>
                          <input type="password"
                            name="confPassword"
                            className="form-control"
                            onChange={(e) => setConfPassword(e.target.value)}
                            required
                            placeholder="Confirm Password"></input>
                        </div>
                      </div>

                    </form>

                  </fieldset>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Close
                    </button>
                    <button type="button" className="btn btn-primary" onClick={handleSaveUser}>
                      Save changes
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
                  <span className="card-label fw-bold text-gray-800">Users table</span>

                </h3>
                {/*end::Title*/}
                {/*begin::Actions*/}
                <div className="card-toolbar">
                  {/*begin::Filters*/}
                  <div className="d-flex flex-stack flex-wrap gap-4">
                    {/*begin::Destination*/}
                    <div className="d-flex align-items-center fw-bold">
                      {/*begin::Label*/}
                      <div className="text-gray-400 fs-7 me-2">Role</div>
                      {/*end::Label*/}
                      {/*begin::Select*/}
                      <select
                        className="form-select form-select-transparent text-gray-800 fs-base lh-1 fw-bold py-0 ps-3 w-auto"
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                      >
                        <option value="show all">Show All</option>
                        <option value="employee">Employee</option>
                        <option value="human resources">HR</option>
                        <option value="it assistant">IT</option>
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
                      <input type="text" data-kt-table-widget-4="search" className="form-control w-150px fs-7 ps-12" placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
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
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="checkbox"
                            checked={Object.keys(selectedUsers).length === userdata.length}
                            onChange={handleSelectAll}
                            title={Object.keys(selectedUsers).length === userdata.length ? 'Deselect All' : 'Select All'}
                            style={{ cursor: 'pointer' }}
                          />S.N.
                       </div>
                      </th>
                      
                      <th className="text-start min-w-100px">Name</th>
                      <th className="text-start min-w-125px">Email</th>
                      <th className="text-start min-w-100px">Role</th>
                      <th className="text-start min-w-100px">Action</th>

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
                          const matchFilter =
                            selectedFilter === 'show all' ||
                            row.role?.toLowerCase() === selectedFilter.toLowerCase();

                          return matchSearch && matchFilter
                        })
                          .map((row, index) => {

                            return (
                              <tr key={index} data-kt-table-widget-4="subtable_template">
                                <td >
                                  <div className="d-flex align-items-center gap-2">
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
                                  {row?.roles[0]?.name}
                                </td>
                                <td className="text-start">
                                  <button className="btn btn-icon btn-bg-light btn-color-primary btn-sm me-2" onClick={() => { setIsShowModalOpen(true), setSelectedUser(row) }}> <i className="bi bi-eye-fill fs-4"></i></button>

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
                                              <div className="form-label fw-semibold">Name</div>
                                              <div className="form-control form-control-solid">{selectedUser.name}</div>
                                            </div>
                                            <br />
                                            <div className="mb-3">
                                              <div className="form-label fw-semibold">Email</div>
                                              <div className="form-control form-control-solid">{selectedUser.email}</div>
                                            </div>
                                            <br />
                                            <div className="mb-3">
                                              <div className="form-label fw-semibold">Role</div>
                                              <div className="form-control form-control-solid">{selectedUser.role}</div>
                                            </div>

                                            <br />

                                         
                                          
                                        </div>
                                        </div>
                                        
                                        
                                      </div>
                                    </div>



                                  )}

                                  <button className="btn btn-icon btn-bg-light btn-color-warning btn-sm me-2" onClick={() => { setIsEditModalOpen(true), setSelectedUser(row) }}><i className="bi bi-pencil-fill"></i></button>
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
                                            <h5 className="modal-title">Edit User</h5>

                                          </div>

                                          <fieldset>
                                            <legend className="text-start">Edit Details</legend>
                                            <form className="p-5 bg-white rounded shadow-sm text-start">
                                              <div className="row g-4">
                                                <div className="col-md-6">
                                                  <input type="file" onChange={imageUploader}></input>
                                                  <label className="fw-semibold">Username</label>
                                                  <input type="text"
                                                    className="form-control"
                                                    name="name"
                                                    onChange={(e) => handleChange(e)}
                                                    required
                                                    placeholder="Name"></input>
                                                </div>
                                                <br />
                                                <div className="col-md-6">
                                                  <label className="fw-semibold">Email</label>
                                                  <input type="email"
                                                    className="form-control"
                                                    name="email"
                                                    onChange={(e) => handleChange(e)}
                                                    required
                                                  ></input>
                                                </div>
                                                <br />
                                                <div className="col-md-6">
                                                  <label className="fw-semibold">Role</label>
                                                  <select className="form-select" name="role" value={formData?.role || ""} onChange={handleChange}>
                                                    <option value="">Select</option>
                                                    {roles.map((data) => (
                          <option key={data.id} value={data.id}>
                            {data.name}
                          </option>
                        ))}
                                                  </select>
                                                </div>
                                                <br />

                                                <div className="col-md-6" >
                                                  <label className="fw-semibold">Password</label>
                                                  <input type="password"
                                                    className="form-control"
                                                    name="password"
                                                    onChange={(e) => handleChange(e)}
                                                    required
                                                  ></input>
                                                </div>
                                                <br />
                                                <div className="col-md-6">
                                                  <label className="fw-semibold">Confirm Password</label>
                                                  <input type="password"
                                                    name="confPassword"
                                                    className="form-control"
                                                    onChange={(e) => setConfPassword(e.target.value)}
                                                    required
                                                    placeholder="Confirm Password"></input>
                                                </div>
                                              </div>



                                            </form>

                                          </fieldset>

                                          <div className="modal-footer">
                                            <button
                                              type="button"
                                              className="btn btn-light"
                                              onClick={() => setIsEditModalOpen(false)}
                                            >
                                              Close
                                            </button>
                                            <button type="button" className="btn btn-primary" onClick={() => handleUpdateUser(selectedUser.id)}>
                                              Save changes
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  <button className="btn btn-icon btn-bg-light btn-color-danger btn-sm" onClick={() => { setSelectedUser(row), setIsDeleteModalOpen(true) }}><i className="bi bi-trash-fill"></i></button>
                                  {isDeleteModalOpen && (
                                    <div
                                      className="modal fade show d-block"
                                      tabIndex="-1"
                                      id="kt_modal_scrollable_1"
                                      style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}

                                    >
                                      <div className="modal-dialog ">
                                        <div className="modal-content " style={{ textAlign: 'center' }}>
                                          <div className="modal-header">


                                          </div>

                                          <fieldset>
                                            <legend>User Details</legend>
                                            <p>Delete User?</p>

                                          </fieldset>

                                          <div className="modal-footer">
                                            <button
                                              type="button"
                                              className="btn btn-light"
                                              onClick={() => handleDeleteUser(selectedUser.id)}
                                            >
                                              Delete
                                            </button>

                                            <button
                                              type="button"
                                              className="btn btn-light"
                                              onClick={() => setIsDeleteModalOpen(false)}
                                            >
                                              Close
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
                        <tr className="text-center"><td colSpan="8">Loading...</td></tr>
                      )
                    ) : (
                      <tr>
                        <td colSpan="8">No users found</td>
                      </tr>
                    )}





                  </tbody>
                  {/*end::Table body*/}
                </table>
                <div className="pagination d-flex justify-content-between align-items-center mt-5">
                  <div>
                    Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} to{' '}
                    {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
                    {filteredData.length} entries
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
                      Page {currentPage} of {totalPages}
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
