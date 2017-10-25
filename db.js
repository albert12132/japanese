const uuid = require('uuid/v4');
const { Pool } = require('pg');

class PostGresDatabase {
  constructor() {
    if (process.env.DATABASE_URL) {
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
      });
    } else {
      this.pool = new Pool();
    }
    this.pool.on('error', (err, client) => {
      console.error('Unexpected error on idle PostGres client', err);
    });
  }

  insertCard(card, success, failure) {
    if (!card.kanji) {
      failure('Invalid card: missing kanji field');
    } else if (!card.hiragana) {
      failure('Invalid card: missing hiragana field');
    } else if (!card.meaning) {
      failure('Invalid card: missing meaning field');
    }

    this.pool.connect((err, client, done) => {
      if (err) {
        failure(err);
        return;
      }

      const cardId = uuid();
      client.query(
        'INSERT INTO Cards VALUES ($1, $2, $3, $4, $5)',
        [cardId, card.kanji, card.hiragana, card.meaning, card.tags || []],
        (err) => {
          done();
          if (err) {
            failure(err);
          } else {
            success(cardId);
          }
        });
    });
  }

  updateCard(card, success, failure) {
    if (!card.card_id) {
      failure('Invalid card: missing card_id field');
    } else if (!card.kanji) {
      failure('Invalid card: missing kanji field');
    } else if (!card.hiragana) {
      failure('Invalid card: missing hiragana field');
    } else if (!card.meaning) {
      failure('Invalid card: missing meaning field');
    }

    this.pool.connect((err, client, done) => {
      if (err) {
        failure(err);
        return;
      }

      let query;
      let values;
      if (card.tags) {
        query = 'UPDATE Cards SET kanji = $2, hiragana = $3, meaning = $4, tags = $5 WHERE card_id = $1';
        values = [card.card_id, card.kanji, card.hiragana, card.meaning, card.tags];
      } else {
        query = 'UPDATE Cards SET kanji = $2, hiragana = $3, meaning = $4 WHERE card_id = $1';
        values = [card.card_id, card.kanji, card.hiragana, card.meaning];
      }
      client.query(
        query,
        values,
        (err) => {
          done();
          if (err) {
            failure(err);
          } else {
            success();
          }
        });
    });
  }

  deleteCard(cardId, success, failure) {
    this.pool.connect((err, client, done) => {
      if (err) {
        failure(err);
        return;
      }

      client.query(
        'DELETE FROM Cards WHERE card_id = $1',
        [cardId],
        (err) => {
          done();
          if (err) {
            failure(err);
          } else {
            success();
          }
        });
    });
  }

  listCards(success, failure) {
    this.pool.connect((err, client, done) => {
      if (err) {
        failure(err);
        return;
      }

      const cardId = uuid();
      client.query(
        'select * from Cards',
        (err, res) => {
          done();
          if (err) {
            failure(err);
          } else {
            success(res.rows);
          }
        });
    });
  }
}

class InMemoryDatabase {
  constructor() {
    this.cards = {};
    this.groups = {};
  }

  insertCard(contents, success) {
    const cardId = uuid();
    contents.cardId = cardId;
    this.cards[cardId] = contents;
    callback(cardId);
  }

  deleteCard(cardId, success) {
    delete this.cards.cardId;
    success();
  }

  listCards(success) {
    const cards = [];
    for (let card in this.cards) {
      if (this.cards.hasOwnProperty(card)) {
        cards.push(this.cards[card]);
      }
    }
    callback(cards);
  }
}

module.exports.Database = PostGresDatabase;
