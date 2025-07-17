import { useEffect,useState } from "react"
import { useDispatch } from "react-redux";

import { getProfile } from "../features/idCardSlice";


export default function QRScan(){
    const dispatch=useDispatch();
    const [id,setId]=useState();
    const [employeeProfile,setEmployeeProfile]=useState();
    useEffect(()=>{
          
          const querySearchParams=new URLSearchParams(window.location.search);
          const dataString=querySearchParams.get("data");
    
          if(dataString){
              
              setId(decodeURIComponent(dataString)); 
          }
    
      },[]);

      useEffect(()=>{
           if(id){
            dispatch(getProfile({Id:id})).then((data)=>{
                console.log(data)
                const dataitem=data.payload;
                console.log(dataitem);
                if(dataitem){
                    setEmployeeProfile(dataitem);
                    console.log(dataitem)
                }
                else{
                    console.log('no id found');
                    setEmployeeProfile(null);
                }
                
            })
        }
        },[dispatch,id])
    
        const employeeId=employeeProfile?.id_status

    return(
        <>
        <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
        <div
          id="kt_app_toolbar_container"
          className="app-container container-xxl d-flex flex-stack"
        >
          {/* Title and Breadcrumbs */}
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
            <h1 className="page-heading text-dark fw-bold fs-3 my-0">
              ID Scan
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
              <li className="breadcrumb-item text-muted">ID Scan</li>
            </ul>
          </div>



        </div>
      </div>

      <div id="kt_app_content" className="app-content flex-column-fluid">
  <div id="kt_app_content_container" className="app-container container-xxl">
    <div className="card mb-5 mb-xl-10" style={{backgroundColor:employeeProfile?.id_status.toLowerCase()==="expired"?"#ff4d4f":"lightgreen"}}>
        <div className="card-header border-0 cursor-pointer" role="button" data-bs-toggle="collapse" data-bs-target="#kt_account_profile_details" aria-expanded="true" aria-controls="kt_account_profile_details">
            <div className="card-title m-0">
                    Employee {id}
            </div>
        </div>
        <div id="kt_account_settings_profile_details" className="collapse show">
            <form id="kt_account_profile_details_form" className="form">
                <div className="card-body border-top p-9">
                    <div className="row mb-6">
                        <label className="col-lg-4 col-form-label fw-semibold fs-6">Profile Picture</label>
                        <div className="col-lg-8">
                            <img
  src={`http://localhost:8000/cors-image/${employeeProfile?.photo_url}`}
  width="200"
  height="200"
  alt="User"
  style={{
    borderRadius: '50%',
    objectFit: 'cover'
  }}
/>
                        </div>

                    </div>

                     <div className="row mb-6">
                            <label className="col-lg-4 col-form-label  fw-semibold fs-6">Full Name</label>
                            <div className="col-lg-8">
                                {employeeProfile?.en_name}
                            </div>
                     </div>

                     <div className="row mb-6">
                            <label className="col-lg-4 col-form-label  fw-semibold fs-6">Job Position</label>
                            <div className="col-lg-8">
                                {employeeProfile?.job_position}
                            </div>
                     </div>

                     <div className="row mb-6">
                            <label className="col-lg-4 col-form-label  fw-semibold fs-6">Status</label>
                            <div className="col-lg-8">
                                {employeeProfile?.id_status}
                            </div>
                     </div>

                </div>
            </form>
        </div>
    </div>
  

    </div>
    </div>

        </>
    )
}