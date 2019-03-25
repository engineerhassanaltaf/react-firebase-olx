import { combineReducers } from 'redux';
import userReducer from './reducers/userReducer';
import adReducer from './reducers/adReducer';

export default combineReducers({
  userReducer,
  adReducer
})