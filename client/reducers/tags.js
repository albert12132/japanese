import { Set } from 'immutable';
import {
  CREATE_CARD,
  UPDATE_CARDS,
  RECEIVE_CARD_PAGE,
} from '../actions/data.js'

export default function tags(state = Set(), action) {
  switch (action.type) {
    case CREATE_CARD:
      return state.union(action.card.get('tags'));
    case UPDATE_CARDS:
      for (let card of action.cards.values()) {
        state = state.union(card.get('tags'));
      }
      return state;
    case RECEIVE_CARD_PAGE:
      for (let card of action.cards.values()) {
        state = state.union(card.get('tags'));
      }
      return state;
    default:
      return state;
  }
}
