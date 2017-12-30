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

  checkPresent(value, error) {
    if (!value) {
      failure(error);
    }
  }

  insertCard(card, success, failure) {
    this.checkPresent(card.kanji, 'Missing kanji');
    this.checkPresent(card.hiragana, 'Missing hiragana');
    this.checkPresent(card.meaning, 'Missing meaning');

    this.pool.connect((err, client, done) => {
      if (err) {
        failure(err);
        return;
      }

      const cardId = uuid();
      const fields = new Map();
      fields.set('card_id', cardId);
      fields.set('kanji', card.kanji);
      fields.set('hiragana', card.hiragana);
      fields.set('meaning', card.meaning);
      if (card.tags) {
        fields.set('tags', card.tags);
      }

      const schema = 'Cards(' + Array.from(fields.keys()).join(', ') + ')';
      const placeholders =
        'VALUES('
          + Array.from(fields.keys()).map((_, index) => '$' + (index + 1)).join(', ')
          + ')';
      client.query(
        'INSERT INTO ' + schema + ' ' + placeholders,
        Array.from(fields.values()),
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

  updateCard(cardId, card, success, failure) {
    this.checkPresent(cardId, 'Missing cardId');

    this.pool.connect((err, client, done) => {
      if (err) {
        failure(err);
        return;
      }

      const fields = new Map();
      if (card.kanji) {
        fields.set('kanji', card.kanji);
      }
      if (card.hiragana) {
        fields.set('hiragana', card.hiragana);
      }
      if (card.meaning) {
        fields.set('meaning', card.meaning);
      }
      if (card.tags) {
        fields.set('tags', card.tags);
      }
      if (card.successes) {
        fields.set('successes', card.successes);
      }

      const query =
        'UPDATE Cards SET '
          + Array.from(fields.keys()).map((key, index) => key + ' = $' + (index + 2)).join(', ')
          + ' WHERE card_id = $1';

      const values = Array.from(fields.values());
      values.unshift(cardId);

      client.query(
        query,
        values,
        (err) => {
          done();
          if (err) {
            console.log(err);
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

module.exports.Database = PostGresDatabase;
