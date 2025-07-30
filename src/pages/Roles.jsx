import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import {
  fetchRoles,
  addRole,
  updateRole,
  deleteRole,
  selectAllRoles,
  selectRolesStatus,
  selectRolesError,
} from "../features/roleSlice";
import {
  fetchPermissions,
  selectAllPermissions
} from "../features/permissionSlice";
import { toast } from "react-toastify";

export default function RoleManagement() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Redux state
  const roles = useSelector(selectAllRoles);
  const allPermissions = useSelector(selectAllPermissions);
  const status = useSelector(selectRolesStatus);
  const error = useSelector(selectRolesError);
  const permissionStatus = useSelector(state => state.permissions.status);

  // Local state
  const [searchItem, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // Added view modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    permissions: []
  });

  // Enhanced UI state for multi-select
  const [permissionSearch, setPermissionSearch] = useState('');
  const [isPermissionDropdownOpen, setIsPermissionDropdownOpen] = useState(false);

  // Initialize data
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRoles());
    }
    if (permissionStatus === 'idle') {
      dispatch(fetchPermissions());
    }
  }, [dispatch, status, permissionStatus]);

  // Create safe arrays
  const roleList = Array.isArray(roles) ? roles : [];
  const permissionList = Array.isArray(allPermissions) ? allPermissions : [];

  // Filter data based on search
  const filteredData = roleList.filter(role =>
    role.name?.toLowerCase().includes(searchItem.toLowerCase())
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentdata = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter permissions based on search
  const filteredPermissions = permissionList.filter(permission =>
    permission.name?.toLowerCase().includes(permissionSearch.toLowerCase())
  );

  // Handlers
  const handleSaveRole = async () => {
    if (!formData.name) {
      toast.error(t('rolenameisrequired'));
      return;
    }

    if (formData.permissions.length === 0) {
      toast.error(t('pleaseselectatleastonepermission'));
      return;
    }

    try {
      await dispatch(addRole(formData)).unwrap();
      toast.success(t('rolecreatedsuccessfully'));
      setIsModalOpen(false);
      setFormData({ name: '', permissions: [] });
      setPermissionSearch('');
    } catch (error) {
      toast.error(t('failedtocreaterole'));
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedRole?.id) return;

    try {
      await dispatch(updateRole({
        id: selectedRole.id,
        formData
      })).unwrap();
      toast.success(t('roleupdatedsuccessfully'));
      setIsEditModalOpen(false);
      setFormData({ name: '', permissions: [] });
      setPermissionSearch('');
    } catch (error) {
      toast.error(t('failedtoupdaterole'));
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole?.id) return;

    try {
      await dispatch(deleteRole(selectedRole.id)).unwrap();
      toast.success(t('roledeletedsuccessfully'));
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error(t('failedtodeleterole'));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = (permissionId) => {
    setFormData(prev => {
      const newPermissions = [...prev.permissions];
      const index = newPermissions.indexOf(permissionId);

      if (index > -1) {
        newPermissions.splice(index, 1);
      } else {
        newPermissions.push(permissionId);
      }

      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSelectAllPermissions = () => {
    if (formData.permissions.length === filteredPermissions.length) {
      setFormData(prev => ({ ...prev, permissions: [] }));
    } else {
      const allIds = filteredPermissions.map(p => p.id);
      setFormData(prev => ({ ...prev, permissions: allIds }));
    }
  };

  // Get permission names for display - FIXED to handle non-array permissions
  const getPermissionNames = (permissionIds) => {
    if (!Array.isArray(permissionIds) || permissionIds.length === 0) return "No permissions";

    return allPermissions
      .filter(permission => permissionIds.includes(permission.id))
      .map(p => p.name)
      .join(', ');
  };

  // UI Components
  const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect opacity="0.5" x="6" y="17.3137" width="16" height="2" rx="1" transform="rotate(-45 6 17.3137)" fill="currentColor" />
      <rect x="7.41422" y="6" width="16" height="2" rx="1" transform="rotate(45 7.41422 6)" fill="currentColor" />
    </svg>
  );

  const Loader = () => (
    <div className="d-flex justify-content-center py-10">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  // Initialize theme scripts
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
            <h1 className="page-heading text-dark fw-bold fs-3 my-0">{t('rolemanagement')}</h1>
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
              <li className="breadcrumb-item text-muted">
                <a href="/" className="text-muted text-hover-primary">{t('home')}</a>
              </li>
              <li className="breadcrumb-item"><span className="bullet bg-gray-400 w-5px h-2px"></span></li>
              <li className="breadcrumb-item text-muted">{t('roles')}</li>
            </ul>
          </div>
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <button
              className="btn btn-sm fw-bold btn-primary"
              onClick={() => {
                setFormData({ name: '', permissions: [] });
                setPermissionSearch('');
                setIsModalOpen(true);
              }}
            >
              {t('addrole')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div className="app-container container-xxl">
          <div className="card card-flush h-xl-100">
            <div className="card-header pt-7">
              <h3 className="card-title align-items-start flex-column">
                <span className="card-label fw-bold text-gray-800">{t('roleslist')}</span>
              </h3>
              <div className="card-toolbar">
                <div className="d-flex flex-stack flex-wrap gap-4">
                  <div className="position-relative my-1">
                    <span className="svg-icon svg-icon-2 position-absolute top-50 translate-middle-y ms-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1" transform="rotate(45 17.0365 15.1223)" fill="currentColor" />
                        <path d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z" fill="currentColor" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      className="form-control w-150px fs-7 ps-12"
                      placeholder={t('searchroles')}
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
                    <th className="min-w-50px">{t('sn')}.</th>
                    <th>{t('rolename')}</th>
                    {/* <th>Permissions</th> */}
                    <th>{t('createdat')}</th>
                    <th>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="fw-bold text-gray-600">
                  {status === 'loading' || permissionStatus === 'loading' ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        <Loader />
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="5" className="text-center text-danger">
                        Error loading data: {error}
                      </td>
                    </tr>
                  ) : currentdata.length > 0 ? (
                    currentdata.map((role, index) => (
                      <tr key={role.id}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{role.name}</td>
                        {/* <td 
                          className="text-truncate" 
                          style={{ maxWidth: "300px" }} 
                          title={getPermissionNames(role.permissions)}
                        >
                          {getPermissionNames(role.permissions)}
                        </td> */}
                        <td>{new Date(role.created_at).toLocaleDateString()}</td>
                        <td>
                          {/* Added View Button */}
                          <button
                            className="btn btn-icon btn-bg-light btn-color-primary btn-sm me-2"
                            onClick={() => {
                              setSelectedRole(role);
                              setIsViewModalOpen(true);
                            }}
                          >
                            <i className="bi bi-eye-fill"></i>
                          </button>
                          <button
                            className="btn btn-icon btn-bg-light btn-color-warning btn-sm me-2"
                            onClick={() => {
                              setSelectedRole(role);
                              setFormData({
                                name: role.name,
                                permissions: role.permissions
                              });
                              setPermissionSearch('');
                              setIsEditModalOpen(true);
                            }}
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            className="btn btn-icon btn-bg-light btn-color-danger btn-sm"
                            onClick={() => {
                              setSelectedRole(role);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-10">
                        {roleList.length === 0
                          ? "No roles found"
                          : "No matching roles"}
                      </td>
                    </tr>
                  )}
                </tbody>
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
            </div>
          </div>
        </div>
      </div>

      {/* Add Role Modal */}
      {isModalOpen && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('addnewrole')}</h5>
                <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => {
                  setIsModalOpen(false);
                  setPermissionSearch('');
                }}>
                  <span className="svg-icon svg-icon-1"><CloseIcon /></span>
                </div>
              </div>
              <div className="modal-body">
                <div className="mb-5">
                  <label className="form-label required">{t('rolename')}</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={t('enterrolename')}
                  />
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label required">{t('permissions')}</label>
                    <button
                      type="button"
                      className="btn btn-sm btn-link"
                      onClick={handleSelectAllPermissions}
                    >
                      {formData.permissions.length === filteredPermissions.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  </div>

                  {/* Enhanced Multi-Select UI */}
                  <div className="position-relative">
                    <div
                      className="form-control d-flex align-items-center flex-wrap gap-1 py-2"
                      style={{ minHeight: "42px", cursor: "pointer" }}
                      onClick={() => setIsPermissionDropdownOpen(!isPermissionDropdownOpen)}
                    >
                      {formData.permissions.length === 0 ? (
                        <span className="text-muted">{t('selectpermissions')}</span>
                      ) : (
                        permissionList
                          .filter(p => formData.permissions.includes(p.id))
                          .map(p => (
                            <span key={p.id} className="badge badge-primary d-inline-flex align-items-center">
                              {p.name}
                              <button
                                type="button"
                                className="btn btn-icon btn-sm btn-active-color-primary ms-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePermissionChange(p.id);
                                }}
                              >
                                <i className="bi bi-x fs-5"></i>
                              </button>
                            </span>
                          ))
                      )}
                      <div className="ms-auto">
                        <i className={`bi bi-chevron-${isPermissionDropdownOpen ? 'up' : 'down'}`}></i>
                      </div>
                    </div>

                    {isPermissionDropdownOpen && (
                      <div className="border rounded mt-1 p-2 position-absolute w-100 bg-white z-index-1 shadow"
                        style={{ maxHeight: "300px", overflowY: "auto" }}>
                        <div className="sticky-top bg-white pt-2 pb-2">
                          <input
                            type="text"
                            className="form-control form-control-sm mb-2"
                            placeholder="Search permissions..."
                            value={permissionSearch}
                            onChange={(e) => setPermissionSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        <div className="list-group">
                          {filteredPermissions.length > 0 ? (
                            filteredPermissions.map(permission => (
                              <div
                                key={permission.id}
                                className="list-group-item list-group-item-action d-flex align-items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePermissionChange(permission.id);
                                }}
                              >
                                <div className="form-check mb-0 flex-grow-1">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={formData.permissions.includes(permission.id)}
                                    onChange={() => { }}
                                    id={`perm-${permission.id}`}
                                  />
                                  <label className="form-check-label w-100" htmlFor={`perm-${permission.id}`}>
                                    {permission.name}
                                  </label>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center p-3 text-muted">
                              {t('nopermissionsfound')}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveRole}
                >
                  {t('saverole')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {isEditModalOpen && selectedRole && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('editrole')}: {selectedRole.name}</h5>
                <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => {
                  setIsEditModalOpen(false);
                  setPermissionSearch('');
                }}>
                  <span className="svg-icon svg-icon-1"><CloseIcon /></span>
                </div>
              </div>
              <div className="modal-body">
                <div className="mb-5">
                  <label className="form-label required">{t('rolename')}</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label required">{t('permissions')}</label>
                    <button
                      type="button"
                      className="btn btn-sm btn-link"
                      onClick={handleSelectAllPermissions}
                    >
                      {formData.permissions.length === filteredPermissions.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  </div>

                  {/* Enhanced Multi-Select UI */}
                  <div className="position-relative">
                    <div
                      className="form-control d-flex align-items-center flex-wrap gap-1 py-2"
                      style={{ minHeight: "42px", cursor: "pointer" }}
                      onClick={() => setIsPermissionDropdownOpen(!isPermissionDropdownOpen)}
                    >
                      {formData.permissions.length === 0 ? (
                        <span className="text-muted">{t('selectpermissions')}</span>
                      ) : (
                        permissionList
                          .filter(p => formData.permissions.includes(p.id))
                          .map(p => (
                            <span key={p.id} className="badge badge-light-primary d-inline-flex align-items-center">
                              {p.name}
                              <button
                                type="button"
                                className="btn btn-icon btn-sm btn-active-color-primary ms-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePermissionChange(p.id);
                                }}
                              >
                                <i className="bi bi-x fs-5"></i>
                              </button>
                            </span>
                          ))
                      )}
                      <div className="ms-auto">
                        <i className={`bi bi-chevron-${isPermissionDropdownOpen ? 'up' : 'down'}`}></i>
                      </div>
                    </div>

                    {isPermissionDropdownOpen && (
                      <div className="border rounded mt-1 p-2 position-absolute w-100 bg-white z-index-1 shadow"
                        style={{ maxHeight: "300px", overflowY: "auto" }}>
                        <div className="sticky-top bg-white pt-2 pb-2">
                          <input
                            type="text"
                            className="form-control form-control-sm mb-2"
                            placeholder="Search permissions..."
                            value={permissionSearch}
                            onChange={(e) => setPermissionSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        <div className="list-group">
                          {filteredPermissions.length > 0 ? (
                            filteredPermissions.map(permission => (
                              <div
                                key={permission.id}
                                className="list-group-item list-group-item-action d-flex align-items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePermissionChange(permission.id);
                                }}
                              >
                                <div className="form-check mb-0 flex-grow-1">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={formData.permissions.includes(permission.id)}
                                    onChange={() => { }}
                                    id={`edit-perm-${permission.id}`}
                                  />
                                  <label className="form-check-label w-100" htmlFor={`edit-perm-${permission.id}`}>
                                    {permission.name}
                                  </label>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center p-3 text-muted">
                              {t('nopermissionsfound')}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateRole}
                >
                  {t('updaterole')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Role Modal - NEW */}
      {isViewModalOpen && selectedRole && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('viewrole')}: {selectedRole.name}</h5>
                <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsViewModalOpen(false)}>
                  <span className="svg-icon svg-icon-1"><CloseIcon /></span>
                </div>
              </div>
              <div className="modal-body">
                <div className="mb-5">
                  <label className="form-label fw-bold">{t('rolename')}</label>
                  <p className="form-control-static">{selectedRole.name}</p>
                </div>

                {/* <div className="mb-3">
                  <label className="form-label fw-bold">Permissions</label>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedRole.permissions && selectedRole.permissions.length > 0 ? (
                      allPermissions
                        .filter(p => selectedRole.permissions.includes(p.id))
                        .map(p => (
                          <span key={p.id} className="badge badge-light-primary">
                            {p.name}
                          </span>
                        ))
                    ) : (
                      <p>No permissions assigned</p>
                    )}
                  </div>
                </div> */}

                <div className="mb-3">
                  <label className="form-label fw-bold">{t('createdat')}</label>
                  <p>{new Date(selectedRole.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedRole && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('confirmroledeletion')}</h5>
                <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsDeleteModalOpen(false)}>
                  <span className="svg-icon svg-icon-1"><CloseIcon /></span>
                </div>
              </div>
              <div className="modal-body">
                <p>{t('areyousureyouwanttodeletetherole')}<strong>{selectedRole.name}</strong>?</p>
                <p className="text-danger">{t('thisactioncannotbeundone')}.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteRole}
                >
                  {t('deleterole')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}