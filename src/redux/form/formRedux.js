import { createActions, createReducer } from 'reduxsauce';

/* -------------------- Initial State --------------*/
const initialState = {
  open: false,
  formType: 'create',
  name: '',
  id: null,
  duration: {
    min: 0,
    max: 52,
  },
  tags: ['animation', 'fantasy'],
};

/* -------------------- Actions Creators -----------*/
const { Types, Creators } = createActions({
  closeForm: null,
  openForm: ['action', 'clip'],
  clipDuration: ['min', 'max'],
  newTag: ['tag'],
  deleteTag: ['tag'],
  handleName: ['name'],
});

/* -------------------- Reducer --------------------*/
export const reducer = createReducer(initialState, {
  [Types.CLOSE_FORM]: state => ({
    ...state,
    open: false,
    formType: 'create',
    name: '',
    id: null,
    duration: {
      min: 0,
      max: 52,
    },
    tags: ['animation', 'fantasy'],
  }),
  [Types.OPEN_FORM]: (state, action) => {
    const { clip } = action;

    // If the form is open to edit, change the initial values
    if (action.action === 'edit') {
      return ({
        ...state,
        open: true,
        formType: 'edit',
        name: clip.title,
        id: clip.id,
        duration: {
          min: clip.start,
          max: clip.end,
        },
        tags: clip.tags,
        persist: clip.persist,
      });
    }

    return ({
      ...state,
      open: true,
    });
  },
  [Types.CLIP_DURATION]: (state, action) => ({
    ...state,
    duration: {
      min: action.min,
      max: action.max,
    },
  }),
  [Types.NEW_TAG]: (state, action) => {
    state.tags.push(action.tag);
    return ({
      ...state,
      tags: state.tags,
    });
  },
  [Types.DELETE_TAG]: (state, action) => {
    const { tag } = action;
    const chipToDelete = state.tags.indexOf(tag);
    state.tags.splice(chipToDelete, 1);
    return ({
      ...state,
      tags: state.tags,
    });
  },
  [Types.HANDLE_NAME]: (state, action) => ({
    ...state,
    name: action.name,
  }),
});

export default Creators;
