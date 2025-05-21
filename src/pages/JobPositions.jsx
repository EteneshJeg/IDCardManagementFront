import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { 
  addJobPosition,
  deleteJobPosition,
  updateJobPosition,
  selectAllJobPositions,
  deleteBunchPositions,
  fetchJobPositions
} from "../features/jobPositionSlice";
import {
  fetchJobTitleCategories,
  selectAllJobTitleCategories,
} from "../features/jobTitleCategorySlice";
import { toast } from "react-toastify";


export default function JobPositionManagement() {
  const dispatch = useDispatch();
  const jobPositions = useSelector(selectAllJobPositions);
  const { status, error } = useSelector(state => state.jobPositions);
  const jobTitleCategories = useSelector(selectAllJobTitleCategories);

  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedPositions, setSelectedPositions] = useState({});
  const [startSelection, setStartSelection] = useState(false);
  const [formData, setFormData] = useState({
    organization_unit: "",
    job_title_category: "",
    position_code: "",
    salary: "",
    status: "active",
    job_description: ""
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchJobPositions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchJobTitleCategories());
  }, [dispatch]);



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

  // Filtering and pagination
  const filteredData = jobPositions.filter(position => {
    const searchLower = searchTerm.toLowerCase();
    return (
      position.organization_unit?.toLowerCase().includes(searchLower) ||
      position.position_code?.toLowerCase().includes(searchLower) ||
      position.job_title_category?.toLowerCase().includes(searchLower)
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSavePosition = () => {
    if (!formData.organization_unit || !formData.position_code) {
      toast.error("Organization Unit and Position Code are required");
      return;
    }
    dispatch(addJobPosition(formData));
    toast.success("Position added successfully!");
    setIsModalOpen(false);
    resetForm();
  };

  const handleUpdatePosition = () => {
    if (!selectedPosition?.id) return;
    dispatch(updateJobPosition({ id: selectedPosition.id, formData }));
    toast.success("Position updated successfully!");
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeletePosition = () => {
    if (!selectedPosition?.id) return;
    dispatch(deleteJobPosition(selectedPosition.id));
    toast.success("Position deleted successfully!");
    setIsDeleteModalOpen(false);
  };

  const handleDeleteBunch = () => {
    const selectedIds = Object.keys(selectedPositions)
      .filter(id => selectedPositions[id])
      .map(id => parseInt(id));

    if (selectedIds.length > 0) {
      dispatch(deleteBunchPositions(selectedIds));
      toast.success("Selected positions deleted successfully!");
      setSelectedPositions({});
      setStartSelection(false);
    } else {
    toast.info("No positions selected for deletion.");
  }
  };

  const resetForm = () => {
    setFormData({
      organization_unit: "",
      job_title_category: "",
      position_code: "",
      salary: "",
      status: "active",
      job_description: ""
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectedRows = (rowId) => {
    setSelectedPositions(prev => {
      const updated = { ...prev, [rowId]: !prev[rowId] };
      setStartSelection(Object.values(updated).some(v => v));
      return updated;
    });
  };
  

  // SVG Close Icon
  const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect opacity="0.5" x="6" y="17.3137" width="16" height="2" rx="1" transform="rotate(-45 6 17.3137)" fill="currentColor" />
      <rect x="7.41422" y="6" width="16" height="2" rx="1" transform="rotate(45 7.41422 6)" fill="currentColor" />
    </svg>
  );

  return (
    <div className="d-flex flex-column flex-root app-root" id="kt_app_root">
      <div className="app-page flex-column flex-column-fluid" id="kt_app_page">
        <div className="app-wrapper" id="kt_app_wrapper">
          <Sidebar />
          <div className="main-content">
            <Header />

            {/* Toolbar Section */}
            <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
              <div className="app-container container-xxl d-flex flex-stack">
                <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                  <h1 className="page-heading text-dark fw-bold fs-3 my-0">Job Positions</h1>
                  <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
                    <li className="breadcrumb-item text-muted">
                      <a href="/" className="text-muted text-hover-primary">Home</a>
                    </li>
                    <li className="breadcrumb-item"><span className="bullet bg-gray-400 w-5px h-2px"></span></li>
                    <li className="breadcrumb-item text-muted">Job Positions</li>
                  </ul>
                </div>
                <div className="d-flex align-items-center gap-2 gap-lg-3">
                  <button className="btn btn-sm fw-bold btn-primary" onClick={() => setIsModalOpen(true)}>
                    Add Position
                  </button>
                  <button 
                    className={`btn btn-sm fw-bold bg-body btn-color-gray-700 ${!startSelection && 'd-none'}`} 
                    onClick={handleDeleteBunch}
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
            </div>

            {/* Modals Section */}
            {/* Add Position Modal */}
            {isModalOpen && (
              <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Add Position</h5>
                      <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsModalOpen(false)}>
                        <span className="svg-icon svg-icon-1"><CloseIcon /></span>
                      </div>
                    </div>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label">Organization Unit</label>
                        <input type="text" className="form-control" name="organization_unit" 
                          value={formData.organization_unit} onChange={handleChange} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Job Title Category</label>
                        <select
                          className="form-select"
                          name="job_title_category"
                          value={formData.job_title_category} // should hold the category ID
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select a category</option>
                          {jobTitleCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Position Code</label>
                        <input type="text" className="form-control" name="position_code" 
                          value={formData.position_code} onChange={handleChange} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Salary</label>
                        <input type="text" className="form-control" name="salary" 
                          value={formData.salary} onChange={handleChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select className="form-select" name="status" 
                          value={formData.status} onChange={handleChange}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Job Description</label>
                        <textarea className="form-control" name="job_description" 
                          value={formData.job_description} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-primary" onClick={handleSavePosition}>
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View Details Modal */}
            {isShowModalOpen && (
              <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Position Details</h5>
                      <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsShowModalOpen(false)}>
                        <span className="svg-icon svg-icon-1"><CloseIcon /></span>
                      </div>
                    </div>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Organization Unit</label>
                        <div className="form-control form-control-solid">
                          {selectedPosition?.organization_unit}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Job Title Category</label>
                        <div className="form-control form-control-solid">
                          {selectedPosition?.job_title_category}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Position Code</label>
                        <div className="form-control form-control-solid">
                          {selectedPosition?.position_code}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Salary</label>
                        <div className="form-control form-control-solid">
                          {selectedPosition?.salary}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Status</label>
                        <div className="form-control form-control-solid">
                          <span className={`badge badge-light-${selectedPosition?.status === 'active' ? 'success' : 'danger'}`}>
                            {selectedPosition?.status}
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Job Description</label>
                        <div className="form-control form-control-solid">
                          {selectedPosition?.job_description || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
              <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Edit Position</h5>
                      <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsEditModalOpen(false)}>
                        <span className="svg-icon svg-icon-1"><CloseIcon /></span>
                      </div>
                    </div>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label">Organization Unit</label>
                        <input type="text" className="form-control" name="organization_unit" 
                          value={formData.organization_unit} onChange={handleChange} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Job Title Category</label>
                        <select
                          className="form-select"
                          name="job_title_category"
                          value={formData.job_title_category} // should hold the category ID
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select a category</option>
                          {jobTitleCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Position Code</label>
                        <input type="text" className="form-control" name="position_code" 
                          value={formData.position_code} onChange={handleChange} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Salary</label>
                        <input type="text" className="form-control" name="salary" 
                          value={formData.salary} onChange={handleChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select className="form-select" name="status" 
                          value={formData.status} onChange={handleChange}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Job Description</label>
                        <textarea className="form-control" name="job_description" 
                          value={formData.job_description} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-primary" onClick={handleUpdatePosition}>
                        Save Changes
                      </button>
                     
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
              <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Confirm Position Deletion</h5>
                      <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsDeleteModalOpen(false)}>
                        <span className="svg-icon svg-icon-1"><CloseIcon /></span>
                      </div>
                    </div>
                    <div className="modal-body">
                      <p className="fs-5 text-gray-800">
                        Are you sure you want to permanently remove this position?<br />
                        This action cannot be undone.
                      </p>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-danger" onClick={handleDeletePosition}>
                        Delete Permanently
                      </button>
                
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div id="kt_app_content" className="app-content flex-column-fluid">
              <div className="app-container container-xxl">
                <div className="card card-flush h-xl-100">
                  <div className="card-header pt-7">
                    <h3 className="card-title align-items-start flex-column">
                      <span className="card-label fw-bold text-gray-800">Positions Table</span>
                    </h3>
                    <div className="card-toolbar">
                      <div className="d-flex flex-stack flex-wrap gap-4">
                        <div className="position-relative my-1">
                          <input 
                            type="text" 
                            className="form-control w-150px fs-7 ps-12" 
                            placeholder="Search" 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-body pt-2">
                    <table className="table align-middle table-row-dashed fs-6 gy-3">
                      <thead>
                        <tr className="text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                          <th className="min-w-50px"></th>
                          <th>Organization Unit</th>
                          <th>Job Title</th>
                          <th>Position Code</th>
                          <th>Salary</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="fw-bold text-gray-600">
                        {currentData.map(position => (
                          <tr key={position.id}>
                            <td>
                              <input 
                                type="checkbox" 
                                checked={!!selectedPositions[position.id]}
                                onChange={() => handleSelectedRows(position.id)} 
                              />
                            </td>
                            <td>{position.organization_unit || '-'}</td>
                            <td>{position.job_title_category || '-'}</td>
                            <td>{position.position_code || '-'}</td>
                            <td>{position.salary || '-'}</td>
                            <td>
                              <span className={`badge badge-light-${position.status === 'active' ? 'success' : 'danger'}`}>
                                {position.status}
                              </span>
                            </td>
                            <td>
                              <button 
                                className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2" 
                                onClick={() => {
                                  setSelectedPosition(position);
                                  setIsShowModalOpen(true);
                                }}
                              >
                                <i className="bi bi-eye-fill"></i>
                              </button>
                              <button 
                                className="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-2" 
                                onClick={() => {
                                  setFormData(position);
                                  setSelectedPosition(position);
                                  setIsEditModalOpen(true);
                                }}
                              >
                                <i className="bi bi-pencil-fill"></i>
                              </button>
                              <button 
                                className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm" 
                                onClick={() => {
                                  setSelectedPosition(position);
                                  setIsDeleteModalOpen(true);
                                }}
                              >
                                <i className="bi bi-trash-fill"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="pagination mt-3">
                      <button 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
                        disabled={currentPage === 1}
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                      <span className="mx-3">Page {currentPage} of {totalPages}</span>
                      <button 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} 
                        disabled={currentPage === totalPages}
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}