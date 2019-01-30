import { createStore } from 'redux';
import rootReducer from './indexReducers';

const initialState = {};

const store = createStore(
  rootReducer,
  initialState,
);

export {
  store,
};