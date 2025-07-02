import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrganizationUnits,
  addOrganizationUnit,
  updateOrganizationUnit,
  deleteOrganizationUnit,
  selectAllOrganizationUnits,
  deleteBunchUnits
} from "../features/organizationUnitSlice";
import { toast } from "react-toastify";

   // SVG Close Icon
  const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect opacity="0.5" x="6" y="17.3137" width="16" height="2" rx="1" transform="rotate(-45 6 17.3137)" fill="currentColor" />
      <rect x="7.41422" y="6" width="16" height="2" rx="1" transform="rotate(45 7.41422 6)" fill="currentColor" />
    </svg> )

// Reusable Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;



  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '8px',
          padding: '20px',
          maxWidth: '600px',
          width: '90%'
        }}
      >
        {children}
      </div>
    </div>
  );
};

const CloseButton = ({ onClose }) => (
  <button 
    type="button" 
    className="close-btn"
    onClick={onClose}
    style={{
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      position: 'absolute',
      right: '20px',
      top: '10px'
    }}
  >
    &times;
  </button>
);

export default function OrganizationUnit() {
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
  const organizationUnits = useSelector(selectAllOrganizationUnits);
  const { items, status, error } = useSelector(state => state.organizationUnits);
  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnits, setSelectedUnits] = useState({});
  const [startSelection, setStartSelection] = useState(false);
  const [formData, setFormData] = useState({
    en_name: '',
    en_acronym: '',
    location: '',
    is_root_unit: false,
    is_category: false,
    synchronize_status: '',
    organization_id: '',
    parent: '',
    reports_to: '',
    chairman: ''
  });
  const [searchTerm, setSearchTerm] = useState("");
   const [selectedFilter, setSelectedFilter] = useState("show all");

  useEffect(() => {
    dispatch(fetchOrganizationUnits());
  }, [dispatch]);

  // Filtering and pagination
  const filteredData = organizationUnits.filter(unit => {
    const searchLower = searchTerm.toLowerCase();
    return (
      unit.en_name?.toLowerCase().includes(searchLower) ||
      unit.abbreviation?.toLowerCase().includes(searchLower)
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
  const handleSaveUnit = () => {
    if (!formData.en_name || !formData.en_acronym) {
        toast.error("English Name and Acronym are required");
        return;
      }

    dispatch(addOrganizationUnit(formData));
    toast.success("Organization Unit added successfully!");
    setIsModalOpen(false);
    resetForm();
  };

  const handleUpdateUnit = () => {
    if (!selectedUnit?.id) return;
    dispatch(updateOrganizationUnit({ id: selectedUnit.id, formData }));
    toast.success("Organization Unit updated successfully!");
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeleteUnit = () => {
    if (!selectedUnit?.id) return;
    dispatch(deleteOrganizationUnit(selectedUnit.id));
    toast.success("Organization Unit deleted successfully!");
    setIsDeleteModalOpen(false);
  };

  const handleDeleteBunch = () => {
    const selectedIds = Object.keys(selectedUnits)
      .filter(id => selectedUnits[id])
      .map(id => parseInt(id));

    if (selectedIds.length > 0) {
      dispatch(deleteBunchUnits(selectedIds));
      toast.success("Selected units deleted successfully!");
      setSelectedUnits({});
      setStartSelection(false);
    } else {
      toast.info("No units selected for deletion.");
    }
  };

  const resetForm = () => {
    setFormData({
        en_name: '',
        en_acronym: '',
        location: '',
        is_root_unit: false,
        is_category: false,
        synchronize_status: '',
        organization_id: '',
        parent: '',
        reports_to: '',
        chairman: ''
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectedRows = (rowId) => {
    setSelectedUnits(prev => {
      const updated = { ...prev, [rowId]: !prev[rowId] };
      setStartSelection(Object.values(updated).some(v => v));
      return updated;
    });
  };

  if (status === 'loading') return <div className="text-center py-5">Loading organization units...</div>;
  if (status === 'failed') return <div className="alert alert-danger">Error: {error}</div>;
  

  return (
    <>
   
            
            {/* Toolbar Section */}
            <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
              <div className="app-container container-xxl d-flex flex-stack">
                <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                  <h1 className="page-heading text-dark fw-bold fs-3 my-0">Organization Units</h1>
                  <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
                    <li className="breadcrumb-item text-muted">
                      <a href="/" className="text-muted text-hover-primary">Home</a>
                    </li>
                    <li className="breadcrumb-item"><span className="bullet bg-gray-400 w-5px h-2px"></span></li>
                    <li className="breadcrumb-item text-muted">Organization Units</li>
                  </ul>
                </div>
                <div className="d-flex align-items-center gap-2 gap-lg-3">
                  <button className="btn btn-sm fw-bold btn-primary" onClick={() => setIsModalOpen(true)}>
                    Add Organization Unit
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

            {/* Main Content */}
            <div id="kt_app_content" className="app-content flex-column-fluid">
              <div className="app-container container-xxl">
                <div className="card card-flush h-xl-100">
                  <div className="card-header pt-7">
                    <h3 className="card-title align-items-start flex-column">
                      <span className="card-label fw-bold text-gray-800">Organization Units Table</span>
                    </h3>
                    <div className="card-toolbar">
                      <div className="d-flex flex-stack flex-wrap gap-4">
                        <div className="d-flex align-items-center fw-bold">
                      {/*begin::Label*/}
                      <div className="text-gray-400 fs-7 me-2">Unit Status</div>
                      {/*end::Label*/}
                      {/*begin::Select*/}
                      <select className="form-select form-select-transparent text-graY-800 fs-base lh-1 fw-bold py-0 ps-3 w-auto"
                        data-control="select" data-hide-search="true" data-dropdown-css-classname="w-150px"
                        data-placeholder="Unit status" value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}>

                        <option value="show all" >Show All</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                      {/*end::Select*/}
                    </div>
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
                    <table className="table table-striped align-middle table-row-dashed fs-6 gy-3">
                      <thead>
                        <tr className="text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                          <th className="min-w-50px"></th>
                          <th className="min-w-100px">S.N.</th>
                          <th>English Name</th>
                          <th>Acronym</th>
                          <th>Location</th>
                          <th>Root Unit</th>
                          <th>Category</th>
                          <th>Sync Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="fw-bold text-gray-600">
                        {currentData.filter((data)=>{
                          const matchFilter=selectedFilter === 'show all' ||
                            data.status?.toLowerCase() === selectedFilter.toLowerCase();
                            return matchFilter;
                        }).map((unit,index) => (
                          <tr key={unit.id}>
                            <td>
                              <input 
                                type="checkbox" 
                                checked={!!selectedUnits[unit.id]}
                                onChange={() => handleSelectedRows(unit.id)} 
                              />
                            </td>
                            <td>{index+1}</td>
                            <td>{unit.en_name || '-'}</td>
                            <td>{unit.en_acronym || '-'}</td>
                            <td>{unit.location || '-'}</td>
                            <td>{unit.is_root_unit ? 'Yes' : 'No'}</td>
                            <td>{unit.is_category ? 'Yes' : 'No'}</td>
                            <td>{unit.synchronize_status || '-'}</td>
                            <td>
                              <button 
                                className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2" 
                                onClick={() => {
                                  setSelectedUnit(unit);
                                  setIsShowModalOpen(true);
                                }}
                              >
                                <i className="bi bi-eye-fill"></i>
                              </button>
                              <button 
                                className="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-2" 
                                onClick={() => {
                                  setFormData(unit);
                                  setSelectedUnit(unit);
                                  setIsEditModalOpen(true);
                                }}
                              >
                                <i className="bi bi-pencil-fill"></i>
                              </button>
                              <button 
                                className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm" 
                                onClick={() => {
                                  setSelectedUnit(unit);
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

            {/* Modals Section */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <div className="modal-header">
                <h5 className="modal-title">Add Organization Unit</h5>
                <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsModalOpen(false)}>
                  <span className="svg-icon svg-icon-1"><CloseIcon /></span>
                </div>             
               </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">English Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="en_name" 
                    value={formData.en_name}
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">English Acronym</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="en_acronym" 
                    value={formData.en_acronym}
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="location" 
                    value={formData.location}
                    onChange={handleChange} 
                  />
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="is_root_unit"
                    checked={formData.is_root_unit}
                    onChange={(e) => setFormData({...formData, is_root_unit: e.target.checked})}
                  />
                  <label className="form-check-label">Is Root Unit</label>
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="is_category"
                    checked={formData.is_category}
                    onChange={(e) => setFormData({...formData, is_category: e.target.checked})}
                  />
                  <label className="form-check-label">Is Category</label>
                </div>
                <div className="mb-3">
                  <label className="form-label">Synchronize Status</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="synchronize_status" 
                    value={formData.synchronize_status}
                    onChange={handleChange} 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Organization ID</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="organization_id" 
                    value={formData.organization_id}
                    onChange={handleChange} 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleSaveUnit}>
                  Save
                </button>
          
              </div>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
              <div className="modal-content">
                {/* Modal Header */}
                <div className="modal-header">
                  <h5 className="modal-title">Edit Organization Unit</h5>
                  <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsEditModalOpen(false)}>
                    <span className="svg-icon svg-icon-1"><CloseIcon /></span>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                  {/* English Name */}
                  <div className="mb-3">
                    <label className="form-label">English Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="en_name"
                      value={formData.en_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">English Acronym*</label>
                    <input
                      type="text"
                      className="form-control"
                      name="en_acronym"
                      value={formData.en_acronym}
                      onChange={handleChange}
                      required
                    />
                  </div>

                 <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="is_root_unit"
                      checked={formData.is_root_unit}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Is Root Unit</label>
                  </div>

                  {/* Status (Updated to your logic) */}
                   <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="is_category"
                        checked={formData.is_category}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Is Category</label>
                    </div>
                    <div className="mb-3">
                    <label className="form-label">Synchronize Status</label>
                    <select
                      className="form-select"
                      name="synchronize_status"
                      value={formData.synchronize_status}
                      onChange={handleChange}
                    >
                      <option value="">Select Status</option>
                      <option value="synced">Synced</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={handleUpdateUnit}>
                    Save Changes
                  </button>
                </div>
              </div>
            </Modal>


            {/* View Details Modal */}
            <Modal isOpen={isShowModalOpen} onClose={() => setIsShowModalOpen(false)}>
              <div className="modal-header">
                <h5 className="modal-title">Unit Details</h5>
                <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsShowModalOpen(false)}>
                    <span className="svg-icon svg-icon-1"><CloseIcon /></span>
                </div>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">English Name</label>
                  <div className="form-control form-control-solid">
                    {selectedUnit?.en_name || '-'}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">English Acronym</label>
                  <div className="form-control form-control-solid">
                    {selectedUnit?.en_acronym || '-'}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Location</label>
                  <div className="form-control form-control-solid">
                    {selectedUnit?.location || '-'}
                  </div>
                </div>
                 <div className="mb-3">
                  <label className="form-label fw-semibold">Is Root Unit</label>
                  <div className="form-control form-control-solid">
                    {selectedUnit?.is_root_unit ? 'Yes' : 'No'}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Is Category</label>
                  <div className="form-control form-control-solid">
                    {selectedUnit?.is_category ? 'Yes' : 'No'}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Sync Status</label>
                  <div className="form-control form-control-solid">
                    {selectedUnit?.synchronize_status || '-'}
                  </div>
                </div>
              </div>
            </Modal>
            {/* Delete Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
              <div className="modal-header">
                <h5 className="modal-title">Confirm Unit Deletion</h5>
                <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsDeleteModalOpen(false)}>
                    <span className="svg-icon svg-icon-1"><CloseIcon /></span>
                  </div>
              </div>
              <div className="modal-body">
                <p className="fs-5 text-gray-800">
                  Are you sure you want to permanently remove this unit?<br />
                  This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={handleDeleteUnit}>
                  Delete Permanently
                </button>
          
              </div>
            </Modal>

           
    </>
  );
}