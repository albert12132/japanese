import {
  TOGGLE_QUIZ,
} from '../actions/ui.js'

export default function quizEnabled(state = false, action) {
  switch (action.type) {
    case TOGGLE_QUIZ:
      return !state;
    default:
      return state;
  }
}
