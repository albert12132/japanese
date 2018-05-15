import { Set } from 'immutable';
import {
  SET_FILTERED_TAGS,
} from '../actions/ui.js'

export default function filteredTags(state = Set(), action) {
  switch (action.type) {
    case SET_FILTERED_TAGS:
      return action.filteredTags;
    default:
      return state;
  }
}
