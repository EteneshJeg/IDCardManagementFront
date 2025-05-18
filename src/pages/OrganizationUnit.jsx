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
  const dispatch = useDispatch();
  const organizationUnits = useSelector(selectAllOrganizationUnits);

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
    abbreviation: '',
    status: 'active'
  });
  const [searchTerm, setSearchTerm] = useState("");

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
    if (!formData.en_name || !formData.abbreviation) {
      return alert("English Name and Abbreviation are required");
    }
    dispatch(addOrganizationUnit(formData));
    setIsModalOpen(false);
    resetForm();
  };

  const handleUpdateUnit = () => {
    if (!selectedUnit?.id) return;
    dispatch(updateOrganizationUnit({ id: selectedUnit.id, formData }));
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeleteUnit = () => {
    if (!selectedUnit?.id) return;
    dispatch(deleteOrganizationUnit(selectedUnit.id));
    setIsDeleteModalOpen(false);
  };

  const handleDeleteBunch = () => {
    const selectedIds = Object.keys(selectedUnits)
      .filter(id => selectedUnits[id])
      .map(id => parseInt(id));

    if (selectedIds.length > 0) {
      dispatch(deleteBunchUnits(selectedIds));
      setSelectedUnits({});
      setStartSelection(false);
    }
  };

  const resetForm = () => {
    setFormData({
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
      abbreviation: '',
      status: 'active'
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
                          <th>English Name</th>
                          <th>Abbreviation</th>
                          <th>Address</th>
                          <th>Phone Number</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="fw-bold text-gray-600">
                        {currentData.map(unit => (
                          <tr key={unit.id}>
                            <td>
                              <input 
                                type="checkbox" 
                                checked={!!selectedUnits[unit.id]}
                                onChange={() => handleSelectedRows(unit.id)} 
                              />
                            </td>
                            <td>{unit.en_name || '-'}</td>
                            <td>{unit.abbreviation || '-'}</td>
                            <td>{unit.address || '-'}</td>
                            <td>{unit.phone_number || '-'}</td>
                            <td>
                              <span className={`badge badge-light-${unit.status === 'active' ? 'success' : 'danger'}`}>
                                {unit.status}
                              </span>
                            </td>
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

            {/* Modals Section */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <div className="modal-header">
                <h5 className="modal-title">Add Organization Unit</h5>
                <CloseButton onClose={() => setIsModalOpen(false)} />
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
                  <label className="form-label">Abbreviation</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="abbreviation" 
                    value={formData.abbreviation}
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="address" 
                    value={formData.address}
                    onChange={handleChange} 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="phone_number" 
                    value={formData.phone_number}
                    onChange={handleChange} 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-select" 
                    name="status" 
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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
              <div className="modal-header">
                <h5 className="modal-title">Edit Organization Unit</h5>
                <CloseButton onClose={() => setIsEditModalOpen(false)} />
              </div>
              <div className="modal-body">
                {/* Add edit form fields similar to Add modal */}
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
                  <label className="form-label">Abbreviation</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="abbreviation" 
                    value={formData.abbreviation}
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleUpdateUnit}>
                  Save Changes
                </button>
            
              </div>
            </Modal>

            {/* View Details Modal */}
            <Modal isOpen={isShowModalOpen} onClose={() => setIsShowModalOpen(false)}>
              <div className="modal-header">
                <h5 className="modal-title">Unit Details</h5>
                <CloseButton onClose={() => setIsShowModalOpen(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">English Name</label>
                  <div className="form-control form-control-solid">
                    {selectedUnit?.en_name}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Abbreviation</label>
                  <div className="form-control form-control-solid">
                    {selectedUnit?.abbreviation}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Address</label>
                  <div className="form-control form-control-solid">
                    {selectedUnit?.address}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Phone Number</label>
                  <div className="form-control form-control-solid">
                    {selectedUnit?.phone_number}
                  </div>
                </div>
              </div>
            </Modal>
            {/* Delete Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
              <div className="modal-header">
                <h5 className="modal-title">Confirm Unit Deletion</h5>
                <CloseButton onClose={() => setIsDeleteModalOpen(false)} />
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

            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}