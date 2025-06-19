import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { 
  addJobTitleCategory,
  deleteJobTitleCategory,
  updateJobTitleCategory,
  selectAllJobTitleCategories,
  deleteBunchCategories,
  fetchJobTitleCategories
} from "../features/jobTitleCategorySlice";
import { toast } from "react-toastify";


export default function JobTitleCategories() {
  const dispatch = useDispatch();
  const jobTitleCategories = useSelector(selectAllJobTitleCategories);
  const [categoryData, setCategoryData] = useState([]);

  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [startSelection, setStartSelection] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent: null
  });
  const [searchItem, setSearch] = useState('');

  // Initialize data
  useEffect(() => {
    dispatch(fetchJobTitleCategories());
  }, [dispatch]);

  // Sync local state with Redux
  useEffect(() => {
    if (jobTitleCategories && jobTitleCategories.length > 0) {
      setCategoryData(jobTitleCategories);
    }
  }, [jobTitleCategories]);

  // Filter data based on search
  const filteredData = categoryData.filter(cat => 
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
  const handleSaveCategory = () => {    
    if (!formData.name) {
      toast.error("Category name is required");
      return;
    }
    dispatch(addJobTitleCategory(formData));
    toast.success("Category added successfully!");
    setIsModalOpen(false);
    setFormData({ name: '', description: '', parent: null });
  };

  const handleUpdateCategory = () => {
    if (!selectedCategory?.id) return;
    dispatch(updateJobTitleCategory({ 
      id: selectedCategory.id, 
      formData 
    }));
    toast.success("Category updated successfully!");
    setIsEditModalOpen(false);
    setFormData({ name: '', description: '', parent: null });
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory?.id) return;
    dispatch(deleteJobTitleCategory(selectedCategory.id));
    toast.success("Category deleted successfully!");
    setIsDeleteModalOpen(false);
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleParentChange = (e) => {
    const parentId = e.target.value === "null" ? null : Number(e.target.value);
    setFormData({...formData, parent: parentId});
  };

  const handleSelectedRows = (rowId) => {
    setSelectedCategories(prev => {
      const updated = {...prev, [rowId]: !prev[rowId]};
      setStartSelection(Object.values(updated).some(v => v));
      return updated;
    });
  };

  const handleDeleteBunch = () => {
    const selectedIds = Object.keys(selectedCategories)
      .filter(id => selectedCategories[id])
      .map(id => parseInt(id));

    if (selectedIds.length > 0) {
      dispatch(deleteBunchCategories(selectedIds));
      toast.success("Selected categories deleted successfully!");
      setSelectedCategories({});
      setStartSelection(false);
    } else {
    toast.info("No categories selected for deletion.");
  }

  };

  // Close Icon Component
  const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect opacity="0.5" x="6" y="17.3137" width="16" height="2" rx="1" transform="rotate(-45 6 17.3137)" fill="currentColor" />
      <rect x="7.41422" y="6" width="16" height="2" rx="1" transform="rotate(45 7.41422 6)" fill="currentColor" />
    </svg>
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
                  <h1 className="page-heading text-dark fw-bold fs-3 my-0">Job Title Categories</h1>
                  <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
                    <li className="breadcrumb-item text-muted">
                      <a href="/" className="text-muted text-hover-primary">Home</a>
                    </li>
                    <li className="breadcrumb-item"><span className="bullet bg-gray-400 w-5px h-2px"></span></li>
                    <li className="breadcrumb-item text-muted">Job Title Categories</li>
                  </ul>
                </div>
                <div className="d-flex align-items-center gap-2 gap-lg-3">
                  <button className="btn btn-sm fw-bold btn-primary" onClick={() => setIsModalOpen(true)}>
                    Add Category
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
                      <span className="card-label fw-bold text-gray-800">Categories Table</span>
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
                            placeholder="Search" 
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
                          <th className="min-w-50px"></th>
                          <th className="min-w-100px">#</th>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Parent Category</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="fw-bold text-gray-600">
                        {Array.isArray(currentdata) && currentdata.length > 0 ? (
                          currentdata.map((category,index) => (
                            <tr key={category.id}>
                              <td><input 
                                type="checkbox" 
                                checked={!!selectedCategories[category.id]}
                                onChange={() => handleSelectedRows(category.id)} 
                              /></td>
                              <td>{index+1}</td>
                              <td>
                                <div className="form-check form-check-sm form-check-custom form-check-solid">
                                  <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    checked={!!selectedCategories[category.id]}
                                    onChange={() => handleSelectedRows(category.id)} 
                                  />
                                </div>
                              </td>
                              <td>{category.name}</td>
                              <td>{category.description || 'N/A'}</td>
                              <td>
                                {category.parent ? 
                                  (categoryData.find(c => c.id === category.parent)?.name || 'N/A'  ) :
                                  'None'}
                              </td>
                              <td>
                                <button 
                                  className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2"
                                  onClick={() => {
                                    setSelectedCategory(category);
                                    setIsShowModalOpen(true);
                                  }}
                                >
                                  <i className="bi bi-eye-fill fs-4"></i>
                                </button>
                                <button 
                                  className="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-2"
                                  onClick={() => {
                                    setSelectedCategory(category);
                                    setFormData({
                                      name: category.name,
                                      description: category.description,
                                      parent: category.parent
                                    });
                                    setIsEditModalOpen(true);
                                  }}
                                >
                                  <i className="bi bi-pencil-fill"></i>
                                </button>
                                <button 
                                  className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                                  onClick={() => {
                                    setSelectedCategory(category);
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
                              No categories found
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

            {/* Add Category Modal */}
            {isModalOpen && (
              <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Add Category</h5>
                      <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsModalOpen(false)}>
                        <span className="svg-icon svg-icon-1"><CloseIcon /></span>
                      </div>
                    </div>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label">Name *</label>
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
                        <label className="form-label">Description</label>
                        <textarea 
                          className="form-control" 
                          name="description" 
                          value={formData.description}
                          onChange={handleChange} 
                          rows="3"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Parent Category</label>
                        <select 
                          className="form-select" 
                          name="parent" 
                          value={formData.parent || "null"}
                          onChange={handleParentChange}
                        >
                          <option value="null">None</option>
                          {categoryData.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={handleSaveCategory}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View Category Modal */}
            {isShowModalOpen && selectedCategory && (
              <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Category Details</h5>
                      <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsShowModalOpen(false)}>
                        <span className="svg-icon svg-icon-1"><CloseIcon /></span>
                      </div>
                    </div>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <div className="form-control form-control-solid">
                          {selectedCategory.name}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <div className="form-control form-control-solid">
                          {selectedCategory.description || 'N/A'}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Parent Category</label>
                        <div className="form-control form-control-solid">
                          {selectedCategory.parent ? 
                            (categoryData.find(c => c.id === selectedCategory.parent)?.name || 'N/A') : 
                            'None'}
                        </div>
                      </div>
                    </div>                
                  </div>
                </div>
              </div>
            )}

            {/* Edit Category Modal */}
            {isEditModalOpen && selectedCategory && (
              <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Edit Category</h5>
                      <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsEditModalOpen(false)}>
                        <span className="svg-icon svg-icon-1"><CloseIcon /></span>
                      </div>
                    </div>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label">Name *</label>
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
                        <label className="form-label">Description</label>
                        <textarea 
                          className="form-control" 
                          name="description" 
                          value={formData.description}
                          onChange={handleChange} 
                          rows="3"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Parent Category</label>
                        <select 
                          className="form-select" 
                          name="parent" 
                          value={formData.parent || "null"}
                          onChange={handleParentChange}
                        >
                          <option value="null">None</option>
                          {categoryData
                            .filter(cat => cat.id !== selectedCategory.id) // Prevent selecting self as parent
                            .map(category => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                    <div className="modal-footer">
               
                      <button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={handleUpdateCategory}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && selectedCategory && (
              <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Confirm Deletion</h5>
                      <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsDeleteModalOpen(false)}>
                        <span className="svg-icon svg-icon-1"><CloseIcon /></span>
                      </div>
                    </div>
                    <div className="modal-body">
                      <p>Are you sure you want to delete the category <strong>{selectedCategory.name}</strong>?</p>
                      <p className="text-danger">This action cannot be undone.</p>
                    </div>
                    <div className="modal-footer">
   
                      <button 
                        type="button" 
                        className="btn btn-danger" 
                        onClick={handleDeleteCategory}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            
    </>
  );
}