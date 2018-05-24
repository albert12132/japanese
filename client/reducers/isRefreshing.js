import {
  REQUEST_CARDS,
  FINISH_LOADING,
} from '../actions/data.js'

export default function isRefreshing(state = false, action) {
  switch (action.type) {
    case REQUEST_CARDS:
      return true;
    case FINISH_LOADING:
      return false;
    default:
      return state;
  }
}
