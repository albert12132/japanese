import $ from 'jquery';
import {
  _requestCards,
  _receiveCardPage,
  _finishLoading,
  _createCard,
  _updateCards,
  _deleteCard,
} from './data.js'
import { fromJS, Map, Set } from 'immutable';

const JSON_MIME = 'application/json';

// List cards

export function loadCards(lastUpdated) {
  return dispatch => {
    dispatch(_requestCards());
    let endpoint = '/api/cards'
    if (lastUpdated) {
      endpoint += `?modified_after=${lastUpdated}`;
    }
    _listCardsRecursive(endpoint, dispatch)
      .catch(e => {
        console.log(e);
        dispatch(_finishLoading());
      });
  };
}

function _listCardsRecursive(endpoint, dispatch) {
  return $.get(endpoint)
    .done(response => {
      const pageEntries = [];
      for (let record of response.cards) {
        const immutableCard = Map({
          kanji: record.card.kanji,
          hiragana: record.card.hiragana,
          meaning: record.card.meaning,
          tags: Set(record.card.tags || []),
          successes: record.card.successes ? fromJS(record.card.successes) : Map(),
          lastAttempts: record.card.lastAttempts ? fromJS(record.card.lastAttempts) : Map(),
        });
        pageEntries.push([record.cardId, immutableCard]);
      }

      dispatch(_receiveCardPage(Map(pageEntries)));

      if (response.token) {
        _listCardsRecursive(response.token, dispatch);
      } else {
        dispatch(_finishLoading(Date.now()));
      }
    });
}

// Create card
export function createCard(card) {
  return dispatch => {
    return $.ajax(
      {
        method: "post",
        url: '/api/cards',
        contentType: JSON_MIME,
        data: JSON.stringify({
          card: card.toJS(),
        }),
      })
      .done(response => {
        dispatch(_createCard(response.cardId, card));
      });
  };
}

// Update card
export function updateCards(cards) {
  return dispatch => {
    const cardEntries = cards
      .entrySeq()
      .map(e => {
        return {cardId: e[0], card: e[1].toJS()};
      })
      .toJS();

    return $.ajax(
      {
        method: "put",
        url: '/api/cards',
        contentType: JSON_MIME,
        data: JSON.stringify({
          cards: cardEntries,
        }),
      })
      .done(response => {
        dispatch(_updateCards(cards));
      });
  };
}

// Delete card
export function deleteCard(cardId) {
  return dispatch => {
    return $.ajax(
      {
        method: "delete",
        url: `/api/cards/${cardId}`,
      })
      .done(response => {
        dispatch(_deleteCard(cardId));
      });
  };
}

