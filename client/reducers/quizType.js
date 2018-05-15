import {
  UPDATE_QUIZ_TYPE,
} from '../actions/ui.js'
import QUIZ_TYPES from '../quizTypes.js';

export default function quizType(state = QUIZ_TYPES[0], action) {
  switch (action.type) {
    case UPDATE_QUIZ_TYPE:
      return action.quizType;
    default:
      return state;
  }
}
