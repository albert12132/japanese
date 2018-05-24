import { combineReducers } from 'redux-immutable';
import cards from './cards.js';
import filteredTags from './filteredTags.js';
import isOnline from './isOnline.js';
import isRefreshing from './isRefreshing.js';
import lastRefreshed from './lastRefreshed.js';
import modalCardId from './modalCardId.js';
import quizEnabled from './quizEnabled.js';
import quizType from './quizType.js';
import showModal from './showModal.js';
import tags from './tags.js';
import showSavingAlert from './showSavingAlert.js';

const rootReducer = combineReducers({
  cards,
  filteredTags,
  isOnline,
  isRefreshing,
  lastRefreshed,
  modalCardId,
  quizEnabled,
  quizType,
  showModal,
  tags,
  showSavingAlert,
});

export default rootReducer;
