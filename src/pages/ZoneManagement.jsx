import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"

import { useState,useEffect } from "react"
import { useDispatch,useSelector } from "react-redux"

import { createZone,getZone,updateZone,deleteZone,deleteBunch } from "../features/zoneSlice"
import { getRegion } from "../features/regionSlice"


export default function Zone(){
    const dispatch=useDispatch();
    const {zone}=useSelector((state=>state.zone));
    const [startSelection,setStartSelection]=useState(false);
    const [zoneData,setZoneData]=useState([]);
    const [region,setRegion]=useState([]);
    const [searchItem,setSearch]=useState('');
    const [selectedFilter,setSelectedFilter]=useState("show all");
    const [filteredData,setFilteredData]=useState([]);
    const [selectedUsers,setSelectedUsers]=useState({});
    const [formData,setFormData]=useState({
        name:'',
        code:'',
    })
    const [selectedUser,setSelectedUser]=useState({
        name:'',
        code:'',
    })

       const [isModalOpen,setIsModalOpen]=useState(false);
       const [isShowModalOpen,setIsShowModalOpen]=useState(false);
       const [isDeleteModalOpen,setIsDeleteModalOpen]=useState(false);
       const [isEditModalOpen,setIsEditModalOpen]=useState(false);
       const itemsPerPage=5;

    const totalPages=Math.ceil(zoneData.length/itemsPerPage);
    
       const [currentPage,setCurrentPage]=useState(1);
       const lastItemIndex=currentPage*itemsPerPage;
       const firstItemIndex=lastItemIndex-itemsPerPage;
       const currentdata=Array.isArray(zoneData)?zoneData.slice(firstItemIndex,lastItemIndex):[zoneData].slice(firstItemIndex,lastItemIndex);

       const nextPage=()=>{
        if(currentPage<totalPages){
            setCurrentPage(currentPage+1);
        }
    }

    const prevPage=()=>{
        if(currentPage>1){
            setCurrentPage(currentPage-1);
        }
    }

    useEffect(() => {
        dispatch(getZone())
          .then((data) => {
              console.log(data);
            const dataitem = data.payload;
              console.log(dataitem)
            
            const normalizedData = Array.isArray(dataitem) ? dataitem : [dataitem];
            setZoneData(normalizedData);
          })
          .catch((error) => {
            console.log('Error fetching data', error);
          });
      }, [dispatch,zone]);
       
useEffect(() => {
      dispatch(getRegion())
        .then((data) => {
            console.log(data);
          const dataitem = data.payload;
            console.log(dataitem)
          
          const normalizedData = Array.isArray(dataitem) ? dataitem : [dataitem];
          setRegion(normalizedData);
        })
        .catch((error) => {
          console.log('Error fetching data', error);
        });
    }, [dispatch]);

    useEffect(() => {
        console.log('userdata type check:', Array.isArray(region), region);
      }, [region]);

       useEffect(() => {
        if (selectedFilter === "show all") {
          setFilteredData(zoneData);
        } else {
          const filtered = zoneData.filter(
            (data) => data.region?.toLowerCase() === selectedFilter.toLowerCase()
          );
          setFilteredData(filtered);
        }
      }, [selectedFilter, zoneData]);
      console.log(selectedFilter)

    const handleSelectedRows = (rowId) => {
        setSelectedUsers((prev) => {
            const updatedSelection = {
                ...prev,
                [rowId]: !prev[rowId], 
            };
        const hasSelectedRows = Object.values(updatedSelection).some((isSelected) => isSelected);

        setStartSelection(hasSelectedRows); 
         if (!updatedSelection[rowId]) {
      delete updatedSelection[rowId];
    }

    
    if (Object.keys(updatedSelection).length === 0) {
      return {};
    }

        return updatedSelection;
    })};

 const handleSelectAll = () => {
  if (Object.keys(selectedUsers).length === zoneData.length) {
    
    setSelectedUsers({});
    setStartSelection({});
  } else {
    
    const newSelected = {};
    zoneData.forEach((user) => {
      newSelected[user.id] = true; 
    });
    setSelectedUsers(newSelected);
    setStartSelection(newSelected)
  }
};

    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value});
        
    }

    const handleSaveZone = () => {    
            if (!formData.name || !formData.region ) {
                alert('There are missing fields');
                return;
            } else {
                
                dispatch(createZone({ FormData: formData}));
               
            }
            setIsModalOpen(false);
        }
    
    const handleUpdateZone=(Id)=>{
        
            dispatch(updateZone({ Id:Id,FormData: formData }))
            setIsEditModalOpen(false);
        }

    const handleDeleteZone=(Id)=>{
          dispatch(deleteZone({Id:Id}))
            setIsDeleteModalOpen(false)
     }


    const handleDeleteBunch=()=>{
            console.log(selectedUsers);
           dispatch(deleteBunch({Id:selectedUsers}));
        }
    
    return(
       <div id="kt_app_body" data-kt-app-layout="dark-sidebar" data-kt-app-header-fixed="true" data-kt-app-sidebar-enabled="true" data-kt-app-sidebar-fixed="true" data-kt-app-sidebar-hoverable="true" data-kt-app-sidebar-push-header="true" data-kt-app-sidebar-push-toolbar="true" data-kt-app-sidebar-push-footer="true" data-kt-app-toolbar-enabled="true" className="app-default">
              <div className="d-flex flex-column flex-root app-root" id="kt_app_root">
              <div className="app-page flex-column flex-column-fluid" id="kt_app_page">
                <Header />
                <div className="app-wrapper" id="kt_app_wrapper">
                  <Sidebar />
                  <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
                    <div className="d-flex flex-column flex-column-fluid">
                      <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
                      <div
                        id="kt_app_toolbar_container"
                        className="app-container container-xxl d-flex flex-stack"
                      >
                        {/* Title and Breadcrumbs */}
                        <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                          <h1 className="page-heading text-dark fw-bold fs-3 my-0">
                            Zone Management
                          </h1>
                          <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
                            <li className="breadcrumb-item text-muted">
                              <a
                                href="/"
                                className="text-muted text-hover-primary"
                              >
                                Home
                              </a>
                            </li>
                            <li className="breadcrumb-item">
                              <span className="bullet bg-gray-400 w-5px h-2px"></span>
                            </li>
                            <li className="breadcrumb-item text-muted">Zone Management</li>
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
                  className={Object.keys(selectedUsers).length > 0
    ? "btn btn-sm fw-bold bg-body btn-color-gray-700 btn-active-color-primary"
    : "hide"
}
                  onClick={handleDeleteBunch}
                >
                  Delete Zone
                </a>
              </div>
              {isModalOpen && (
                <div
                  className="modal fade show"
                  tabIndex="-1"
                  id="kt_modal_scrollable_1"
                  style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Add Zone</h5>
                        
                      </div>

                  <fieldset>
                      <legend className="text-start">Zone Details</legend>
                          <form className="p-5 bg-white rounded shadow-sm text-start">
                            <div className="row g-4">
                              <div className="col-md-6">
                                  <label className="form-label fw-semibold required">Zone name</label>
                                  <input type="text"
                                  className="form-control" 
                                  name="name"
                                  onChange={(e)=>handleChange(e)}
                                  required
                                  placeholder="Zone name"></input>
                              </div>
                              <br/>
                              <div className="col-md-6">
                                  <label className="form-label fw-semibold required">Region </label>
                                  <select className="form-select" name="region"  onChange={handleChange}>
                                    <option value="">Select</option>
                                    {region.map((data)=>{
                                        return <option key={data.code} value={data.name}>{data.name}</option>
                                    })}
                                  </select>
                              </div>
                            </div>
                              
                          </form>
                              
                  </fieldset>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Close
                    </button>
                    <button type="button" className="btn btn-primary" onClick={handleSaveZone}>
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
          <div id="kt_app_content_container" className="app-container container-xxl">
            <div className="row g-5 g-xl-10">
              <div className="card card-flush h-xl-100">
                                                                                                        {/*begin::Card header*/}
                    <div className="card-header pt-7">
                                                                                                            {/*begin::Title*/}
                        <h3 className="card-title align-items-start flex-column">
                            <span className="card-label fw-bold text-gray-800">Zones table</span>
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
                                  {region.map((data)=>{
                                    return <option key={data.code} value={data.name}>{data.name}</option>
                                })}
                                </select>
															{/*end::Destination*/}
															
															{/*begin::Search*/}
								    <div className="position-relative my-1">
																{/*begin::Svg Icon | path: icons/duotune/general/gen021.svg*/}
										<span className="svg-icon svg-icon-2 position-absolute top-50 translate-middle-y ms-4">
											<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1" transform="rotate(45 17.0365 15.1223)" fill="currentColor" />
												<path d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z" fill="currentColor" />
											</svg>
										</span>
																{/*end::Svg Icon*/}
										<input type="text" data-kt-table-widget-4="search" className="form-control w-150px fs-7 ps-12" placeholder="Search" onChange={(e)=>setSearch(e.target.value)}/>
									</div>
															{/*end::Search*/}
							</div>
														{/*begin::Filters*/}
						</div>
                    </div>
                    <div className="card-body pt-2">
                        <table className="table table-striped gy-7 gs-7" id="kt_table_widget_4_table">
                        <thead>
															{/*begin::Table row*/}
                                    <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                                      <th className="min-w-100px">
  {Object.keys(selectedUsers).length !== zoneData.length ? (
    <i
      className="bi bi-circle"
      onClick={handleSelectAll}
      style={{ cursor: 'pointer' }}
      title="Select All"
    ></i>
  ) : (
    <i
      className="bi bi-check-circle-fill"
      onClick={handleSelectAll}
      style={{ cursor: 'pointer' }}
      title="Deselect All"
    ></i>
  )}
</th>
                                        <th className="min-w-100px">#</th>
                                        <th className="text-start min-w-100px">Name</th>
                                        <th className="text-start min-w-125px">Region</th>
                                        <th className="text-start min-w-100px">Action</th>
                                    </tr>
															{/*end::Table row*/}
                       </thead>
                       <tbody className="fw-bold text-gray-600">
                                {Array.isArray(zoneData) ? (
                        currentdata.length > 0 ? (
                          currentdata.filter((row)=>{
                            const matchSearch=searchItem.toLowerCase()===''?row:String(row.name).toLowerCase().includes(searchItem);
                            const matchFilter =
                        selectedFilter === 'show all' ||
                        row.region?.toLowerCase() === selectedFilter.toLowerCase();

                            return matchSearch&&matchFilter
                          })
                            .map((row, index) => {
                              
                              return (
                                <tr key={index} data-kt-table-widget-4="subtable_template">
                                  <td >
                                      {!selectedUsers[row.id]?<i className="bi bi-circle" onClick={()=>{handleSelectedRows(row.id)}}></i>:
                                        <i className="bi bi-check-circle-fill" onClick={()=>{handleSelectedRows(row.id)}}></i>     }
                                    </td>
                                    <td className="text-start">
                                              {index+1}
                                            </td>
                                    <td className="text-start">
                                      {row.name}
                                    </td>
                                    <td className="text-start">
                                      {row.region}
                                    </td>
                                    <td className="text-start">
                                    <span className="badge py-3 px-4 fs-7 badge-light-primary" onClick={()=>{setIsShowModalOpen(true),setSelectedUser(row)}}> <i className="bi bi-eye-fill"></i></span>

                                    {isShowModalOpen && (
                          
                          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{backgroundColor: 'rgba(0,0,0,0.1)' }}>
                          <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content p-5 bg-white rounded shadow-sm">
                            <fieldset>
                                    <legend>Region Details</legend>
                                    <div className="field-value">
                                        <label className="field">Name</label>
                                            <p >{selectedUser.name}</p>
                                    </div>
                                    <br/>
                                    <div className="field-value">
                                        <label className="field">Region</label>
                                            <p>{selectedUser.region}</p>
                                    </div>
                                    <br/>
                                                                                
                                    <br/>
                                            
                                </fieldset>
                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-light"
                                    onClick={() => setIsShowModalOpen(false)}
                                  >
                                    Close
                                  </button>
                                  
                                </div>
                            </div>
                          </div>
                        </div>

                            
                          
                        )}
            
            <span className="badge py-3 px-4 fs-7 badge-light-warning" onClick={()=>{setIsEditModalOpen(true),setSelectedUser(row)}}><i className="bi bi-pencil-fill"></i></span>
                        {isEditModalOpen && (
                                            <div
                                              className="modal fade show"
                                              tabIndex="-1"
                                              id="kt_modal_scrollable_1"
                                              style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.1)' }}
                                            >
                                              <div className="modal-dialog">
                                                <div className="modal-content">
                                                  <div className="modal-header">
                                                    <h5 className="modal-title">Edit Zone</h5>
                                                    
                                                  </div>

                                                  <fieldset>
                                                      <legend className="text-start">Zone Details</legend>
                                                          <form className="p-5 bg-white rounded shadow-sm text-start">
                                                            <div className="row g-4">
                                                              <div className="col-md-6">
                                                                  <label className="form-label fw-semibold">Name</label>
                                                                  <input type="text"
                                                                  className="form-control" 
                                                                  name="name"
                                                                  onChange={(e)=>handleChange(e)}
                                                                  required
                                                                  placeholder="Name"></input>
                                                              </div>
                                                              <br/>
                                                              <div className="col-md-6">
                                                                  <label className="form-label fw-semibold">Region</label>
                                                                  <select className="form-select" name="region"  onChange={handleChange}>
                                                                    <option value="">Select</option>
                                                                    {region.map((data)=>{
                                                                        return <option key={data.code} value={data.name}>{data.name}</option>
                                                                    })}
                                                                </select>
                                                              </div>
                                                              
                                                            </div>
                                                              
                                                          </form>
                                                              
                                                  </fieldset>

                                                  <div className="modal-footer">
                                                    <button
                                                      type="button"
                                                      className="btn btn-light"
                                                      onClick={() => setIsEditModalOpen(false)}
                                                    >
                                                      Close
                                                    </button>
                                                    <button type="button" className="btn btn-primary" onClick={()=>handleUpdateZone(selectedUser.id)}>
                                                      Save changes
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          )}
            <span className="badge py-3 px-4 fs-7 badge-light-danger" onClick={()=>{setSelectedUser(row),setIsDeleteModalOpen(true)}}><i className="bi bi-trash"></i></span>
                                                                  {isDeleteModalOpen && (
                                                        <div
                                                          className="modal fade show"
                                                          tabIndex="-1"
                                                          id="kt_modal_scrollable_1"
                                                          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.1)' }}
                                                        >
                                                          <div className="modal-dialog ">
                                                            <div className="modal-content " style={{textAlign:'center'}}>
                                                              <div className="modal-header">
                                                                
                                                                
                                                              </div>

                                                              <fieldset>
                                                                  <legend>Zone Details</legend>
                                                                  <p>Delete zone?</p>
                                                                          
                                                              </fieldset>

                                                              <div className="modal-footer">
                                                              <button
                                                                  type="button"
                                                                  className="btn btn-light"
                                                                  onClick={() => handleDeleteZone(selectedUser.id)}
                                                                >
                                                                  Delete
                                                                </button>

                                                                <button
                                                                  type="button"
                                                                  className="btn btn-light"
                                                                  onClick={() => setIsDeleteModalOpen(false)}
                                                                >
                                                                  Close
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
                                                          <tr><td colSpan="8">No data available</td></tr>
                                                        )
                                                      ) : (
                                                        <tr>
                                                          <td colSpan="8">No users found</td>
                                                        </tr>
                                                      )}
                                </tbody>
                        </table>
                    </div>
                </div>

                <ul className="pagination pagination-circle">
    <button onClick={prevPage} disabled={currentPage === 1}>
                            <i className="bi bi-chevron-double-left"></i>
                            </button>
                            <span> Page {currentPage} of {totalPages} </span>
                            <button onClick={nextPage} disabled={currentPage === totalPages}>
                            <i className="bi bi-chevron-double-right"></i>
                            </button>
</ul>
            </div>
            </div>
            </div>
            <Footer/>
                    </div>
                    </div>
                                    
                    
              </div>
              </div>
              </div>
        </div>
    )
}