import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermissions, selectAllPermissions } from "../features/permissionSlice";

export default function PermissionsPage() {
  const dispatch = useDispatch();
  
  // Get permissions data and status from Redux
  const permissions = useSelector(selectAllPermissions);
  const status = useSelector(state => state.permissions.status);
  const error = useSelector(state => state.permissions.error);
  
  const [searchItem, setSearch] = useState('');

  // Initialize data
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPermissions());
    }
  }, [dispatch, status]);

  // Create a safe array for permissions data
  const permissionList = Array.isArray(permissions) ? permissions : [];
  
  // Filter data based on search
  const filteredData = permissionList.filter(perm => {
    const searchTerm = searchItem.toLowerCase();
    return (
      perm.name?.toLowerCase().includes(searchTerm) ||
      perm.guard_name?.toLowerCase().includes(searchTerm)
    );
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentdata = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Close Icon Component
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
            <h1 className="page-heading text-dark fw-bold fs-3 my-0">Permissions Management</h1>
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
              <li className="breadcrumb-item text-muted">
                <a href="/" className="text-muted text-hover-primary">Home</a>
              </li>
              <li className="breadcrumb-item"><span className="bullet bg-gray-400 w-5px h-2px"></span></li>
              <li className="breadcrumb-item text-muted">Permissions</li>
            </ul>
          </div>
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            {/* No action buttons needed */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div className="app-container container-xxl">
          <div className="card card-flush h-xl-100">
            <div className="card-header pt-7">
              <h3 className="card-title align-items-start flex-column">
                <span className="card-label fw-bold text-gray-800">Permissions List</span>
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
                      placeholder="Search permissions..."
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
                    <th className="min-w-50px">S.N.</th>
                    <th>Permission Name</th>
                    <th>Guard Name</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody className="fw-bold text-gray-600">
                  {status === 'loading' ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        <Loader />
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="4" className="text-center text-danger">
                        Error loading permissions: {error}
                      </td>
                    </tr>
                  ) : currentdata.length > 0 ? (
                    currentdata.map((permission, index) => (
                      <tr key={permission.id}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{permission.name}</td>
                        <td>{permission.guard_name}</td>
                        <td>{new Date(permission.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-10">
                        {permissionList.length === 0 
                          ? "No permissions found" 
                          : "No matching permissions"}
                      </td>
                    </tr>
                  )}
                </tbody>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}