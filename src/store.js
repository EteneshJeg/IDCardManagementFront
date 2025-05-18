import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice'
import profileReducer from './features/profileSlice'
import idReducer from './features/idCardSlice'
import organizationReducer from './features/organizationSlice';
import jobTitleCategoryReducer from './features/jobTitleCategorySlice';
import jobPositionsReducer from './features/jobPositionSlice';
import organizationUnitReducer from "./features/organizationUnitSlice";



const store = configureStore({
  reducer: {
    user:userReducer,
    profile:profileReducer,
    idCard:idReducer,
    organization:organizationReducer,
    jobTitleCategory: jobTitleCategoryReducer,
    jobPositions: jobPositionsReducer,
    organizationUnits: organizationUnitReducer



  },
});

export default store;
