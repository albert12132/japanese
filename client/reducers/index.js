import { combineReducers } from 'redux-immutable';
import cards from './cards.js';
import filteredTags from './filteredTags.js';
import lastUpdated from './lastUpdated.js';
import modalCardId from './modalCardId.js';
import quizEnabled from './quizEnabled.js';
import quizType from './quizType.js';
import showModal from './showModal.js';
import tags from './tags.js';

const rootReducer = combineReducers({
  cards,
  filteredTags,
  lastUpdated,
  modalCardId,
  quizEnabled,
  quizType,
  showModal,
  tags,
});

export default rootReducer;
