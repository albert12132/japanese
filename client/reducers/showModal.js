import {
  SHOW_MODAL,
  HIDE_MODAL,
} from '../actions/ui.js'

export default function showModal(state = false, action) {
  switch (action.type) {
    case SHOW_MODAL:
      return true;
    case HIDE_MODAL:
      return false;
    default:
      return state;
  }
}
