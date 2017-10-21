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

  addNewCard(kanji, hiragana, meaning, success) {
    $.post('/api/cards/create', {
      kanji: kanji,
      hiragana: hiragana,
      meaning: meaning,
      phrase: this.phrase,
    }, (response) => {
      const card = {
        card_id: response.card_id,
        kanji: kanji,
        hiragana: hiragana,
        meaning: meaning,
      };
      success(card);
    });
  }

  deleteCard(card_id, success) {
    $.post('/api/cards/delete', {
      card_id: card_id,
      phrase: this.phrase,
    }, success);
  }
}
