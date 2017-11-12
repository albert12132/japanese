import $ from 'jquery';

export default class AppClient {
  constructor() {
    this.phrase = '';
  }

  verifyLogin(phrase, success, failure) {
    $.post('/api/login', {
      phrase: phrase
    }, () => {
      this.phrase = phrase;
      success();
    })
    .fail(failure);
  }

  loadCards(success) {
    $.post('/api/cards/list', {
      phrase: this.phrase
    }, (response) => {
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
      phrase: this.phrase,
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
      phrase: this.phrase,
    }, () => {
      success();
    });
  }

  updateCardSuccesses(card_id, successes) {
    $.post('/api/cards/update/successes', {
      card_id: card_id,
      successes: JSON.stringify(successes),
      phrase: this.phrase,
    });
  }

  deleteCard(card_id, success) {
    $.post('/api/cards/delete', {
      card_id: card_id,
      phrase: this.phrase,
    }, success);
  }
}
