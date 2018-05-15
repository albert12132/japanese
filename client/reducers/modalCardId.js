import {
  SHOW_MODAL,
  HIDE_MODAL,
} from '../actions/ui.js'

export default function modalCardId(state = '', action) {
  switch (action.type) {
    case SHOW_MODAL:
      return action.cardId || '';
    case HIDE_MODAL:
      return '';
    default:
      return state;
  }
}
