import {
  NOTIFY_CONNECTION,
} from '../actions/ui.js'

export default function isOnline(state = true, action) {
  switch (action.type) {
    case NOTIFY_CONNECTION:
      return action.isOnline
    default:
      return state;
  }
}
