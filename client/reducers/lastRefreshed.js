import {
  FINISH_LOADING,
} from '../actions/data.js'

export default function lastRefreshed(state = 0, action) {
  switch (action.type) {
    case FINISH_LOADING:
      return action.nowTimestamp || state;
    default:
      return state;
  }
}
