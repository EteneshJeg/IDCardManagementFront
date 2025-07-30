import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addJobTitleCategory,
  deleteJobTitleCategory,
  updateJobTitleCategory,
  selectAllJobTitleCategories,
  deleteBunchCategories,
  fetchJobTitleCategories,
} from "../features/jobTitleCategorySlice";
import { fetchRoles } from "../features/roleSlice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function JobTitleCategories() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const jobTitleCategories = useSelector(selectAllJobTitleCategories);
  const { user } = useSelector((state) => state.user.user);
  const { role } = useSelector((state) => state.user.role);
  const [categoryData, setCategoryData] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  // State management
  const [permissions, setPermissions] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [currentRole, setCurrentRole] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [startSelection, setStartSelection] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent: null,
  });
  const [searchItem, setSearch] = useState("");

  // Initialize data

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
    setIsLoading(true);
    dispatch(fetchJobTitleCategories()).finally(() => setIsLoading(false));
  }, [dispatch]);

  // Sync local state with Redux
  useEffect(() => {
    if (Array.isArray(jobTitleCategories)) {
      setCategoryData(jobTitleCategories);
    } else {
      setCategoryData([]);
    }
  }, [jobTitleCategories]);

  // Filter data based on search
  const filteredData = categoryData.filter((cat) =>
    cat.name?.toLowerCase().includes(searchItem.toLowerCase())
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentdata = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSaveCategory = async () => {
    setFormErrors({});
    if (!formData.name || !formData.description) {
      toast.error(t('therearemissingfields'));
      return;
    }

    try {
      // Convert parent to string for API request
      const payload = {
        ...formData,
        parent: formData.parent !== null ? String(formData.parent) : null,
      };

      await dispatch(addJobTitleCategory(payload)).unwrap();
      toast.success(t('categoryaddedsuccessfully'));
      setIsModalOpen(false);
      setFormData({ name: "", description: "", parent: null });
    } catch (error) {
      console.error("Add category error:", error);

      if (error.errors) {
        setFormErrors(error.errors);
      } else {
        toast.error(error.message || t('failedtoaddcategory'));
      }
    }
  };

  const handleUpdateCategory = async () => {
    setFormErrors({});
    if (!formData.name || !formData.description) {
      toast.error(t('therearemissingfields'));
      return;
    }
    if (!selectedCategory?.id) return;

    try {
      // Convert parent to string for API request
      const payload = {
        ...formData,
        parent: formData.parent !== null ? String(formData.parent) : null,
      };

      await dispatch(
        updateJobTitleCategory({
          id: selectedCategory.id,
          formData: payload,
        })
      ).unwrap();

      toast.success(t('categoryupdatedsuccessfully'));
      setIsEditModalOpen(false);
      setFormData({ name: "", description: "", parent: null });
    } catch (error) {
      if (error.errors) {
        setFormErrors(error.errors);
      } else {
        toast.error(error.message || t('failedtoupdatecategory'));
      }
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory?.id) return;

    try {
      await dispatch(deleteJobTitleCategory(selectedCategory.id)).unwrap();
      toast.success(t('categorydeletedsuccessfully'));
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error(t('failedtodeletecategory'));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleParentChange = (e) => {
    const value = e.target.value;
    // Store as number for display, but convert to string for API later
    setFormData({
      ...formData,
      parent: value === "null" ? null : Number(value),
    });
  };

  const handleSelectAll = () => {
    if (Object.keys(selectedCategories).length === jobTitleCategories.length) {
      setSelectedCategories({});
    } else {
      const newSelected = {};
      jobTitleCategories.forEach((category) => {
        newSelected[category.id] = true;
      });
      setSelectedCategories(newSelected);
    }
  };

  // Close modals with reset
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setFormData({ name: "", description: "", parent: null });
    setFormErrors({});
  };

  const handleSelectedRows = (rowId) => {
    setSelectedCategories((prev) => {
      const updated = { ...prev, [rowId]: !prev[rowId] };
      setStartSelection(Object.values(updated).some((v) => v));
      if (!updated[rowId]) {
        delete updated[rowId];
      }
      return updated;
    });
  };

  const handleDeleteBunch = () => {
    const selectedIds = Object.keys(selectedCategories)
      .filter((id) => selectedCategories[id])
      .map((id) => parseInt(id));

    if (selectedIds.length > 0) {
      dispatch(deleteBunchCategories(selectedIds));
      toast.success(t('selectedcategoriesdeletedsuccessfully'));
      setSelectedCategories({});
      setStartSelection(false);
    } else {
      toast.info(t('nocategoriesselectedfordeletion'));
    }
  };

  // Close Icon Component
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

  // Script initialization
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/assets/js/scripts.bundle.js";
    script.async = true;
    script.onload = () => {
      if (window.KTApp?.init) window.KTApp.init();
    };
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  return (
    <>
      {/* Toolbar */}
      <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
        <div className="app-container container-xxl d-flex flex-stack">
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
            <h1 className="page-heading text-dark fw-bold fs-3 my-0">
              {t('jobtitlecategories')}
            </h1>
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
              <li className="breadcrumb-item text-muted">
                <a href="/" className="text-muted text-hover-primary">
                  {t('home')}
                </a>
              </li>
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted">
                {t('jobtitlecategories')}
              </li>
            </ul>
          </div>
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            {permissions?.some(p =>
              p.name.includes('create')) ? (<button
                className="btn btn-sm fw-bold btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                {t('addcategory')}
              </button>) : null}

            {permissions?.some(p =>
              p.name.includes('delete')) ? (<button
                className={`btn btn-sm fw-bold bg-body btn-color-gray-700 ${Object.keys(selectedCategories).length === 0 ? "d-none" : ""
                  }`}
                onClick={handleDeleteBunch}
              >
                {t('deleteselected')}
              </button>) : null}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div className="app-container container-xxl">
          <div className="card card-flush h-xl-100">
            <div className="card-header pt-7">
              <h3 className="card-title align-items-start flex-column">
                <span className="card-label fw-bold text-gray-800">
                  {t('categoriestable')}
                </span>
              </h3>
              <div className="card-toolbar">
                <div className="d-flex flex-stack flex-wrap gap-4">
                  <div className="position-relative my-1">
                    <span className="svg-icon svg-icon-2 position-absolute top-50 translate-middle-y ms-4">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          opacity="0.5"
                          x="17.0365"
                          y="15.1223"
                          width="8.15546"
                          height="2"
                          rx="1"
                          transform="rotate(45 17.0365 15.1223)"
                          fill="currentColor"
                        />
                        <path
                          d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    <input
                      type="text"
                      className="form-control w-150px fs-7 ps-12"
                      placeholder={t('search')}
                      value={searchItem}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body pt-2">
              <table className="table table-striped align-middle table-row-dashed fs-6 gy-3">
                <thead>
                  <tr className="text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                    <th className="min-w-50px">
                      <div className="d-flex align-items-center gap-4">
                        <input
                          type="checkbox"
                          checked={
                            Object.keys(selectedCategories).length ===
                            jobTitleCategories.length
                          }
                          onChange={handleSelectAll}
                          style={{ cursor: "pointer" }}
                        />
                        {t('sn')}.
                      </div>
                    </th>
                    <th>{t('name')}</th>
                    <th>{t('description')}</th>
                    <th>{t('parentcategory')}</th>
                    <th>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="fw-bold text-gray-600">
                  {isLoading ? (
                    <tr>
                      <td colSpan="8" className="text-center">
                        <Loader />
                      </td>
                    </tr>
                  ) : Array.isArray(currentdata) && currentdata.length > 0 ? (
                    currentdata.map((category, index) => (
                      <tr key={category.id}>
                        <td>
                          <div className="d-flex align-items-center gap-4">
                            <input
                              type="checkbox"
                              checked={!!selectedCategories[category.id]}
                              onChange={() => handleSelectedRows(category.id)}
                            />
                            {index + 1}
                          </div>
                        </td>
                        <td>{category.name || "None"}</td>
                        <td>{category.description || "N/A"}</td>
                        <td>
                          {/* FIXED: Handle both string and number IDs */}
                          {category.parent_object?.name ||
                            (category.parent
                              ? categoryData.find(
                                (c) => c.id === parseInt(category.parent)
                              )?.name || "None"
                              : "None")}
                        </td>
                        <td>
                          {permissions?.some(p =>
                            p.name.includes('read')) ? (<button
                              className="btn btn-icon btn-bg-light btn-color-primary btn-sm me-2"
                              onClick={() => {
                                setSelectedCategory(category);
                                setIsShowModalOpen(true);
                              }}
                            >
                              <i className="bi bi-eye-fill"></i>
                            </button>) : null}

                          {permissions?.some(p =>
                            p.name.includes('update')) ? (<button
                              className="btn btn-icon btn-bg-light btn-color-warning btn-sm me-2"
                              onClick={() => {
                                setSelectedCategory(category);
                                setFormData({
                                  name: category.name,
                                  description: category.description,
                                  parent: category.parent,
                                });
                                setIsEditModalOpen(true);
                              }}
                            >
                              <i className="bi bi-pencil-fill"></i>
                            </button>) : null}

                          {permissions?.some(p =>
                            p.name.includes('delete')) ? (<button
                              className="btn btn-icon btn-bg-light btn-color-danger btn-sm"
                              onClick={() => {
                                setSelectedCategory(category);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              <i className="bi bi-trash-fill"></i>
                            </button>) : null}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-10">
                        {t('nocategoriesfound')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="pagination d-flex justify-content-between align-items-center mt-5">
                <div>
                  {t('showing')}{" "}
                  {Math.min(
                    (currentPage - 1) * itemsPerPage + 1,
                    filteredData.length
                  )}{" "}
                  to {Math.min(currentPage * itemsPerPage, filteredData.length)}{" "}
                  of {filteredData.length} {t('entries')}
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-icon btn-light-primary"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  <span className="px-3 d-flex align-items-center">
                    {t('page')} {currentPage} {t('of')} {totalPages}
                  </span>
                  <button
                    className="btn btn-sm btn-icon btn-light-primary"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('addcategory')}</h5>
                <div
                  className="btn btn-icon btn-sm btn-active-icon-primary"
                  onClick={closeModal}
                >
                  <span className="svg-icon svg-icon-1">
                    <CloseIcon />
                  </span>
                </div>
              </div>
              <div className="modal-body">
                {formErrors.non_field_errors && (
                  <div className="alert alert-danger">
                    {formErrors.non_field_errors}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label required">{t('name')} *</label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.name ? "is-invalid" : ""
                      }`}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.name && (
                    <div className="invalid-feedback">{formErrors.name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label required">{t('description')}</label>
                  <textarea
                    className={`form-control ${formErrors.description ? "is-invalid" : ""
                      }`}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                  />
                  {formErrors.description && (
                    <div className="invalid-feedback">
                      {formErrors.description}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">{t('parentcategory')}</label>
                  <select
                    className={`form-select ${formErrors.parent ? "is-invalid" : ""
                      }`}
                    name="parent"
                    value={formData.parent || "null"}
                    onChange={handleParentChange}
                  >
                    <option value="null">None</option>
                    {categoryData.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.parent && (
                    <div className="invalid-feedback">{formErrors.parent}</div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveCategory}
                >
                  {t('savechanges')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Category Modal */}
      {isShowModalOpen && selectedCategory && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('categorydetails')}</h5>
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
                  <label className="form-label">{t('name')}</label>
                  <div className="form-control form-control-solid">
                    {selectedCategory.name}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">{t('description')}</label>
                  <div className="form-control form-control-solid">
                    {selectedCategory.description || "N/A"}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">{t('parentcategory')}</label>
                  <div className="form-control form-control-solid">
                    {selectedCategory.parent_object?.name ||
                      (selectedCategory.parent
                        ? categoryData.find(
                          (c) => c.id === parseInt(selectedCategory.parent)
                        )?.name || "None"
                        : "None")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditModalOpen && selectedCategory && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('editcategory')}</h5>
                <div
                  className="btn btn-icon btn-sm btn-active-icon-primary"
                  onClick={closeModal}
                >
                  <span className="svg-icon svg-icon-1">
                    <CloseIcon />
                  </span>
                </div>
              </div>
              <div className="modal-body">
                {formErrors.non_field_errors && (
                  <div className="alert alert-danger">
                    {formErrors.non_field_errors}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label required">{t('name')} </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.name ? "is-invalid" : ""
                      }`}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.name && (
                    <div className="invalid-feedback">{formErrors.name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label required">{t('description')}</label>
                  <textarea
                    className={`form-control ${formErrors.description ? "is-invalid" : ""
                      }`}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                  />
                  {formErrors.description && (
                    <div className="invalid-feedback">
                      {formErrors.description}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">{t('parentcategory')}</label>
                  <select
                    className={`form-select ${formErrors.parent ? "is-invalid" : ""
                      }`}
                    name="parent"
                    value={formData.parent || "null"}
                    onChange={handleParentChange}
                  >
                    <option value="null">None</option>
                    {categoryData
                      .filter((cat) => cat.id !== selectedCategory.id)
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                  {formErrors.parent && (
                    <div className="invalid-feedback">{formErrors.parent}</div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateCategory}
                >
                  {t('savechanges')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedCategory && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('confirmdeletion')}</h5>
                <div
                  className="btn btn-icon btn-sm btn-active-icon-primary"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  <span className="svg-icon svg-icon-1">
                    <CloseIcon />
                  </span>
                </div>
              </div>
              <div className="modal-body">
                <p>
                  {t('areyousureyouwanttodeletethecategory')}{" "}
                  <strong>{selectedCategory.name}</strong>?
                </p>
                <p className="text-danger">{t('thisactioncannotbeundone')}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteCategory}
                >
                  {t('deletepermanently')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
