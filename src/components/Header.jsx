import { useEffect, useState } from "react"


import { getOrganizationInfo } from "../features/organizationSlice";
import { signout } from "../features/authslice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import Notifications from "./Notices";

import { useTranslation } from "react-i18next";

import i18next from "i18next";



export default function Header() {

  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang); // Dynamically change language
    console.log(lang);
  };

  const navigate = useNavigate();
  const [logo, setLogo] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [countNotices, setCountNotices] = useState(0);

  const dispatch = useDispatch();
  const { organizationInfo } = useSelector((state) => state.organization);
  const [currentUser, setCurrentUser] = useState(null);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {

    if (window.KTDrawer) {

      window.KTDrawer.createInstances();

    }

  }, []);
  console.log(user);

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

      }
      fetchUser();

    }
    else {
      console.log('no current user');
    }
  }, [user]);
  useEffect(() => {
    setIsLoading(true);
    dispatch(getOrganizationInfo()).then((data) => {
      console.log(data);
      console.log(data.payload);
      console.log(data.payload?.en_name)
      console.log(data.payload?.logo)
      const backendBaseUrl = 'http://localhost:8000';

      setLogo(`${backendBaseUrl}/storage/${data.payload.logo}`);
    }).finally(() => setIsLoading(false));
  }, [organizationInfo]);

  const handleSignout = () => {
    dispatch(signout());
    navigate('/login');


  }
  const Loader = () => (
    <div className="d-flex justify-content-center py-10">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  return (

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
                      {isLoading ? (<Loader />) : (logo ? (
                        <img src={logo} className="h-30px" />
                      ) : (
                        <img alt="Logo" className="h-30px" />
                      ))}
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
          <h2 className="system-title">{t('idmanagementsystem')}</h2>
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
                <div style={{position: "relative", display: "inline-block"}}>
  <svg xmlns="http://www.w3.org/2000/svg"
       width="20" height="25" fill="currentColor"
       class="bi bi-bell-fill" viewBox="0 0 16 16">
    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
  </svg>
  

  <span style={{
    position: "absolute",
    top: "-4px",
    right: "-4px",
    backgroundColor: "red",
    color: "white",
    borderRadius: "50%",
    padding: "2px 5px",
    fontSize: "10px",
    lineHeight: "1",
    fontWeight: "bold",
  }}>
    {countNotices}
  </span>
</div>

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
                    {t('notifications')}
                    <span className="fs-8 opacity-75 ps-3">{countNotices} {t('report')}({t('s')})</span>
                  </h3>
                  {/*end::Title*/}
                  {/*begin::Tabs*/}
                  <ul className="nav nav-line-tabs nav-line-tabs-2x nav-stretch fw-semibold px-9">
                    <li className="nav-item">
                      <a
                        className="nav-link text-white opacity-75 opacity-state-100 pb-4 "
                        data-bs-toggle="tab"
                        href="#kt_topbar_notifications_1 "
                      >
                        {t('alerts')}
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

                      {/*begin::Section*/}

                      {/*begin::Symbol*/}

                      {/*end::Symbol*/}
                      {/*begin::Title*/}


                      <Notifications countNotices={countNotices} setCountNotices={setCountNotices} />



                      {/*end::Title*/}

                      {/*end::Section*/}
                      {/*begin::Label*/}

                      {/*end::Label*/}

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
                <img src={user.profile_image_url || currentUser?.profile_image_url} alt="user" />
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
                      <img alt="Logo" src={user.profile_image_url || currentUser?.profile_image_url} />
                    </div>
                    {/*end::Avatar*/}
                    {/*begin::Username*/}
                    <div className="d-flex flex-column">
                      <div className="fw-bold d-flex align-items-center fs-5">
                        {user.name || currentUser?.name}
                        <span className="badge badge-success fw-bold fs-8 px-2 py-1 ms-2">
                          {user.roles?.map(role => role.name) || user.roles?.[0].name
                            || currentUser?.roles?.map(role => role.name || currentUser?.roles?.[0].name)}
                        </span>
                      </div>
                      <a
                        href="#"
                        className="fw-semibold text-muted text-hover-primary fs-7"
                      >
                        {user.email || currentUser?.email}
                      </a>
                    </div>
                    {/*end::Username*/}
                  </div>
                </div>
                {/*end::Menu item*/}
                {/*begin::Menu separator*/}
                <div className="separator my-2" />
                {/*end::Menu separator*/}




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
                      {t('language')}
                      <span className="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0">
                        {t('english')}
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
                    <button
                      className={`menu-item d-flex align-items-center px-5 py-2 border-0 w-100 ${i18next.language === 'en' ? 'bg-primary text-white' : 'bg-light text-dark'
                        }`}
                      onClick={(e) => {
                        e.preventDefault();
                        changeLanguage('en');
                      }}
                    >
                      <span className="symbol symbol-20px me-4">
                        <img
                          className="rounded-1"
                          src="assets/media/flags/united-states.svg"
                          alt=""
                        />
                      </span>
                      {t('english')}
                    </button>

                    {/*end::Menu item*/}
                    {/*begin::Menu item*/}
                    <button
                      className={`menu-item d-flex align-items-center px-5 py-2 border-0 w-100 ${i18next.language === 'am' ? 'bg-primary text-white' : 'bg-light text-dark'
                        }`}
                      onClick={(e) => {
                        e.preventDefault();
                        changeLanguage('am');
                      }}
                    >
                      <span className="symbol symbol-20px me-4">
                        <img
                          className="rounded-1"
                          src="assets/media/flags/ethiopia.svg"
                          alt=""
                        />
                      </span>
                      {t('amharic')}
                    </button>

                    {/*end::Menu item*/}
                    {/*begin::Menu item*/}

                    {/*end::Menu item*/}
                    {/*begin::Menu item*/}

                    {/*end::Menu item*/}
                    {/*begin::Menu item*/}

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
                    {t('signout')}
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