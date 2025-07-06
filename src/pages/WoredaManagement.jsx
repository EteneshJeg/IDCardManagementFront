import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  createWoreda,
  getWoreda,
  updateWoreda,
  deleteWoreda,
  deleteBunch,
} from "../features/woredaSlice";
import { getZone } from "../features/zoneSlice";

// SVG Close Icon
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

export default function Woreda() {
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
  const { woreda } = useSelector((state) => state.woreda);
  const [startSelection, setStartSelection] = useState(false);
  const [woredaData, setWoredaData] = useState([]);
  const [zone, setZone] = useState([]);
  const [searchItem, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("show all");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    zone_id: "",
  });
  const [selectedUser, setSelectedUser] = useState({
    name: "",
    zone_id: "",
  });

  // Create a zone map for ID to name lookup
  const zoneMap = useMemo(() => {
    const map = {};
    zone.forEach((z) => {
      map[z.id] = z.name;
    });
    return map;
  }, [zone]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(woredaData.length / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(1);
  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentdata = Array.isArray(woredaData)
    ? woredaData.slice(firstItemIndex, lastItemIndex)
    : [woredaData].slice(firstItemIndex, lastItemIndex);

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
    dispatch(getWoreda())
      .then((data) => {
        const dataitem = data.payload;
        console.log(dataitem);

        const normalizedData = Array.isArray(dataitem) ? dataitem : [dataitem];
        setWoredaData(normalizedData);
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      })
      .finally(() => setIsLoading(false));
  }, [dispatch, woreda]);

  useEffect(() => {
    setIsLoading(true);
    dispatch(getZone())
      .then((data) => {
        // console.log(data);
        const dataitem = data.payload;
        console.log(dataitem);

        const normalizedData = Array.isArray(dataitem) ? dataitem : [dataitem];
        setZone(normalizedData);
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      })
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  useEffect(() => {
    console.log("userdata type check:", Array.isArray(zone), zone);
  }, [zone]);

  useEffect(() => {
    if (selectedFilter === "show all") {
      setFilteredData(woredaData);
    } else {
      const filtered = woredaData.filter(
        (data) =>
          zoneMap[data.zone_id]?.toLowerCase() === selectedFilter.toLowerCase()
      );
      setFilteredData(filtered);
    }
  }, [selectedFilter, woredaData, zoneMap]);
  console.log(selectedFilter);

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
    if (Object.keys(selectedUsers).length === woredaData.length) {
      setSelectedUsers({});
      setStartSelection({});
    } else {
      const newSelected = {};
      woredaData.forEach((user) => {
        newSelected[user.id] = true;
      });
      setSelectedUsers(newSelected);
      setStartSelection(newSelected);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveWoreda = () => {
    if (!formData.name || !formData.zone_id) {
      toast.error("There are missing fields");
      return;
    } else {
      dispatch(createWoreda({ FormData: formData }));
    }
    setIsModalOpen(false);
  };

  const handleUpdateWoreda = (Id) => {
    dispatch(updateWoreda({ Id: Id, FormData: formData }));
    setIsEditModalOpen(false);
  };

  const handleDeleteWoreda = (Id) => {
    dispatch(deleteWoreda({ Id: Id }));
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
              Woreda Management
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
              <li className="breadcrumb-item text-muted">Woreda Management</li>
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
              Add Zone
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
                    <h5 className="modal-title">Add Woreda</h5>
                    <div
                      className="btn btn-icon btn-sm btn-active-icon-primary"
                      onClick={() => setIsModalOpen(false)}
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
                      <label className="form-label fw-semibold required">
                        Woreda Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        onChange={handleChange}
                        required
                        placeholder="Enter woreda name"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold required">
                        Zone
                      </label>
                      <select
                        className="form-select"
                        name="zone_id"
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select</option>
                        {zone.map((data) => (
                          <option key={data.id} value={data.id}>
                            {data.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSaveWoreda}
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
                    Woreda table
                  </span>
                </h3>
                <div className="card-toolbar">
                  {/*begin::Filters*/}
                  <div className="d-flex flex-stack flex-wrap gap-4">
                    {/*begin::Destination*/}
                    <div className="text-gray-400 fs-7 me-2">Category</div>
                    {/*end::Label*/}
                    {/*begin::Select*/}
                    <select
                      className="form-select form-select-transparent text-gray-800 fs-base lh-1 fw-bold py-0 ps-3 w-auto"
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                      <option value="show all">Show all</option>
                      {zone.map((data) => {
                        return (
                          <option key={data.name} value={data.name}>
                            {data.name}
                          </option>
                        );
                      })}
                    </select>
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
                                woredaData.length
                              }
                              onChange={handleSelectAll}
                              title={
                                Object.keys(selectedUsers).length ===
                                woredaData.length
                                  ? "Deselect All"
                                  : "Select All"
                              }
                              style={{ cursor: "pointer" }}
                            />
                            S.N.
                        </div>
                      </th>
                      <th className="text-start min-w-100px">Name</th>
                      <th className="text-start min-w-125px">Zone</th>
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
                    ) : Array.isArray(woredaData) ? (
                      currentdata.length > 0 ? (
                        currentdata
                          .filter((row) => {
                            const matchSearch =
                              searchItem.toLowerCase() === ""
                                ? row
                                : String(row.name)
                                    .toLowerCase()
                                    .includes(searchItem);
                            const matchFilter =
                              selectedFilter === "show all" ||
                              zoneMap[row.zone_id]?.toLowerCase() ===
                                selectedFilter.toLowerCase();

                            return matchSearch && matchFilter;
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
                                        onChange={() => handleSelectedRows(row.id)}
                                      />
                                              {index + 1}
                                  </div>
                                </td>
                                <td className="text-start">{row.name}</td>
                                {/* Fixed: Display zone name instead of ID */}
                                <td className="text-start">
                                  {zoneMap[row.zone_id] || "-"}
                                </td>
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
                                      style={{
                                        backgroundColor: "rgba(0,0,0,0.1)",
                                      }}
                                    >
                                      <div
                                        className="modal-dialog modal-dialog-centered"
                                        role="document"
                                      >
                                        <div className="modal-content">
                                          {/* Modal Header */}
                                          <div className="modal-header">
                                            <h5 className="modal-title">
                                              Woreda Details
                                            </h5>
                                            <div
                                              className="btn btn-icon btn-sm btn-active-icon-primary"
                                              onClick={() =>
                                                setIsShowModalOpen(false)
                                              }
                                            >
                                              <span className="svg-icon svg-icon-1">
                                                {/* Replace this with your actual CloseIcon */}
                                                <CloseIcon />
                                              </span>
                                            </div>
                                          </div>

                                          {/* Modal Body */}
                                          <div className="modal-body">
                                            <div className="mb-3">
                                              <label className="form-label fw-semibold">
                                                Woreda Name
                                              </label>
                                              <div className="form-control form-control-solid">
                                                {selectedUser?.name || "-"}
                                              </div>
                                            </div>

                                            <div className="mb-3">
                                              <label className="form-label fw-semibold">
                                                Zone
                                              </label>
                                              <div className="form-control form-control-solid">
                                                {/* Fixed: Show zone name in view modal */}
                                                {zoneMap[
                                                  selectedUser?.zone_id
                                                ] || "-"}
                                              </div>
                                            </div>
                                          </div>

                                          {/* Modal Footer */}
                                          <div className="modal-footer"></div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  <button
                                    className="btn btn-icon btn-bg-light btn-color-warning btn-sm me-2"
                                    onClick={() => {
                                      setIsEditModalOpen(true),
                                        setSelectedUser(row);
                                    }}
                                  >
                                    <i className="bi bi-pencil-fill"></i>
                                  </button>
                                  {isEditModalOpen && (
                                    <div
                                      className="modal fade show"
                                      tabIndex="-1"
                                      id="kt_modal_scrollable_1"
                                      style={{
                                        display: "block",
                                        backgroundColor: "rgba(0,0,0,0.1)",
                                      }}
                                    >
                                      <div className="modal-dialog">
                                        <div className="modal-content">
                                          <div className="modal-header">
                                            <h5 className="modal-title">
                                              Edit Woreda
                                            </h5>
                                            <div
                                              className="btn btn-icon btn-sm btn-active-icon-primary"
                                              onClick={() =>
                                                setIsEditModalOpen(false)
                                              }
                                            >
                                              <span className="svg-icon svg-icon-1">
                                                {/* Replace with your actual CloseIcon component */}
                                                <CloseIcon />
                                              </span>
                                            </div>
                                          </div>

                                          <fieldset>
                                            <legend className="text-start">
                                              Woreda Details
                                            </legend>
                                            <form className="p-5 bg-white rounded shadow-sm text-start">
                                              <div className="row g-4">
                                                <div className="col-md-6">
                                                  <label className="form-label fw-semibold">
                                                    Name
                                                  </label>
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    name="name"
                                                    onChange={(e) =>
                                                      handleChange(e)
                                                    }
                                                    required
                                                    placeholder="Name"
                                                  ></input>
                                                </div>
                                                <br />
                                                <div className="col-md-6">
                                                  <label className="form-label fw-semibold">
                                                    Zone
                                                  </label>
                                                  <select
                                                    className="form-select"
                                                    name="zone_id"
                                                    onChange={handleChange}
                                                  >
                                                    <option value="">
                                                      Select
                                                    </option>
                                                    {zone.map((data) => {
                                                      return (
                                                        <option
                                                          key={data.id}
                                                          value={data.id}
                                                        >
                                                          {data.name}
                                                        </option>
                                                      );
                                                    })}
                                                  </select>
                                                </div>
                                              </div>
                                            </form>
                                          </fieldset>

                                          <div className="modal-footer">
                                            <button
                                              type="button"
                                              className="btn btn-primary"
                                              onClick={() =>
                                                handleUpdateWoreda(
                                                  selectedUser.id
                                                )
                                              }
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
                                      style={{
                                        display: "block",
                                        backgroundColor: "rgba(0,0,0,0.1)",
                                      }}
                                    >
                                      <div className="modal-dialog">
                                        <div className="modal-content">
                                          {/* Modal Header */}
                                          <div className="modal-header">
                                            <h5 className="modal-title">
                                              Confirm Woreda Deletion
                                            </h5>
                                            <div
                                              className="btn btn-icon btn-sm btn-active-icon-primary"
                                              onClick={() =>
                                                setIsDeleteModalOpen(false)
                                              }
                                            >
                                              <span className="svg-icon svg-icon-1">
                                                {/* Replace with your actual CloseIcon */}
                                                <CloseIcon />
                                              </span>
                                            </div>
                                          </div>

                                          {/* Modal Body */}
                                          <div className="modal-body text-center">
                                            <p className="fs-5 text-gray-800">
                                              Are you sure you want to
                                              permanently delete this woreda?
                                              <br />
                                              This action cannot be undone.
                                            </p>
                                          </div>

                                          {/* Modal Footer */}
                                          <div className="modal-footer">
                                            <button
                                              type="button"
                                              className="btn btn-danger"
                                              onClick={() =>
                                                handleDeleteWoreda(
                                                  selectedUser.id
                                                )
                                              }
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
