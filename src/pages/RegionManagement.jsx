import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  createRegion,
  getRegion,
  updateRegion,
  deleteRegion,
  deleteBunch,
} from "../features/regionSlice";

   // SVG Close Icon
  const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect opacity="0.5" x="6" y="17.3137" width="16" height="2" rx="1" transform="rotate(-45 6 17.3137)" fill="currentColor" />
      <rect x="7.41422" y="6" width="16" height="2" rx="1" transform="rotate(45 7.41422 6)" fill="currentColor" />
    </svg> )

  const Loader = () => (
  <div className="d-flex justify-content-center py-10">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);



export default function Region() {
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
  const [filteredData, setFilteredData] = useState([]);
  const { region } = useSelector((state) => state.region);
  const [startSelection, setStartSelection] = useState(false);
  const [regionData, setRegionData] = useState([]);
  const [searchItem, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("show all");
  const [selectedUsers, setSelectedUsers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
  });
  const [selectedUser, setSelectedUser] = useState({
    name: "",
    code: "",
  });
  useEffect(() => {
    if (selectedFilter === "show all") {
      setFilteredData(regionData);
    } else {
      const filtered = regionData.filter(
        (data) => data.role?.toLowerCase() === selectedFilter.toLowerCase()
      );
      setFilteredData(filtered);
    }
  }, [selectedFilter, regionData]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(regionData.length / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(1);
  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentdata = Array.isArray(regionData)
    ? regionData.slice(firstItemIndex, lastItemIndex)
    : [regionData].slice(firstItemIndex, lastItemIndex);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getRegion())
      .then((data) => {
        console.log(data);
        const dataitem = data.payload;
        console.log(dataitem);

        const normalizedData = Array.isArray(dataitem) ? dataitem : [dataitem];
        setRegionData(normalizedData);
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      })
      .finally(() => setIsLoading(false)); 
  }, [dispatch, region]);

  useEffect(() => {
    console.log("userdata type check:", Array.isArray(regionData), regionData);
  }, [regionData]);

  const handleSelectedRows = (rowId) => {
    setSelectedUsers((prev) => {
      const updatedSelection = {
        ...prev,
        [rowId]: !prev[rowId],
      };
      const hasSelectedRows = Object.values(updatedSelection).some(
        (isSelected) => isSelected
      );

      setStartSelection(hasSelectedRows);
      if (!updatedSelection[rowId]) {
        delete updatedSelection[rowId];
      }

      if (Object.keys(updatedSelection).length === 0) {
        return {};
      }

      return updatedSelection;
    });
  };

  const handleSelectAll = () => {
    if (Object.keys(selectedUsers).length === regionData.length) {
      setSelectedUsers({});
      setStartSelection({});
    } else {
      const newSelected = {};
      regionData.forEach((user) => {
        newSelected[user.id] = true;
      });
      setSelectedUsers(newSelected);
      setStartSelection(newSelected);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveRegion = () => {
    if (!formData.name || !formData.code) {
      toast.error("There are missing fields");
      return;
    } else {
      dispatch(createRegion({ FormData: formData }));
    }
    setIsModalOpen(false);
  };

  const handleUpdateRegion = (Id) => {
    dispatch(updateRegion({ Id: Id, FormData: formData }));
    setIsEditModalOpen(false);
  };

  const handleDeleteRegion = (Id) => {
    dispatch(deleteRegion({ Id: Id }));
    setIsDeleteModalOpen(false);
  };

  const handleDeleteBunch = () => {
    console.log(selectedUsers);
    dispatch(deleteBunch({ Id: selectedUsers }));
  };
  return (
    <>
      <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
        <div
          id="kt_app_toolbar_container"
          className="app-container container-xxl d-flex flex-stack"
        >
          {/* Title and Breadcrumbs */}
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
            <h1 className="page-heading text-dark fw-bold fs-3 my-0">
              Region Management
            </h1>
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
              <li className="breadcrumb-item text-muted">
                <a href="/" className="text-muted text-hover-primary">
                  Home
                </a>
              </li>
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted">Region Management</li>
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
              Add Region
            </a>

            <a
              href="#"
              className={
                Object.keys(selectedUsers).length > 0
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
                  style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      {/* Modal Header */}
                      <div className="modal-header">
                        <h5 className="modal-title">Add Region</h5>
                        <div
                          className="btn btn-icon btn-sm btn-active-icon-primary"
                          onClick={() => setIsModalOpen(false)}
                        >
                          <span className="svg-icon svg-icon-1">
                            {/* Replace this with your actual close icon component */}
                            <CloseIcon />
                          </span>
                        </div>
                      </div>

                      {/* Modal Body */}
                      <div className="modal-body">
                        <div className="mb-3">
                          <label className="form-label fw-semibold required">
                            Region Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            onChange={handleChange}
                            value={formData.name}
                            placeholder="Enter region name"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-semibold required">
                            Region Code
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="code"
                            onChange={handleChange}
                            value={formData.code}
                            placeholder="Enter region code"
                            required
                          />
                        </div>
                      </div>

                      {/* Modal Footer */}
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleSaveRegion}
                        >
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
        <div
          id="kt_app_content_container"
          className="app-container container-xxl"
        >
          <div className="row g-5 g-xl-10">
            <div className="card card-flush h-xl-100">
              {/*begin::Card header*/}
              <div className="card-header pt-7">
                {/*begin::Title*/}
                <h3 className="card-title align-items-start flex-column">
                  <span className="card-label fw-bold text-gray-800">
                    Regions table
                  </span>
                </h3>
                <div className="card-toolbar">
                  {/*begin::Filters*/}
                  <div className="d-flex flex-stack flex-wrap gap-4">
                    {/*begin::Destination*/}

                    {/*end::Destination*/}

                    {/*begin::Search*/}
                    <div className="position-relative my-1">
                      {/*begin::Svg Icon | path: icons/duotune/general/gen021.svg*/}
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
                      {/*end::Svg Icon*/}
                      <input
                        type="text"
                        data-kt-table-widget-4="search"
                        className="form-control w-150px fs-7 ps-12"
                        placeholder="Search"
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    {/*end::Search*/}
                  </div>
                  {/*begin::Filters*/}
                </div>
              </div>
              <div className="card-body pt-2">
                {/*begin::Table*/}
                <table
                  className="table table-striped align-middle table-row-dashed fs-6 gy-3"
                  id="kt_table_widget_4_table"
                >
                  <thead>
                    {/*begin::Table row*/}
                    <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                      <th className="min-w-100px">
                          <div className="d-flex align-items-center gap-2">
                            <input
                              type="checkbox"
                              checked={
                                Object.keys(selectedUsers).length ===
                                regionData.length
                              }
                              onChange={handleSelectAll}
                              title={
                                Object.keys(selectedUsers).length ===
                                regionData.length
                                  ? "Deselect All"
                                  : "Select All"
                              }
                              style={{ cursor: "pointer" }}
                            />
                            S.N.
                        </div>
                      </th>
                      <th className="text-start min-w-100px">Name</th>
                      <th className="text-start min-w-125px">Code</th>
                      <th className="text-start min-w-100px">Action</th>
                    </tr>
                    {/*end::Table row*/}
                  </thead>
                  <tbody className="fw-bold text-gray-600">
                      {isLoading ? (
                      <tr>
                        <td colSpan="8" className="text-center">
                          <Loader /> {/* Use the loader here */}
                        </td>
                      </tr>
                    ) :
                    Array.isArray(regionData) ? (
                      currentdata.length > 0 ? (
                        currentdata
                          .filter((row) => {
                            const matchSearch =
                              searchItem.toLowerCase() === ""
                                ? row
                                : String(row.name)
                                    .toLowerCase()
                                    .includes(searchItem);

                            return matchSearch;
                          })
                          .map((row, index) => {
                            return (
                              <tr
                                key={index}
                                data-kt-table-widget-4="subtable_template"
                              >
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={!!selectedUsers[row.id]}
                                        onChange={() =>
                                          handleSelectedRows(row.id)
                                        }
                                      />{index + 1}
                                    </div>
                                </td>
                                <td className="text-start">{row.name}</td>
                                <td className="text-start">{row.code}</td>
                                <td className="text-start">
                                  <button
                                    className="btn btn-icon btn-bg-light btn-color-primary btn-sm me-2"
                                    onClick={() => {
                                      setIsShowModalOpen(true),
                                        setSelectedUser(row);
                                    }}
                                  >
                                    {" "}
                                    <i className="bi bi-eye-fill fs-4"></i>
                                  </button>

                              {isShowModalOpen && (
                                  <div
                                    className="modal fade show d-block"
                                    tabIndex="-1"
                                    role="dialog"
                                    style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                                  >
                                    <div className="modal-dialog modal-dialog-centered" role="document">
                                      <div className="modal-content">
                                        {/* Modal Header */}
                                        <div className="modal-header">
                                          <h5 className="modal-title">Region Details</h5>
                                          <div
                                            className="btn btn-icon btn-sm btn-active-icon-primary"
                                            onClick={() => setIsShowModalOpen(false)}
                                          >
                                            <span className="svg-icon svg-icon-1">
                                              {/* Replace with actual icon */}
                                              <CloseIcon />
                                            </span>
                                          </div>
                                        </div>

                                        {/* Modal Body */}
                                        <div className="modal-body">
                                          <div className="mb-3">
                                            <label className="form-label fw-semibold">Name</label>
                                            <div className="form-control form-control-solid">
                                              {selectedUser?.name || '-'}
                                            </div>
                                          </div>

                                          <div className="mb-3">
                                            <label className="form-label fw-semibold">Code</label>
                                            <div className="form-control form-control-solid">
                                              {selectedUser?.code || '-'}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Modal Footer */}
                                        <div className="modal-footer">
                                
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}


                                  <span
                                    className="btn btn-icon btn-bg-light btn-color-warning btn-sm me-2"
                                    onClick={() => {
                                      setIsEditModalOpen(true),
                                        setSelectedUser(row);
                                    }}
                                  >
                                    <i className="bi bi-pencil-fill"></i>
                                  </span>

                                  {isEditModalOpen && (
                                        <div
                                          className="modal fade show"
                                          tabIndex="-1"
                                          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.1)" }}
                                        >
                                          <div className="modal-dialog">
                                            <div className="modal-content">
                                              {/* Modal Header */}
                                              <div className="modal-header">
                                                <h5 className="modal-title">Edit Region</h5>
                                                <div
                                                  className="btn btn-icon btn-sm btn-active-icon-primary"
                                                  onClick={() => setIsEditModalOpen(false)}
                                                >
                                                  <span className="svg-icon svg-icon-1">
                                                    {/* Replace with your actual CloseIcon component */}
                                                    <CloseIcon />
                                                  </span>
                                                </div>
                                              </div>

                                              {/* Modal Body */}
                                              <div className="modal-body">
                                                <div className="mb-3">
                                                  <label className="form-label">Name</label>
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Enter name"
                                                    required
                                                  />
                                                </div>
                                                <div className="mb-3">
                                                  <label className="form-label">Code</label>
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    name="code"
                                                    value={formData.code}
                                                    onChange={handleChange}
                                                    placeholder="Enter code"
                                                    required
                                                  />
                                                </div>
                                              </div>

                                              {/* Modal Footer */}
                                              <div className="modal-footer">
                                                <button
                                                  type="button"
                                                  className="btn btn-primary"
                                                  onClick={() => handleUpdateRegion(selectedUser.id)}
                                                >
                                                  Save changes
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                              
                                  <button
                                    className="btn btn-icon btn-bg-light btn-color-danger btn-sm"
                                    onClick={() => {
                                      setSelectedUser(row),
                                        setIsDeleteModalOpen(true);
                                    }}
                                  >
                                    <i className="bi bi-trash-fill"></i>
                                  </button>
                                {isDeleteModalOpen && (
                                      <div
                                        className="modal fade show"
                                        tabIndex="-1"
                                        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.1)" }}
                                      >
                                        <div className="modal-dialog">
                                          <div className="modal-content">
                                            {/* Modal Header */}
                                            <div className="modal-header">
                                              <h5 className="modal-title">Confirm Region Deletion</h5>
                                              <div
                                                className="btn btn-icon btn-sm btn-active-icon-primary"
                                                onClick={() => setIsDeleteModalOpen(false)}
                                              >
                                                <span className="svg-icon svg-icon-1">
                                                  {/* Replace this with your actual CloseIcon component */}
                                                  <CloseIcon />
                                                </span>
                                              </div>
                                            </div>

                                            {/* Modal Body */}
                                            <div className="modal-body">
                                              <p className="fs-5 text-gray-800">
                                                Are you sure you want to permanently delete this region?<br />
                                                This action cannot be undone.
                                              </p>
                                            </div>

                                            {/* Modal Footer */}
                                            <div className="modal-footer">
                                              <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() => handleDeleteRegion(selectedUser.id)}
                                              >
                                                Delete Permanently
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
                        <tr>
                          <td colSpan="8">No data available</td>
                        </tr>
                      )
                    ) : (
                      <tr>
                        <td colSpan="8">No users found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="pagination d-flex justify-content-between align-items-center mt-5">
                  <div>
                    Showing{" "}
                    {Math.min(
                      (currentPage - 1) * itemsPerPage + 1,
                      filteredData.length
                    )}{" "}
                    to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredData.length)}{" "}
                    of {filteredData.length} entries
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
                      Page {currentPage} of {totalPages}
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
      </div>
    </>
  );
}