import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrganizationInfo } from "../features/organizationSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "../features/roleSlice";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { t } = useTranslation();
  const [logo, setLogo] = useState();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const dispatch = useDispatch();
  const { organizationInfo } = useSelector((state) => state.organization);
  const role = useSelector((state) => state.user.role);
  const user = useSelector((state) => state.user.user);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState([]);


  // Initialize sidebar toggle functionality
  useEffect(() => {
    // Initialize KT components
    if (typeof window !== "undefined" && window.KTApp) {
      window.KTApp.init();
    }

    // Initialize toggle specifically
    if (typeof window !== "undefined" && window.KTToggle) {
      window.KTToggle.init();
    }

    // Check localStorage for minimized state
    const savedState = localStorage.getItem('kt_sidebar_minimized');
    if (savedState === 'on') {
      document.body.classList.add('app-sidebar-minimize');
      setIsMinimized(true);
    }
  }, []);

  // Toggle handler with state sync
  const handleSidebarToggle = () => {
    document.body.classList.toggle('app-sidebar-minimize');
    const minimized = document.body.classList.contains('app-sidebar-minimize');
    setIsMinimized(minimized);
    localStorage.setItem('kt_sidebar_minimized', minimized ? 'on' : 'off');
  };

  // Fetch organization info
  useEffect(() => {
    dispatch(getOrganizationInfo()).then((data) => {
      const backendBaseUrl = 'http://localhost:8000'; // or your actual domain

      setLogo(`${backendBaseUrl}/storage/${data.payload.logo}`);
    });
  }, [dispatch, organizationInfo]);

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
    console.log(currentUser);
    console.log(currentRole)
  }, [currentUser]);


  useEffect(() => {
    async function fetchData() {
      console.log(role);
      let token = JSON.parse(localStorage.getItem('token'));
      try {
        const response = await axios.get('http://localhost:8000/api/roles', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataitem = response.data
        console.log(dataitem);

        console.log(role)
        if (role.length !== 0) {
          const rolesExist = dataitem.filter(data => role.includes(data.name)).map(data => ({
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



      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    }
    fetchData();
  }, [currentRole]);

  console.log(user);


  console.log(permissions.map(p => p.name));





  return (
    <div
      id="kt_app_sidebar"
      className={`app-sidebar flex-column ${isMinimized ? 'minimized' : ''}`}
      data-kt-drawer="true"
      data-kt-drawer-name="app-sidebar"
      data-kt-drawer-activate="{default: true, lg: false}"
      data-kt-drawer-overlay="true"
      data-kt-drawer-width="225px"
      data-kt-drawer-direction="start"
      data-kt-drawer-toggle="#kt_app_sidebar_mobile_toggle"
    >
      <div
        className="app-sidebar-logo px-6 border-0 !border-none !shadow-none"
        id="kt_app_sidebar_logo"
        style={{ borderBottom: "none" }}
      >
        <Link to="/">
          {logo ? (
            <img
              src={logo}
              className={`h-25px app-sidebar-logo-default ${isMinimized ? 'minimized-logo' : ''}`}
              alt="Organization Logo"
            />
          ) : (
            <div className={`logo-placeholder ${isMinimized ? 'minimized' : ''}`}>
              <div className="placeholder-box" />
              {!isMinimized && <span>Organization Logo</span>}
            </div>
          )}
        </Link>

        <div
          id="kt_app_sidebar_toggle"
          className="app-sidebar-toggle btn btn-icon btn-shadow btn-sm btn-color-muted btn-active-color-primary body-bg h-30px w-30px position-absolute top-50 start-100 translate-middle rotate"
          data-kt-toggle="true"
          data-kt-toggle-state="active"
          data-kt-toggle-target="body"
          data-kt-toggle-name="app-sidebar-minimize"
          onClick={handleSidebarToggle}
        >
          <span className={`svg-icon svg-icon-2 ${isMinimized ? 'rotated' : ''}`}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.5"
                d="M14.2657 11.4343L18.45 7.25C18.8642 6.83579 18.8642 6.16421 18.45 5.75C18.0358 5.33579 17.3642 5.33579 16.95 5.75L11.4071 11.2929C11.0166 11.6834 11.0166 12.3166 11.4071 12.7071L16.95 18.25C17.3642 18.6642 18.0358 18.6642 18.45 18.25C18.8642 17.8358 18.8642 17.1642 18.45 16.75L14.2657 12.5657C13.9533 12.2533 13.9533 11.7467 14.2657 11.4343Z"
                fill="currentColor"
              />
              <path
                d="M8.2657 11.4343L12.45 7.25C12.8642 6.83579 12.8642 6.16421 12.45 5.75C12.0358 5.33579 11.3642 5.33579 10.95 5.75L5.40712 11.2929C5.01659 11.6834 5.01659 12.3166 5.40712 12.7071L10.95 18.25C11.3642 18.6642 12.0358 18.6642 12.45 18.25C12.8642 17.8358 12.8642 17.1642 12.45 16.75L8.2657 12.5657C7.95328 12.2533 7.95328 11.7467 8.2657 11.4343Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </div>
      </div>

      <div className={`app-sidebar-menu overflow-hidden flex-column-fluid ${isMinimized ? 'minimized' : ''}`}>
        <div
          id="kt_app_sidebar_menu_wrapper"
          className="app-sidebar-wrapper hover-scroll-overlay-y my-5"
          data-kt-scroll="true"
          data-kt-scroll-activate="true"
          data-kt-scroll-height="auto"
          data-kt-scroll-dependencies="#kt_app_sidebar_logo, #kt_app_sidebar_footer"
          data-kt-scroll-wrappers="kt_app_sidebar_menu"
          data-kt-scroll-offset="5px"
          data-kt-scroll-save-state="true"
        >
          <div
            className="menu menu-column menu-rounded menu-sub-indention px-3"
            id="kt_app_sidebar_menu"
            data-kt-menu="true"
            data-kt-menu-expand="false"
          >
            <div
              data-kt-menu-trigger="click"
              className="menu-item here show menu-accordion"
            >
              <span className="menu-link">
                <span className="menu-icon">
                  <span className="svg-icon svg-icon-2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="2"
                        y="2"
                        width="9"
                        height="9"
                        rx="2"
                        fill="currentColor"
                      />
                      <rect
                        opacity="0.3"
                        x="13"
                        y="2"
                        width="9"
                        height="9"
                        rx="2"
                        fill="currentColor"
                      />
                      <rect
                        opacity="0.3"
                        x="13"
                        y="13"
                        width="9"
                        height="9"
                        rx="2"
                        fill="currentColor"
                      />
                      <rect
                        opacity="0.3"
                        x="2"
                        y="13"
                        width="9"
                        height="9"
                        rx="2"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </span>
                <Link to="/dashboard" className="menu-title-link">
                  <span className="menu-title">{t('dashboard')}</span>
                </Link>
              </span>
            </div>

            <div className="menu-item pt-5">
              <div className="menu-content">
                <span className="menu-heading fw-bold text-uppercase fs-7">
                  {t('pages')}
                </span>
              </div>
            </div>

            {permissions.some(p =>
              p.name.includes('list User')
            ) ? (<div className="menu-item menu-accordion" data-kt-menu-trigger="click">
              <span className="menu-link">
                <span className="menu-icon">
                  <span className="svg-icon svg-icon-2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 14H18V10H20C20.6 10 21 10.4 21 11V13C21 13.6 20.6 14 20 14ZM21 19V17C21 16.4 20.6 16 20 16H18V20H20C20.6 20 21 19.6 21 19ZM21 7V5C21 4.4 20.6 4 20 4H18V8H20C20.6 8 21 7.6 21 7Z"
                        fill="currentColor"
                      />
                      <path
                        opacity="0.3"
                        d="M17 22H3C2.4 22 2 21.6 2 21V3C2 2.4 2.4 2 3 2H17C17.6 2 18 2.4 18 3V21C18 21.6 17.6 22 17 22ZM10 7C8.9 7 8 7.9 8 9C8 10.1 8.9 11 10 11C11.1 11 12 10.1 12 9C12 7.9 11.1 7 10 7ZM13.3 16C14 16 14.5 15.3 14.3 14.7C13.7 13.2 12 12 10.1 12C8.1 12 6.5 13.1 5.9 14.7C5.6 15.3 6.2 16 7.4 16H13.3Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </span>
                <span className="menu-title">{t('usermanagement')}</span>
                <span className="menu-arrow"></span>
              </span>

              <div className="menu-sub menu-sub-accordion">
                <div className="menu-item">
                  <Link to="/usermanagement" className="menu-link">
                    <span className="menu-title">{t('users')}</span>
                  </Link>
                </div>

                <div className="menu-item">
                  <Link to="/roles" className="menu-link">
                    <span className="menu-title">{t('roles')}</span>
                  </Link>
                </div>

                <div className="menu-item">
                  <Link to="/permissions" className="menu-link">
                    <span className="menu-title">{t('permissions')}</span>
                  </Link>
                </div>
              </div>
            </div>) : null}

            {permissions.some(p =>
              p.name.includes('list Employee')
            ) ? (<div className="menu-item">
              <Link to="/employeemanagement" className="menu-link">
                <span className="menu-icon">
                  <span className="svg-icon svg-icon-2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 14H18V10H20C20.6 10 21 10.4 21 11V13C21 13.6 20.6 14 20 14ZM21 19V17C21 16.4 20.6 16 20 16H18V20H20C20.6 20 21 19.6 21 19ZM21 7V5C21 4.4 20.6 4 20 4H18V8H20C20.6 8 21 7.6 21 7Z"
                        fill="currentColor"
                      />
                      <path
                        opacity="0.3"
                        d="M17 22H3C2.4 22 2 21.6 2 21V3C2 2.4 2.4 2 3 2H17C17.6 2 18 2.4 18 3V21C18 21.6 17.6 22 17 22ZM10 7C8.9 7 8 7.9 8 9C8 10.1 8.9 11 10 11C11.1 11 12 10.1 12 9C12 7.9 11.1 7 10 7ZM13.3 16C14 16 14.5 15.3 14.3 14.7C13.7 13.2 12 12 10.1 12C8.10001 12 6.49999 13.1 5.89999 14.7C5.59999 15.3 6.19999 16 7.39999 16H13.3Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </span>
                <span className="menu-title">{t('employeemanagement')}</span>
              </Link>
            </div>) : null}

            <div
              data-kt-menu-trigger="click"
              className="menu-item menu-accordion"
            >
              <span className="menu-link">
                <span className="menu-icon">
                  <span className="svg-icon svg-icon-2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 14H18V10H20C20.6 10 21 10.4 21 11V13C21 13.6 20.6 14 20 14ZM21 19V17C21 16.4 20.6 16 20 16H18V20H20C20.6 20 21 19.6 21 19ZM21 7V5C21 4.4 20.6 4 20 4H18V8H20C20.6 8 21 7.6 21 7Z"
                        fill="currentColor"
                      />
                      <path
                        opacity="0.3"
                        d="M17 22H3C2.4 22 2 21.6 2 21V3C2 2.4 2.4 2 3 2H17C17.6 2 18 2.4 18 3V21C18 21.6 17.6 22 17 22ZM10 7C8.9 7 8 7.9 8 9C8 10.1 8.9 11 10 11C11.1 11 12 10.1 12 9C12 7.9 11.1 7 10 7ZM13.3 16C14 16 14.5 15.3 14.3 14.7C13.7 13.2 12 12 10.1 12C8.10001 12 6.49999 13.1 5.89999 14.7C5.59999 15.3 6.19999 16 7.39999 16H13.3Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </span>
                <span className="menu-title">{t('dynamicsettings')}</span>
                <span className="menu-arrow"></span>
              </span>

              <div className="menu-sub menu-sub-accordion">
                {permissions.some(p =>
                  p.name.includes('list IdentityCardTemplate') || p.name.includes('IdentityCardDetail') || p.name.includes('IdentityCardTemplateDetail')
                ) ? (<div className="menu-item">
                  <Link className="menu-link" to="/iddetails">
                    <span className="menu-title">{t('templatedetails')}</span>
                  </Link>
                </div>) : null}

                {permissions.some(p => p.name.includes('list Organization')) ?
                  (<div className="menu-item">
                    <Link className="menu-link" to="/dynamicdetails">
                      <span className="menu-title">
                        {t('organizationinformation')}
                      </span>
                    </Link>
                  </div>) : null}

                {permissions.some(p => p.name.includes('list OrganizationUnit')) ? (<div className="menu-item">
                  <Link className="menu-link" to="/organization-unit">
                    <span className="menu-title"> {t('organizationunits')}</span>
                  </Link>
                </div>) : null}

                {permissions.some(p => p.name.includes('list JobTitleCategory')) ? (<div className="menu-item">
                  <Link className="menu-link" to="/job-title-category">
                    <span className="menu-title"> {t('jobtitlecategories')}</span>
                  </Link>
                </div>) : null}

                {permissions.some(p => p.name.includes('list JobPosition')) ? (<div className="menu-item">
                  <Link className="menu-link" to="/job-position">
                    <span className="menu-title"> {t('jobpositions')}</span>
                  </Link>
                </div>) : null}

                {permissions.some(p => p.name.includes('list MaritalStatus')) ? (<div className="menu-item">
                  <Link className="menu-link" to="/maritalstatusmanagement">
                    <span className="menu-title"> {t('maritalstatuses')}</span>
                  </Link>
                </div>) : null}

                {permissions.some(p => p.name.includes('list Region')) ? (<div className="menu-item">
                  <Link className="menu-link" to="/regionmanagement">
                    <span className="menu-title">{t('regions')}</span>
                  </Link>
                </div>) : null}

                {permissions.some(p => p.name.includes('list Zone')) ? (<div className="menu-item">
                  <Link className="menu-link" to="/zonemanagement">
                    <span className="menu-title">{t('zones')}</span>
                  </Link>
                </div>) : null}

                {permissions.some(p => p.name.includes('list Woreda')) ? (<div className="menu-item">
                  <Link className="menu-link" to="/woredamanagement">
                    <span className="menu-title">{t('woredas')}</span>
                  </Link>
                </div>) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}