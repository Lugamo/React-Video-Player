import { createActions, createReducer } from 'reduxsauce';

/* -------------------- Initial State --------------*/
const initialState = {
  list: [],
};

/* -------------------- Actions Creators -----------*/
const { Types, Creators } = createActions({
  newClip: ['clip'],
  editClip: ['clip'],
  addPersistClip: ['clip'],
  removePersistClip: ['clip'],
  removeClipFromPlaylist: ['id'],
  addClipToPlaylist: ['id'],
  deleteClip: ['id', 'persist'],
});

/* -------------------- Reducer --------------------*/
export const reducer = createReducer(initialState, {
  [Types.NEW_CLIP]: (state, action) => {
    state.list.push(action.clip);
    return ({
      ...state,
      list: state.list,
    });
  },
  [Types.EDIT_CLIP]: (state, action) => {
    const { clip } = action;
    const index = state.list.map(e => e.id).indexOf(clip.id);
    state.list[index] = { ...clip };

    // If the clip is in the sessionStorage, make the changes too
    if (clip.persist === true) {
      const sessionClips = JSON.parse(sessionStorage.getItem('persistClips'));
      const sessionIndex = sessionClips.map(e => e.id).indexOf(clip.id);
      sessionClips[sessionIndex] = {
        ...clip,
        persist: true,
        playlist: false,
      };
      sessionStorage.setItem('persistClips', JSON.stringify(sessionClips));
    }

    return ({
      ...state,
      list: state.list,
    });
  },
  [Types.ADD_PERSIST_CLIP]: (state, action) => {
    const { clip } = action;
    const index = state.list.map(e => e.id).indexOf(clip.id);
    let sessionClips = JSON.parse(sessionStorage.getItem('persistClips'));
    // if exist push the clip
    if (sessionClips) {
      sessionClips.push(action.clip);
    } else {
      sessionClips = [action.clip];
    }

    state.list[index] = {
      ...clip,
      persist: true,
    };

    clip.persist = true;

    // by default the sessionStorage clip not appear in playlist
    clip.playlist = false;
    sessionStorage.setItem('persistClips', JSON.stringify(sessionClips));
    return ({
      ...state,
      list: state.list,
    });
  },
  [Types.REMOVE_PERSIST_CLIP]: (state, action) => {
    const { clip } = action;
    const index = state.list.map(e => e.id).indexOf(clip.id);
    let sessionClips = JSON.parse(sessionStorage.getItem('persistClips'));
    sessionClips = sessionClips.filter(value => value.id !== clip.id);

    state.list[index] = {
      ...clip,
      persist: false,
    };

    sessionStorage.setItem('persistClips', JSON.stringify(sessionClips));
    return ({
      ...state,
      list: state.list,
    });
  },
  [Types.REMOVE_CLIP_FROM_PLAYLIST]: (state, action) => {
    // find the id change the playlist value
    for (let i = 0; i < state.list.length; i += 1) {
      if (state.list[i].id === action.id) {
        state.list[i].playlist = false;
        break;
      }
    }
    return ({
      ...state,
      list: state.list,
    });
  },
  [Types.ADD_CLIP_TO_PLAYLIST]: (state, action) => {
    for (let i = 0; i < state.list.length; i += 1) {
      if (state.list[i].id === action.id) {
        state.list[i].playlist = true;
        break;
      }
    }
    return ({
      ...state,
      list: state.list,
    });
  },
  [Types.DELETE_CLIP]: (state, action) => {
    const { id, persist } = action;

    // If clip is in sessionStorage delete it too
    if (persist === true) {
      let sessionClips = JSON.parse(sessionStorage.getItem('persistClips'));
      sessionClips = sessionClips.filter(value => value.id !== id);
      sessionStorage.setItem('persistClips', JSON.stringify(sessionClips));
    }

    return ({
      ...state,
      list: state.list.filter(value => value.id !== id),
    });
  },
});

export default Creators;
