import { useEffect,useState } from "react"


import { getOrganizationInfo } from "../features/organizationSlice";
import { signout } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

export default function Header(){
 const navigate=useNavigate();
  const [logo,setLogo]=useState();
	const dispatch=useDispatch();
	const {organizationInfo}=useSelector((state)=>state.organization);

   useEffect(() => {

  if (window.KTDrawer) {

    window.KTDrawer.createInstances();

  }

}, []);

	useEffect(()=>{
		dispatch(getOrganizationInfo()).then((data)=>{
			console.log(data);
			console.log(data.payload);
			console.log(data.payload?.en_name)
      console.log(data.payload?.logo)
			const backendBaseUrl = 'http://localhost:8000'; 

setLogo(`${backendBaseUrl}/storage/${data.payload.logo}`);
		})
	},[organizationInfo]);

  const handleSignout=()=>{
    dispatch(signout());
    navigate('/login');
    
  }
    return(
        
      <div id="kt_app_header" className="app-header">
      {/*begin::Header container*/}
      <div
        className="app-container container-fluid d-flex align-items-stretch justify-content-between"
        id="kt_app_header_container"
      >
        {/*begin::sidebar mobile toggle*/}
       
						<div className="d-flex align-items-center d-lg-none ms-n2 me-2" title="Show sidebar menu">
							<div className="btn btn-icon btn-active-color-primary w-35px h-35px" id="kt_app_sidebar_mobile_toggle" >
								
								<span className="svg-icon svg-icon-1">
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M21 7H3C2.4 7 2 6.6 2 6V4C2 3.4 2.4 3 3 3H21C21.6 3 22 3.4 22 4V6C22 6.6 21.6 7 21 7Z" fill="currentColor" />
										<path opacity="0.3" d="M21 14H3C2.4 14 2 13.6 2 13V11C2 10.4 2.4 10 3 10H21C21.6 10 22 10.4 22 11V13C22 13.6 21.6 14 21 14ZM22 20V18C22 17.4 21.6 17 21 17H3C2.4 17 2 17.4 2 18V20C2 20.6 2.4 21 3 21H21C21.6 21 22 20.6 22 20Z" fill="currentColor" />
									</svg>
								</span>
								
							</div>
						</div>
						
        {/*end::sidebar mobile toggle*/}
        
        {/*begin::Header wrapper*/}
        <div
          className="d-flex align-items-stretch justify-content-between flex-lg-grow-1"
          id="kt_app_header_wrapper"
        >
          {/*begin::Menu wrapper*/}
          <div
            className="app-header-menu app-header-mobile-drawer align-items-stretch"
            data-kt-drawer="true"
            data-kt-drawer-name="app-header-menu"
            data-kt-drawer-activate="{default: true, lg: false}"
            data-kt-drawer-overlay="true"
            data-kt-drawer-width="250px"
            data-kt-drawer-direction="end"
            data-kt-drawer-toggle="#kt_app_header_menu_toggle"
            data-kt-swapper="true"
            data-kt-swapper-mode="{default: 'append', lg: 'prepend'}"
            data-kt-swapper-parent="{default: '#kt_app_body', lg: '#kt_app_header_wrapper'}"
          >
            {/*begin::Menu*/}
            <div
              className="menu menu-rounded menu-column menu-lg-row my-5 my-lg-0 align-items-stretch fw-semibold px-2 px-lg-0"
              id="kt_app_header_menu"
              data-kt-menu="true"
            >
              {/*begin:Menu item*/}
              <div
                data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
                data-kt-menu-placement="bottom-start"
                className="menu-item here show menu-here-bg menu-lg-down-accordion me-0 me-lg-2"
              >
                {/*begin:Menu link*/}
                <span className="menu-link">
                  <span className="menu-title">
                  <a href="/">
							{logo ? (
								<img src={logo} className="h-30px"/>
							  ) : (
								<img alt="Logo"  className="h-30px"/>
							  )}
							</a>
                  </span>
                  <span className="menu-arrow d-lg-none" />
                </span>
                {/*end:Menu link*/}
                
              </div>
              {/*end:Menu item*/}
              
            </div>
            {/*end::Menu*/}
          </div>
          
          {/*end::Menu wrapper*/}
          <h2 className="system-title">ID Management System</h2>
          {/*begin::Navbar*/}
          <div className="app-navbar flex-shrink-0">
            
            
            {/*begin::Notifications*/}
            <div className="app-navbar-item ms-1 ms-lg-3">
              {/*begin::Menu- wrapper*/}
              <div
                className="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px"
                data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
                data-kt-menu-attach="parent"
                data-kt-menu-placement="bottom-end"
              >
                {/*begin::Svg Icon | path: icons/duotune/general/gen022.svg*/}
                <span className="svg-icon svg-icon-1">
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.2929 2.70711C11.6834 2.31658 12.3166 2.31658 12.7071 2.70711L15.2929 5.29289C15.6834 5.68342 15.6834 6.31658 15.2929 6.70711L12.7071 9.29289C12.3166 9.68342 11.6834 9.68342 11.2929 9.29289L8.70711 6.70711C8.31658 6.31658 8.31658 5.68342 8.70711 5.29289L11.2929 2.70711Z"
                      fill="currentColor"
                    />
                    <path
                      d="M11.2929 14.7071C11.6834 14.3166 12.3166 14.3166 12.7071 14.7071L15.2929 17.2929C15.6834 17.6834 15.6834 18.3166 15.2929 18.7071L12.7071 21.2929C12.3166 21.6834 11.6834 21.6834 11.2929 21.2929L8.70711 18.7071C8.31658 18.3166 8.31658 17.6834 8.70711 17.2929L11.2929 14.7071Z"
                      fill="currentColor"
                    />
                    <path
                      opacity="0.3"
                      d="M5.29289 8.70711C5.68342 8.31658 6.31658 8.31658 6.70711 8.70711L9.29289 11.2929C9.68342 11.6834 9.68342 12.3166 9.29289 12.7071L6.70711 15.2929C6.31658 15.6834 5.68342 15.6834 5.29289 15.2929L2.70711 12.7071C2.31658 12.3166 2.31658 11.6834 2.70711 11.2929L5.29289 8.70711Z"
                      fill="currentColor"
                    />
                    <path
                      opacity="0.3"
                      d="M17.2929 8.70711C17.6834 8.31658 18.3166 8.31658 18.7071 8.70711L21.2929 11.2929C21.6834 11.6834 21.6834 12.3166 21.2929 12.7071L18.7071 15.2929C18.3166 15.6834 17.6834 15.6834 17.2929 15.2929L14.7071 12.7071C14.3166 12.3166 14.3166 11.6834 14.7071 11.2929L17.2929 8.70711Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                {/*end::Svg Icon*/}
              </div>
              {/*begin::Menu*/}
              <div
                className="menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px"
                data-kt-menu="true"
              >
                {/*begin::Heading*/}
                <div
                  className="d-flex flex-column bgi-no-repeat rounded-top"
                  style={{
                    backgroundImage:
                      'url("assets/media/misc/menu-header-bg.jpg")'
                  }}
                >
                  {/*begin::Title*/}
                  <h3 className="text-white fw-semibold px-9 mt-10 mb-6">
                    Notifications
                    <span className="fs-8 opacity-75 ps-3">24 reports</span>
                  </h3>
                  {/*end::Title*/}
                  {/*begin::Tabs*/}
                  <ul className="nav nav-line-tabs nav-line-tabs-2x nav-stretch fw-semibold px-9">
                    <li className="nav-item">
                      <a
                        className="nav-link text-white opacity-75 opacity-state-100 pb-4"
                        data-bs-toggle="tab"
                        href="#kt_topbar_notifications_1"
                      >
                        Alerts
                      </a>
                    </li>
                    
                    
                  </ul>
                  {/*end::Tabs*/}
                </div>
                {/*end::Heading*/}
                {/*begin::Tab content*/}
                <div className="tab-content">
                  {/*begin::Tab panel*/}
                  <div
                    className="tab-pane fade"
                    id="kt_topbar_notifications_1"
                    role="tabpanel"
                  >
                    {/*begin::Items*/}
                    <div className="scroll-y mh-325px my-5 px-8">
                      {/*begin::Item*/}
                      <div className="d-flex flex-stack py-4">
                        {/*begin::Section*/}
                        <div className="d-flex align-items-center">
                          {/*begin::Symbol*/}
                          <div className="symbol symbol-35px me-4">
                            <span className="symbol-label bg-light-primary">
                              {/*begin::Svg Icon | path: icons/duotune/technology/teh008.svg*/}
                              <span className="svg-icon svg-icon-2 svg-icon-primary">
                                <svg
                                  width={24}
                                  height={24}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    opacity="0.3"
                                    d="M11 6.5C11 9 9 11 6.5 11C4 11 2 9 2 6.5C2 4 4 2 6.5 2C9 2 11 4 11 6.5ZM17.5 2C15 2 13 4 13 6.5C13 9 15 11 17.5 11C20 11 22 9 22 6.5C22 4 20 2 17.5 2ZM6.5 13C4 13 2 15 2 17.5C2 20 4 22 6.5 22C9 22 11 20 11 17.5C11 15 9 13 6.5 13ZM17.5 13C15 13 13 15 13 17.5C13 20 15 22 17.5 22C20 22 22 20 22 17.5C22 15 20 13 17.5 13Z"
                                    fill="currentColor"
                                  />
                                  <path
                                    d="M17.5 16C17.5 16 17.4 16 17.5 16L16.7 15.3C16.1 14.7 15.7 13.9 15.6 13.1C15.5 12.4 15.5 11.6 15.6 10.8C15.7 9.99999 16.1 9.19998 16.7 8.59998L17.4 7.90002H17.5C18.3 7.90002 19 7.20002 19 6.40002C19 5.60002 18.3 4.90002 17.5 4.90002C16.7 4.90002 16 5.60002 16 6.40002V6.5L15.3 7.20001C14.7 7.80001 13.9 8.19999 13.1 8.29999C12.4 8.39999 11.6 8.39999 10.8 8.29999C9.99999 8.19999 9.20001 7.80001 8.60001 7.20001L7.89999 6.5V6.40002C7.89999 5.60002 7.19999 4.90002 6.39999 4.90002C5.59999 4.90002 4.89999 5.60002 4.89999 6.40002C4.89999 7.20002 5.59999 7.90002 6.39999 7.90002H6.5L7.20001 8.59998C7.80001 9.19998 8.19999 9.99999 8.29999 10.8C8.39999 11.5 8.39999 12.3 8.29999 13.1C8.19999 13.9 7.80001 14.7 7.20001 15.3L6.5 16H6.39999C5.59999 16 4.89999 16.7 4.89999 17.5C4.89999 18.3 5.59999 19 6.39999 19C7.19999 19 7.89999 18.3 7.89999 17.5V17.4L8.60001 16.7C9.20001 16.1 9.99999 15.7 10.8 15.6C11.5 15.5 12.3 15.5 13.1 15.6C13.9 15.7 14.7 16.1 15.3 16.7L16 17.4V17.5C16 18.3 16.7 19 17.5 19C18.3 19 19 18.3 19 17.5C19 16.7 18.3 16 17.5 16Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                              {/*end::Svg Icon*/}
                            </span>
                          </div>
                          {/*end::Symbol*/}
                          {/*begin::Title*/}
                          <div className="mb-0 me-2">
                            <a
                              href="#"
                              className="fs-6 text-gray-800 text-hover-primary fw-bold"
                            >
                              ID issued
                            </a>
                            <div className="text-gray-400 fs-7">
                              ID issued
                            </div>
                          </div>
                          {/*end::Title*/}
                        </div>
                        {/*end::Section*/}
                        {/*begin::Label*/}
                        <span className="badge badge-light fs-8">1 hr ago</span>
                        {/*end::Label*/}
                      </div>
                      {/*end::Item*/}
                      {/*begin::Item*/}
                      <div className="d-flex flex-stack py-4">
                        {/*begin::Section*/}
                        <div className="d-flex align-items-center">
                          
                        </div>
                        {/*end::Section*/}
                        
                      </div>
                      {/*end::Item*/}
                    </div>
                    {/*end::Items*/}

                    {/*begin::View more*/}
                    <div className="py-3 text-center border-top">
                      <a
                        href=""
                        className="btn btn-color-gray-600 btn-active-color-primary"
                      >
                        View All
                        {/*begin::Svg Icon | path: icons/duotune/arrows/arr064.svg*/}
                        <span className="svg-icon svg-icon-5">
                          <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              opacity="0.5"
                              x={18}
                              y={13}
                              width={13}
                              height={2}
                              rx={1}
                              transform="rotate(-180 18 13)"
                              fill="currentColor"
                            />
                            <path
                              d="M15.4343 12.5657L11.25 16.75C10.8358 17.1642 10.8358 17.8358 11.25 18.25C11.6642 18.6642 12.3358 18.6642 12.75 18.25L18.2929 12.7071C18.6834 12.3166 18.6834 11.6834 18.2929 11.2929L12.75 5.75C12.3358 5.33579 11.6642 5.33579 11.25 5.75C10.8358 6.16421 10.8358 6.83579 11.25 7.25L15.4343 11.4343C15.7467 11.7467 15.7467 12.2533 15.4343 12.5657Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                        {/*end::Svg Icon*/}
                      </a>
                    </div>
                    {/*end::View more*/}
                  </div>
                  {/*end::Tab panel*/}
                  
                </div>
                {/*end::Tab content*/}
              </div>
              {/*end::Menu*/}
              {/*end::Menu wrapper*/}
            </div>
            {/*end::Notifications*/}
            
            
            
            {/*begin::User menu*/}
            <div
              className="app-navbar-item ms-1 ms-lg-3"
              id="kt_header_user_menu_toggle"
            >
              {/*begin::Menu wrapper*/}
              <div
                className="cursor-pointer symbol symbol-35px symbol-md-40px"
                data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
                data-kt-menu-attach="parent"
                data-kt-menu-placement="bottom-end"
              >
                <img src="assets/media/avatars/300-1.jpg" alt="user" />
              </div>
              {/*begin::User account menu*/}
              <div
                className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-275px"
                data-kt-menu="true"
              >
                {/*begin::Menu item*/}
                <div className="menu-item px-3">
                  <div className="menu-content d-flex align-items-center px-3">
                    {/*begin::Avatar*/}
                    <div className="symbol symbol-50px me-5">
                      <img alt="Logo" src="assets/media/avatars/300-1.jpg" />
                    </div>
                    {/*end::Avatar*/}
                    {/*begin::Username*/}
                    <div className="d-flex flex-column">
                      <div className="fw-bold d-flex align-items-center fs-5">
                        Max Smith
                        <span className="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2">
                          Pro
                        </span>
                      </div>
                      <a
                        href="#"
                        className="fw-semibold text-muted text-hover-primary fs-7"
                      >
                        max@kt.com
                      </a>
                    </div>
                    {/*end::Username*/}
                  </div>
                </div>
                {/*end::Menu item*/}
                {/*begin::Menu separator*/}
                <div className="separator my-2" />
                {/*end::Menu separator*/}
                {/*begin::Menu item*/}
                <div className="menu-item px-5">
                  <a
                    href="../../demo1/dist/account/overview.html"
                    className="menu-link px-5"
                  >
                    My Profile
                  </a>
                </div>
                {/*end::Menu item*/}
                
                
                
                {/*begin::Menu separator*/}
                <div className="separator my-2" />
                {/*end::Menu separator*/}
                {/*begin::Menu item*/}
                <div
                  className="menu-item px-5"
                  data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
                  data-kt-menu-placement="left-start"
                  data-kt-menu-offset="-15px, 0"
                >
                  <a href="#" className="menu-link px-5">
                    <span className="menu-title position-relative">
                      Language
                      <span className="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0">
                        English
                        <img
                          className="w-15px h-15px rounded-1 ms-2"
                          src="assets/media/flags/united-states.svg"
                          alt=""
                        />
                      </span>
                    </span>
                  </a>
                  {/*begin::Menu sub*/}
                  <div className="menu-sub menu-sub-dropdown w-175px py-4">
                    {/*begin::Menu item*/}
                    <div className="menu-item px-3">
                      <a
                        href="../../demo1/dist/account/settings.html"
                        className="menu-link d-flex px-5 active"
                      >
                        <span className="symbol symbol-20px me-4">
                          <img
                            className="rounded-1"
                            src="assets/media/flags/united-states.svg"
                            alt=""
                          />
                        </span>
                        English
                      </a>
                    </div>
                    {/*end::Menu item*/}
                    {/*begin::Menu item*/}
                    <div className="menu-item px-3">
                      <a
                        href="../../demo1/dist/account/settings.html"
                        className="menu-link d-flex px-5"
                      >
                        <span className="symbol symbol-20px me-4">
                          <img
                            className="rounded-1"
                            src="assets/media/flags/spain.svg"
                            alt=""
                          />
                        </span>
                        Spanish
                      </a>
                    </div>
                    {/*end::Menu item*/}
                    {/*begin::Menu item*/}
                    <div className="menu-item px-3">
                      <a
                        href="../../demo1/dist/account/settings.html"
                        className="menu-link d-flex px-5"
                      >
                        <span className="symbol symbol-20px me-4">
                          <img
                            className="rounded-1"
                            src="assets/media/flags/germany.svg"
                            alt=""
                          />
                        </span>
                        German
                      </a>
                    </div>
                    {/*end::Menu item*/}
                    {/*begin::Menu item*/}
                    <div className="menu-item px-3">
                      <a
                        href="../../demo1/dist/account/settings.html"
                        className="menu-link d-flex px-5"
                      >
                        <span className="symbol symbol-20px me-4">
                          <img
                            className="rounded-1"
                            src="assets/media/flags/japan.svg"
                            alt=""
                          />
                        </span>
                        Japanese
                      </a>
                    </div>
                    {/*end::Menu item*/}
                    {/*begin::Menu item*/}
                    <div className="menu-item px-3">
                      <a
                        href="../../demo1/dist/account/settings.html"
                        className="menu-link d-flex px-5"
                      >
                        <span className="symbol symbol-20px me-4">
                          <img
                            className="rounded-1"
                            src="assets/media/flags/france.svg"
                            alt=""
                          />
                        </span>
                        French
                      </a>
                    </div>
                    {/*end::Menu item*/}
                  </div>
                  {/*end::Menu sub*/}
                </div>
                {/*end::Menu item*/}
                
                {/*begin::Menu item*/}
                <div className="menu-item px-5">
                  <a
                    onClick={handleSignout}
                    className="menu-link px-5"
                  >
                    Sign Out
                  </a>
                </div>
                {/*end::Menu item*/}
              </div>
              {/*end::User account menu*/}
              {/*end::Menu wrapper*/}
            </div>
            {/*end::User menu*/}
            {/*begin::Header menu toggle*/}
            <div
              className="app-navbar-item d-lg-none ms-2 me-n3"
              title="Show header menu"
            >
              <div
                className="btn btn-icon btn-active-color-primary w-35px h-35px"
                id="kt_app_header_menu_toggle"
              >
                {/*begin::Svg Icon | path: icons/duotune/text/txt001.svg*/}
                <span className="svg-icon svg-icon-1">
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 11H3C2.4 11 2 10.6 2 10V9C2 8.4 2.4 8 3 8H13C13.6 8 14 8.4 14 9V10C14 10.6 13.6 11 13 11ZM22 5V4C22 3.4 21.6 3 21 3H3C2.4 3 2 3.4 2 4V5C2 5.6 2.4 6 3 6H21C21.6 6 22 5.6 22 5Z"
                      fill="currentColor"
                    />
                    <path
                      opacity="0.3"
                      d="M21 16H3C2.4 16 2 15.6 2 15V14C2 13.4 2.4 13 3 13H21C21.6 13 22 13.4 22 14V15C22 15.6 21.6 16 21 16ZM14 20V19C14 18.4 13.6 18 13 18H3C2.4 18 2 18.4 2 19V20C2 20.6 2.4 21 3 21H13C13.6 21 14 20.6 14 20Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                {/*end::Svg Icon*/}
              </div>
            </div>
            {/*end::Header menu toggle*/}
          </div>
          {/*end::Navbar*/}
        </div>
        {/*end::Header wrapper*/}
      </div>
      {/*end::Header container*/}
    </div>
  
    )
}