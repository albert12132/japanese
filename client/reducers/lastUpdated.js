import {
  REQUEST_CARDS,
} from '../actions/data.js'

export default function lastUpdated(state = 0, action) {
  switch (action.type) {
    case REQUEST_CARDS:
      return action.nowTimestamp;
    default:
      return state;
  }
}
