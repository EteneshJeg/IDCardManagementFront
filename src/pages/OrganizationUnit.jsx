import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrganizationUnits,
  addOrganizationUnit,
  updateOrganizationUnit,
  deleteOrganizationUnit,
  selectAllOrganizationUnits,
  deleteBunchUnits
} from "../features/organizationUnitSlice";
import { fetchRoles } from "../features/roleSlice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

// SVG Close Icon
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect opacity="0.5" x="6" y="17.3137" width="16" height="2" rx="1" transform="rotate(-45 6 17.3137)" fill="currentColor" />
    <rect x="7.41422" y="6" width="16" height="2" rx="1" transform="rotate(45 7.41422 6)" fill="currentColor" />
  </svg>)

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

const Loader = () => (
  <div className="d-flex justify-content-center py-10">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
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
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user.user);
  const { role } = useSelector((state) => state.user.role);
  const organizationUnits = useSelector(selectAllOrganizationUnits);
  const { items, status, error } = useSelector(state => state.organizationUnits);
  // State management
  const [permissions, setPermissions] = useState();
  const [currentRole, setCurrentRole] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnits, setSelectedUnits] = useState({});
  const [startSelection, setStartSelection] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    en_name: '',
    en_acronym: '',
    location: '',
    is_root_unit: false,
    is_category: false,
    synchronize_status: '',
    organization_id: '1',
    parent: '',
    reports_to: '',
    chairman: ''
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("show all");

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
    dispatch(fetchOrganizationUnits())
      .finally(() => setIsLoading(false));
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
    if (!formData.en_name || !formData.en_acronym || !formData.location || !formData.synchronize_status) {
      toast.error(t('therearermissingfields'));
      return;
    }

    dispatch(addOrganizationUnit(formData));
    toast.success(t('organizationunitaddedsuccessfully'));
    setIsModalOpen(false);
    resetForm();
  };

  const handleUpdateUnit = () => {
    if (!selectedUnit?.id) return;
    dispatch(updateOrganizationUnit({ id: selectedUnit.id, formData }));
    toast.success(t('organizationunitupdatedsuccessfully'));
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeleteUnit = () => {
    if (!selectedUnit?.id) return;
    dispatch(deleteOrganizationUnit(selectedUnit.id));
    toast.success(t('organizationunitdeletedsuccessfully'));
    setIsDeleteModalOpen(false);
  };

  const handleDeleteBunch = () => {
    const selectedIds = Object.keys(selectedUnits)
      .filter(id => selectedUnits[id])
      .map(id => parseInt(id));

    if (selectedIds.length > 0) {
      dispatch(deleteBunchUnits(selectedIds));
      toast.success(t('selectedunitsdeletedsuccessfully'));
      setSelectedUnits({});
      setStartSelection(false);
    } else {
      toast.info(t('nounitsselectedfordeletion'));
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
      organization_id: '1',
      parent: '',
      reports_to: '',
      chairman: ''
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectAll = () => {
    if (Object.keys(selectedUnits).length === organizationUnits.length) {
      setSelectedUnits({});
    } else {
      const newSelected = {};
      organizationUnits.forEach(unit => {
        newSelected[unit.id] = true;
      });
      setSelectedUnits(newSelected);
    }
  };

  const handleSelectedRows = (rowId) => {
    setSelectedUnits(prev => {
      const updated = { ...prev, [rowId]: !prev[rowId] };
      if (!updated[rowId]) {
        delete updated[rowId];
      }
      setStartSelection(Object.values(updated).some(v => v));
      return updated;
    });
  };


  return (
    <>


      {/* Toolbar Section */}
      <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
        <div className="app-container container-xxl d-flex flex-stack">
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
            <h1 className="page-heading text-dark fw-bold fs-3 my-0">{t('organizationunits')}</h1>
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
              <li className="breadcrumb-item text-muted">
                <a href="/" className="text-muted text-hover-primary">{t('home')}</a>
              </li>
              <li className="breadcrumb-item"><span className="bullet bg-gray-400 w-5px h-2px"></span></li>
              <li className="breadcrumb-item text-muted">{t('organizationunits')}</li>
            </ul>
          </div>
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            {permissions?.some(p =>
              p.name.includes('create')) ? (<button className="btn btn-sm fw-bold btn-primary" onClick={() => setIsModalOpen(true)}>
                {t('addorganizationunit')}
              </button>) : null}

            {permissions?.some(p =>
              p.name.includes('delete')) ? (<button
                className={`btn btn-sm fw-bold bg-body btn-color-gray-700 ${Object.keys(selectedUnits).length === 0 && 'd-none'}`}
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
                <span className="card-label fw-bold text-gray-800">{t('organizationunitstable')}</span>
              </h3>
              <div className="card-toolbar">
                <div className="d-flex flex-stack flex-wrap gap-4">
                  <div className="d-flex align-items-center fw-bold">
                    {/*begin::Label*/}
                    <div className="text-gray-400 fs-7 me-2">{t('unitstatus')}</div>
                    {/*end::Label*/}
                    {/*begin::Select*/}
                    <select className="form-select form-select-transparent text-graY-800 fs-base lh-1 fw-bold py-0 ps-3 w-auto"
                      data-control="select" data-hide-search="true" data-dropdown-css-classname="w-150px"
                      data-placeholder="Unit status" value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}>

                      <option value="show all" >{t('showall')}</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    {/*end::Select*/}
                  </div>
                  <div className="position-relative my-1">
                    <input
                      type="text"
                      className="form-control w-150px fs-7 ps-12"
                      placeholder={t('search')}
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
                    <th className="min-w-100px">
                      <div className="d-flex align-items-center gap-4">
                        <input
                          type="checkbox"
                          checked={Object.keys(selectedUnits).length === organizationUnits.length}
                          onChange={handleSelectAll}
                          style={{ cursor: "pointer" }}
                        />
                        {t('sn')}.
                      </div>
                    </th>
                    <th>{t('englishname')}</th>
                    <th>{t('acronym')}</th>
                    <th>{t('location')}</th>
                    <th>{t('rootunit')}</th>
                    <th>{t('category')}</th>
                    <th>{t('syncstatus')}</th>
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
                  ) : (
                    (() => {
                      const filteredData = currentData.filter((data) => {
                        return (
                          selectedFilter === 'show all' ||
                          data.status?.toLowerCase() === selectedFilter.toLowerCase()
                        );
                      });

                      if (filteredData.length === 0) {
                        return (
                          <tr>
                            <td colSpan="8" className="text-center py-10">
                              {t('noorganizationunitfound')}
                            </td>
                          </tr>
                        );
                      }

                      return filteredData.map((unit, index) => (
                        <tr key={unit.id}>
                          <td>
                            <div className="d-flex align-items-center gap-4">
                              <input
                                type="checkbox"
                                checked={!!selectedUnits[unit.id]}
                                onChange={() => handleSelectedRows(unit.id)}
                              />
                              {index + 1}
                            </div>
                          </td>
                          <td>{unit.en_name || '-'}</td>
                          <td>{unit.en_acronym || '-'}</td>
                          <td>{unit.location || '-'}</td>
                          <td>{unit.is_root_unit ? 'Yes' : 'No'}</td>
                          <td>{unit.is_category ? 'Yes' : 'No'}</td>
                          <td>{unit.synchronize_status || '-'}</td>
                          <td>
                            {permissions?.some(p =>
                              p.name.includes('read')) ? (<button
                                className="btn btn-icon btn-bg-light btn-color-primary btn-sm me-2"
                                onClick={() => {
                                  setSelectedUnit(unit);
                                  setIsShowModalOpen(true);
                                }}
                              >
                                <i className="bi bi-eye-fill"></i>
                              </button>) : null}

                            {permissions?.some(p =>
                              p.name.includes('update')) ? (<button
                                className="btn btn-icon btn-bg-light btn-color-warning btn-sm me-2"
                                onClick={() => {
                                  setFormData(unit);
                                  setSelectedUnit(unit);
                                  setIsEditModalOpen(true);
                                }}
                              >
                                <i className="bi bi-pencil-fill"></i>
                              </button>) : null}

                            {permissions?.some(p =>
                              p.name.includes('delete')) ? (<button
                                className="btn btn-icon btn-bg-light btn-color-danger btn-sm"
                                onClick={() => {
                                  setSelectedUnit(unit);
                                  setIsDeleteModalOpen(true);
                                }}
                              >
                                <i className="bi bi-trash-fill"></i>
                              </button>) : null}
                          </td>
                        </tr>
                      ));
                    })()
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

      {/* Modals Section */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="modal-header">
          <h5 className="modal-title">{t('addorganizationunit')}</h5>
          <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsModalOpen(false)}>
            <span className="svg-icon svg-icon-1"><CloseIcon /></span>
          </div>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label required">{t('englishname')}</label>
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
            <label className="form-label required">{t('englishacronym')}</label>
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
            <label className="form-label required">{t('location')}</label>
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
              onChange={(e) => setFormData({ ...formData, is_root_unit: e.target.checked })}
            />
            <label className="form-check-label ">{t('isrootunit')}</label>
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="is_category"
              checked={formData.is_category}
              onChange={(e) => setFormData({ ...formData, is_category: e.target.checked })}
            />
            <label className="form-check-label ">{t('iscategory')}</label>
          </div>
          <div className="mb-3">
            <label className="form-label required">{t('syncstatus')}</label>
            <input
              type="text"
              className="form-control"
              name="synchronize_status"
              value={formData.synchronize_status}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">{t('organizationid')}</label>
            <input
              type="text"
              className="form-control"
              name="organization_id"
              value="1"
              disabled
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={handleSaveUnit}>
            {t('savechanges')}
          </button>

        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title">{t('editorganizationunit')}</h5>
            <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsEditModalOpen(false)}>
              <span className="svg-icon svg-icon-1"><CloseIcon /></span>
            </div>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            {/* English Name */}
            <div className="mb-3">
              <label className="form-label required">{t('englishname')}</label>
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
              <label className="form-label required">{t('englishacronym')}*</label>
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
              <label className="form-label required">{t('location')}</label>
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
              <label className="form-check-label">{t('isrootunit')}</label>
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
              <label className="form-check-label">{t('iscategory')}</label>
            </div>
            <div className="mb-3">
              <label className="form-label required">{t('syncstatus')}</label>
              <select
                className="form-select"
                name="synchronize_status"
                value={formData.synchronize_status}
                onChange={handleChange}
              >
                <option value="">{t('selectstatus')}</option>
                <option value="synced">Synced</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">{t('organizationid')}</label>
              <input
                type="text"
                className="form-control"
                value={formData.organization_id}
                disabled
              />
            </div>

          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={handleUpdateUnit}>
              {t('savechanges')}
            </button>
          </div>
        </div>
      </Modal>


      {/* View Details Modal */}
      <Modal isOpen={isShowModalOpen} onClose={() => setIsShowModalOpen(false)}>
        <div className="modal-header">
          <h5 className="modal-title">{t('unitdetails')}</h5>
          <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsShowModalOpen(false)}>
            <span className="svg-icon svg-icon-1"><CloseIcon /></span>
          </div>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label fw-semibold">{t('englishname')}</label>
            <div className="form-control form-control-solid">
              {selectedUnit?.en_name || '-'}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">{t('englishacronym')}</label>
            <div className="form-control form-control-solid">
              {selectedUnit?.en_acronym || '-'}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">{t('location')}</label>
            <div className="form-control form-control-solid">
              {selectedUnit?.location || '-'}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">{t('isrootunit')}</label>
            <div className="form-control form-control-solid">
              {selectedUnit?.is_root_unit ? 'Yes' : 'No'}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">{t('iscategory')}</label>
            <div className="form-control form-control-solid">
              {selectedUnit?.is_category ? 'Yes' : 'No'}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">{t('syncstatus')}</label>
            <div className="form-control form-control-solid">
              {selectedUnit?.synchronize_status || '-'}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">{t('organizationid')}</label>
            <div className="form-control form-control-solid">
              {selectedUnit?.organization_id || '-'}
            </div>
          </div>
        </div>
      </Modal>
      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="modal-header">
          <h5 className="modal-title">{t('confirmunitdeletion')}</h5>
          <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsDeleteModalOpen(false)}>
            <span className="svg-icon svg-icon-1"><CloseIcon /></span>
          </div>
        </div>
        <div className="modal-body">
          <p className="fs-5 text-gray-800">
            {t('areyousureyouwanttodeletetheunit')}?<br />
            {t('thisactioncannotbeundone')}
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-danger" onClick={handleDeleteUnit}>
            {t('deletepermanently')}
          </button>

        </div>
      </Modal>


    </>
  );
}