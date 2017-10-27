import $ from 'jquery';

export default class AppClient {
  constructor() {
    this.phrase = '';
  }

  verifyLogin(token, success, failure) {
    $.post('/login', {
      token: token
    }, success)
    .fail(failure);
  }

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
    $.post('/api/cards/create', {
      card: {
        kanji: card.kanji,
        hiragana: card.hiragana,
        meaning: card.meaning,
        tags: card.tags,
      },
    }, (response) => {
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

  updateCard(card, success) {
    $.post('/api/cards/update', {
      card: card,
    }, success);
  }

  deleteCard(card_id, success) {
    $.post('/api/cards/delete', {
      card_id: card_id,
    }, success);
  }
}
