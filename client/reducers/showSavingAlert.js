import {
  TOGGLE_SAVING_ALERT,
} from '../actions/ui.js'

export default function showSavingAlert(state = false, action) {
  switch (action.type) {
    case TOGGLE_SAVING_ALERT:
      return action.show;
    default:
      return state;
  }
}
