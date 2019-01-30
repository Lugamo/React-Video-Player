import { createActions, createReducer } from 'reduxsauce';
import light from '../../styles/themes/light';
import dark from '../../styles/themes/dark';

/* -------------------- Initial State --------------*/
const initialState = {
  // True for light theme and False for Dark
  Theme: light,
};

/* -------------------- Actions Creators -----------*/
const { Types, Creators } = createActions({
  changeTheme: ['boolValue'],
});

/* -------------------- Reducer --------------------*/
export const reducer = createReducer(initialState, {
  [Types.CHANGE_THEME]: (state, action) => ({
    ...state,
    Theme: (action.boolValue ? light : dark),
  }),
});

export default Creators;
