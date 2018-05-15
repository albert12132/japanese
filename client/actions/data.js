
export const REQUEST_CARDS = 'REQUEST_CARDS';
export function _requestCards(nowTimestamp) {
  return {
    type: REQUEST_CARDS,
    nowTimestamp,
  };
}

export const RECEIVE_CARD_PAGE = 'RECEIVE_CARD_PAGE';
// cards: Map of cardId -> card
export function _receiveCardPage(cards) {
  return {
    type: RECEIVE_CARD_PAGE,
    cards
  }
}

export const CREATE_CARD = 'CREATE_CARD';
export function _createCard(cardId, card) {
  return {
    type: CREATE_CARD,
    cardId,
    card,
  };
}

export const UPDATE_CARDS = 'UPDATE_CARDS';
// cards: Map of cardId -> card
export function _updateCards(cards) {
  return {
    type: UPDATE_CARDS,
    cards,
  };
}

export const DELETE_CARD = 'DELETE_CARD';
export function _deleteCard(cardId) {
  return {
    type: DELETE_CARD,
    cardId,
  }
}
