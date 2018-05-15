import { OrderedMap } from 'immutable';
import {
  CREATE_CARD,
  UPDATE_CARDS,
  DELETE_CARD,
  RECEIVE_CARD_PAGE,
} from '../actions/data.js'

export default function cards(state = OrderedMap(), action) {
  switch (action.type) {
    case CREATE_CARD:
      return state.set(action.cardId, action.card);
    case UPDATE_CARDS:
      return state.merge(action.cards);
    case DELETE_CARD:
      return state.delete(action.cardId);
    case RECEIVE_CARD_PAGE:
      return state.merge(action.cards);
    default:
      return state;
  }
}
