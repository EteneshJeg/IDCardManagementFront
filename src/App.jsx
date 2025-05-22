import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route,Routes } from 'react-router-dom'
import UserManagement from './pages/usermanagement'
import EmployeeManagement from './pages/employeemanagement'
import IdManagement from './pages/idmanagement'
import IdDetails from './pages/iddetails'
import Login from './pages/login'
import DynamicDetails from './pages/dynamicdetails'
import EmployeeDashboard from './pages/employeedashboard'
import HrDashboard from './pages/hrdashboard'
import ItStaffDashboard from './pages/itstaffdashboard'
import OrganizationUnit from './pages/OrganizationUnit';
import JobTitleCategories from './pages/JobTitleCategories';
import JobPositions from './pages/JobPositions';
import Salary from './pages/SalaryManagement';
import MaritalStatus from './pages/MaritalStatusManagement';
import Region from './pages/RegionManagement';
import Zone from './pages/ZoneManagement';
import Woreda from './pages/WoredaManagement';




function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/usermanagement" element={<UserManagement/>}/>
        <Route path="/employeemanagement" element={<EmployeeManagement/>}/>
        <Route path="/idmanagement" element={<IdManagement/>}/>
        <Route path="/iddetails" element={<IdDetails/>}/>
        <Route path="/dynamicdetails" element={<DynamicDetails/>}/>
        <Route path="/home/employeedashboard" element={<EmployeeDashboard/>}/>
        <Route path="/home/hrdashboard" element={<HrDashboard/>}/>
        <Route path="/home/itstaffdashboard" element={<ItStaffDashboard/>}/>
        <Route path="/job-title-category" element={<JobTitleCategories />}/>
        <Route path="/job-position" element={<JobPositions />}/>
        <Route path="/organization-unit" element={<OrganizationUnit />}/>
        <Route path="/salarymanagement" element={<Salary/>}/>
        <Route path="/maritalstatusmanagement" element={<MaritalStatus/>}/>
        <Route path="/regionmanagement" element={<Region/>}/>
        <Route path="/zonemanagement" element={<Zone/>}/>
        <Route path="/woredamanagement" element={<Woreda/>}/>
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
