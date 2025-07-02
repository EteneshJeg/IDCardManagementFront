
import { useState,useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { addRole,getRole } from "../features/roleSlice";
import { toast } from "react-toastify";



export default function Role(){
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
  const {roles}=useSelector((state=>state.role));

  const [selectedFilter, setSelectedFilter] = useState("show all");
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    name: '',
    
  });
  const [selectedRoles, setSelectedRoles] = useState({});
  const [startSelection, setStartSelection] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    
  })
  const [searchItem, setSearch] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [userdata, setUserData] = useState([]);



  useEffect(() => {
    dispatch(getRole())
      .then((data) => {
        const dataitem = data.payload;
        console.log(dataitem)

        const normalizedData = Array.isArray(dataitem) ? dataitem : [dataitem];
        setUserData(normalizedData);
      })
      .catch((error) => {
        console.log('Error fetching data', error);
      });
  }, [dispatch, roles]);

  useEffect(() => {
    console.log('userdata type check:', Array.isArray(userdata), userdata);
  }, [userdata]);

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

  

  const handleSaveUser = () => {
    if (!formData.name ) {
      toast.error('There are missing fields');
      return;
    } else {
     
        

          dispatch(addRole({ rawForm: formData, Date: getDate() }));

          setIsModalOpen(false);

        


      
    }
    setIsModalOpen(false);
  }

  const handleUpdateUser = (Id) => {
    //dispatch(updateUser({ Id: Id, FormData: formData }))
    setIsEditModalOpen(false);
  }

  const handleDeleteUser = (id) => {
    console.log(id)
    //dispatch(deleteUser({ id: id }))
    setIsDeleteModalOpen(false)
  }



  const handleSelectedRows = (rowId) => {
    setSelectedRoles((prev) => {
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

    if (Object.keys(selectedRoles).length === userdata.length) {



      setSelectedRoles({});

      setStartSelection({});

    } else {



      const newSelected = {};

      userdata.forEach((user) => {

        newSelected[user.id] = true;

      });

      setSelectedRoles(newSelected);

      setStartSelection(newSelected)

    }

  };

  const handleDeleteBunch = () => {
    console.log(selectedRoles);
    dispatch(deleteBunch(selectedRoles));
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

  }
    return(
        <>
        <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
        <div
          id="kt_app_toolbar_container"
          className="app-container container-xxl d-flex flex-stack"
        >
          {/* Title and Breadcrumbs */}
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
            <h1 className="page-heading text-dark fw-bold fs-3 my-0">
              Role Management
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
              <li className="breadcrumb-item text-muted">Role Management</li>
            </ul>
          </div>

          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <a
              href="#"
              className="btn btn-sm fw-bold btn-primary"
              onClick={(e) => {
                e.preventDefault();
                setIsModalOpen(true);
              }}
            >
              Add Role
            </a>

            <a
              href="#"
              className={Object.keys(selectedRoles).length > 0

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
                    <h5 className="modal-title">Add Role</h5>

                  </div>

                  <fieldset>
                    <legend className="text-start">Role Details</legend>
                    <form className="p-5 bg-white rounded shadow-sm text-start">
                      <div className="row g-4">
                        
                        <div className="col-md-6">
                          <label className="form-label fw-semibold required">Name</label>
                          <input type="email"
                            className="form-control"
                            name="name"
                            onChange={(e) => handleChange(e)}
                            required
                            placeholder="Role name"></input>
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

          <div id="kt_app_content" className="app-content flex-column-fluid">
        <div id="kt_app_content_container" className="app-container container-xxl">
          <div className="row g-5 g-xl-10">
            <div className="card card-flush h-xl-100">
                <div className="card-header pt-7">
                {/*begin::Title*/}
                <h3 className="card-title align-items-start flex-column">
                  <span className="card-label fw-bold text-gray-800">Roles table</span>

                </h3>
                {/*end::Title*/}
                
              </div>
              <div className="card-body pt-2">
                {/*begin::Table*/}
                <table className="table table-striped align-middle table-row-dashed fs-6 gy-3" id="kt_table_widget_4_table">
                  {/*begin::Table head*/}
                  <thead>
                    {/*begin::Table row*/}
                    <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                      <th className="min-w-100px">
                        <input
                          type="checkbox"
                          checked={Object.keys(selectedRoles).length === userdata.length}
                          onChange={handleSelectAll}
                          title={Object.keys(selectedRoles).length === userdata.length ? 'Deselect All' : 'Select All'}
                          style={{ cursor: 'pointer' }}
                        />
                      </th>
                      <th className="min-w-100px">#</th>
                      <th className="text-start min-w-100px">Name</th>
                      <th className="text-start min-w-100px">Action</th>

                    </tr>
                    {/*end::Table row*/}
                  </thead>
                  <tbody className="fw-bold text-gray-600">
                    {Array.isArray(userdata) ? (
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
                                  <input type="checkbox" checked={!!selectedUsers[row.id]} onChange={() => handleSelectedRows(row.id)} />
                                </td>
                                <td className="text-start">
                                  {index + 1}
                                </td>
                                
                                <td className="text-start">
                                  {row.name}
                                </td>
                               
                                <td className="text-start">
                                  <button className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2" onClick={() => { setIsShowModalOpen(true), setSelectedUser(row) }}> <i className="bi bi-eye-fill fs-4"></i></button>

                                  {isShowModalOpen && (

                                    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} >
                                      <div className="modal-dialog modal-dialog-centered" role="document">
                                        <div className="modal-content p-5 bg-white rounded shadow-sm">
                                          <fieldset>
                                            <legend>Role Details</legend>
                                            <div className="field-value">
                                              <label className="field">Name</label>
                                              <p >{selectedUser.name}</p>
                                            </div>
                                            <br />
                                            

                                          </fieldset>
                                          <div className="modal-footer">
                                            <button
                                              type="button"
                                              className="btn btn-light"
                                              onClick={() => setIsShowModalOpen(false)}
                                            >
                                              Close
                                            </button>

                                          </div>
                                        </div>
                                      </div>
                                    </div>



                                  )}

                                  <button className="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-2" onClick={() => { setIsEditModalOpen(true), setSelectedUser(row) }}><i className="bi bi-pencil-fill"></i></button>
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
                                            <h5 className="modal-title">Edit Role</h5>

                                          </div>

                                          <fieldset>
                                            <legend className="text-start">Edit Details</legend>
                                            <form className="p-5 bg-white rounded shadow-sm text-start">
                                              <div className="row g-4">
                                                
                                                <div className="col-md-6">
                                                  <label className="fw-semibold">Role name</label>
                                                  <input type="text"
                                                    className="form-control"
                                                    name="name"
                                                    onChange={(e) => handleChange(e)}
                                                    required
                                                  ></input>
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
                                  <button className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm" onClick={() => { setSelectedUser(row), setIsDeleteModalOpen(true) }}><i className="bi bi-trash-fill"></i></button>
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
                                            <legend>Role Details</legend>
                                            <p>Delete Role?</p>

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
                        <tr><td colSpan="8">No data available</td></tr>
                      )
                    ) : (
                      <tr>
                        <td colSpan="8">No users found</td>
                      </tr>
                    )}





                  </tbody>
                  </table>
                  </div>
            </div>
            </div>
            </div>
            </div>
        </>
    )
}