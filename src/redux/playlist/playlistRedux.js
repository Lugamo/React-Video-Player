import uuid from 'uuid';
import { createActions, createReducer } from 'reduxsauce';
import url from '../../service/url';

/* -------------------- Initial State --------------*/
const initialState = {
  autoplay: false,
  repeat: false,
  now: 0,
  list: [
    {
      id: uuid(),
      type: 'video',
      title: 'Sintel - Trailer',
      src: url,
      start: 0, // seconds
      end: 52, // seconds
      duration: '00:00:00 - 00:00:52',
      thumbnail: false,
      tags: ['animation', 'fantasy'],
    },
  ],
};

/* -------------------- Actions Creators -----------*/
const { Types, Creators } = createActions({
  nextVideo: null,
  previousVideo: null,
  changeVideo: ['videoIndex'],
  removeVideo: ['id', 'lastItem'],
  autoPlay: null,
  repeatPlaylist: null,
  addToPlaylist: ['clipData'],
});

/* -------------------- Reducer --------------------*/
export const reducer = createReducer(initialState, {
  [Types.NEXT_VIDEO]: (state) => {
    // Check if the next video is the last one
    const next = (state.now + 1) > state.list.length - 1 ? state.now : state.now + 1;
    return ({
      ...state,
      now: next,
    });
  },
  [Types.PREVIOUS_VIDEO]: (state) => {
    // Check if the previous video is the first one
    const previous = (state.now - 1) < 0 ? state.now : state.now - 1;
    return ({
      ...state,
      now: previous,
    });
  },
  [Types.CHANGE_VIDEO]: (state, action) => ({
    ...state,
    now: action.videoIndex,
  }),
  [Types.REMOVE_VIDEO]: (state, action) => {
    // iF the removed video is before the one is playing,change the value of now
    if (action.lastItem === true) {
      return ({
        ...state,
        list: state.list.filter(value => value.id !== action.id),
        now: state.now - 1,
      });
    }
    return ({
      ...state,
      list: state.list.filter(value => value.id !== action.id),
    });
  },
  [Types.AUTO_PLAY]: state => ({
    ...state,
    autoplay: !state.autoplay,
  }),
  [Types.REPEAT_PLAYLIST]: state => ({
    ...state,
    repeat: !state.repeat,
  }),
  [Types.ADD_TO_PLAYLIST]: (state, action) => {
    state.list.push(action.clipData);
    return ({
      ...state,
      list: state.list,
    });
  },
});

export default Creators;
