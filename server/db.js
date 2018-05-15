const uuid = require('uuid/v4');
const { Pool } = require('pg');

const PAGE_SIZE = 100;

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
    this.pool.connect((err, client, done) => {
      if (err) {
        failure(err);
        return;
      }

      const cardId = uuid();

      const query = 'insert into Cards(card_id, data, last_modified) values($1, $2, $3)';
      const values = [cardId, card, Date.now()];
      client.query(
        query,
        values,
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

  updateCards(cards, success, failure) {
    this.pool.connect((err, client, done) => {
      if (err) {
        failure(err);
        return;
      }

      this._updateCard(client, cards, 0)
        .then(() => {
          client.end();
          success();
        })
        .catch(e => {
          client.end();
          failure(e);
        });
    });
  }

  _updateCard(client, cards, i) {
    if (i >= cards.length) {
      return Promise.resolve();
    }

    const card = cards[i];
    const query = 'update Cards set'
      + ' data = $1,'
      + ' last_modified = $2'
      + ' where card_id = $3'
      + ';';
    const values = [card.card, Date.now(), card.cardId];

    return client.query(query, values)
      .then(() => this._updateCard(client, cards, i + 1));
  }


  deleteCard(cardId, success, failure) {
    this.pool.connect((err, client, done) => {
      if (err) {
        failure(err);
        return;
      }

      client.query(
        'delete from Cards where card_id = $1',
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

  listCards(token, modifiedAfter, success, failure) {
    this.pool.connect((err, client, done) => {
      if (err) {
        failure(err);
        return;
      }

      let query;
      let values;
      if (token) {
        query = 'select * from Cards'
          + ' where last_modified > $2 or (card_id > $1 and last_modified = $2)'
          + ' order by last_modified, card_id'
          + ` limit ${PAGE_SIZE}`;
        values = [this._getIdFromToken(token), this._getLastModifiedFromToken(token)];
      } else {
        values = [];
        query = 'select * from Cards';
        if (modifiedAfter) {
          query += ' where last_modified > $1';
          values.push(modifiedAfter);
        }
        query += ' order by last_modified, card_id'
          + ` limit ${PAGE_SIZE}`;
      }

      client.query(
        query,
        values,
        (err, res) => {
          done();
          if (err) {
            failure(err);
          } else {
            let cards = [];
            let nextToken;
            if (res.rows.length < PAGE_SIZE) {
              nextToken = null;
            } else {
              nextToken = this._getToken(res.rows[res.rows.length - 1]);
            }

            // During migration, data may or may not be populated. Convert both cases into the same
            // result.
            for (let row of res.rows) {
              let newCard = {
                cardId: row.card_id,
              };
              if (row.data) {
                newCard.card = row.data;
              } else {
                // TODO: remove this once migration is done.
                delete row.card_id;
                delete row.data;
                delete row.last_modified;
                newCard.card = row;
              }
              cards.push(newCard);
            }
            success(cards, nextToken);
          }
        });
    });
  }

  _getIdFromToken(token) {
    return token.split('_')[0];
  }

  _getLastModifiedFromToken(token) {
    return token.split('_')[1];
  }

  _getToken(row) {
    if (row) {
      return row.card_id + '_' + row.last_modified;
    }
    return null;
  }
}

module.exports.Database = PostGresDatabase;
