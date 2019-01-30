import { combineReducers } from 'redux';
import { reducer as playlistReducer } from './playlist/playlistRedux';
import { reducer as clipReducer } from './clip/clipRedux';
import { reducer as formReducer } from './form/formRedux';
import { reducer as themeReducer } from './theme/themeRedux';

const rootReducers = combineReducers({
  theme: themeReducer,
  playlist: playlistReducer,
  clip: clipReducer,
  form: formReducer,
});

export default rootReducers;
