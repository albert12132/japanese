
class Card {
  constructor(
      cardId,
      kanji,
      hiragana,
      meaning,
      tags,
      successes) {
    this.cardId = cardId;
    this.kanji = kanji;
    this.hiragana = hiragana;
    this.meaning = meaning;
    this.tags = tags;
    this.successes = successes;
  }

  static fromJson(cardJson) {
    return new Card(
      cardJson.card_id,
      cardJson.kanji,
      cardJson.hiragana,
      cardJson.meaning,
      cardJson.tags,
      cardJson.successes
    );
  }
}

modules.export.Card = Card;
