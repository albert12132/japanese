import $ from 'jquery';

export default class AppClient {
  loadCards(success) {
    $.get('/api/cards', (response) => {
      const cards = {}
      for (let card of response.cards) {
        cards[card.card_id] = card;
      }
      success(cards);
    });
  }

  addNewCard(card, success) {
    $.post('/api/cards', {
      card: JSON.stringify(card),
    }, (response) => {
      // TODO: create Card abstraction
      const newCard = {
        card_id: response.card_id,
        kanji: card.kanji,
        hiragana: card.hiragana,
        meaning: card.meaning,
        tags: card.tags
      };
      success(newCard);
    });
  }

  updateCard(cardId, card, success) {
    $.post('/api/cards/' + cardId, {
      card: JSON.stringify(card),
    }, () => {
      success();
    });
  }

  deleteCard(cardId, success) {
    $.ajax('/api/cards/' + cardId, {
      method: 'delete',
      success: success,
    });
  }
}
