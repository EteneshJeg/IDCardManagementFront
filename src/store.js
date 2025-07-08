import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice'
import profileReducer from './features/profileSlice'
import idReducer from './features/idCardSlice'
import organizationReducer from './features/organizationSlice';
import jobTitleCategoryReducer from './features/jobTitleCategorySlice';
import jobPositionsReducer from './features/jobPositionSlice';
import organizationUnitReducer from "./features/organizationUnitSlice";
import regionReducer from './features/regionSlice';
import zoneReducer from './features/zoneSlice'
import woredaReducer from './features/woredaSlice'
import maritalStatusReducer from './features/maritalStatusSlice'
import roleReducer from './features/roleSlice'
import permissionReducer from './features/permissionSlice'; // Add this line


const store = configureStore({
  reducer: {
    user:userReducer,
    profile:profileReducer,
    idCard:idReducer,
    organization:organizationReducer,
    jobTitleCategory: jobTitleCategoryReducer,
    jobPositions: jobPositionsReducer,
    organizationUnits: organizationUnitReducer,
    region:regionReducer,
    zone:zoneReducer,
    woreda:woredaReducer,
    maritalStatus:maritalStatusReducer,
    roles:roleReducer,
    permissions: permissionReducer
    



  },
});

export default store;
