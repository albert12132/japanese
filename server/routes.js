
function isAuthorized(token) {
  if (!process.env.WHITELIST) {
    return true;
  }
  return process.env.WHITELIST.split(',').includes(token);
}

module.exports.addRoutes = (app, db) => {

  app.get(
    '/',
    (req, res) => {
      if (!isAuthorized(req.session.token)) {
        res.render('page', { script: 'login.js' });
      } else {
        res.render('page', { script: 'app.js' });
      }
    });

  /********
   * Auth *
   ********/

  /**
   * token: string
   */
  app.post(
    '/auth/login',
    (req, res) => {
      if (isAuthorized(req.body.token)) {
        req.session.token = req.body.token;
        res.status(200).end();
      } else {
        res.status(403).send('Unauthorized');
      }
    });

  app.get(
    '/auth/logout',
    (req, res) => {
      req.session.token = null;
      res.status(200).end();
    });

  app.all(
    '/api/\*',
    (req, res, next) => {
      if (!isAuthorized(req.session.token)) {
        res.status(403).send('Unauthorized');
      } else {
        next();
      }
    });


  /*******
   * API *
   *******/

  /**
   * Create card.
   *
   * - Request:
   *   {
   *     card: object
   *   }
   *
   * - Response:
   *   {
   *     cardId: string
   *   }
   */
  app.post(
    '/api/cards',
    (req, res) => {
      db.insertCard(
        req.body.card,
        (cardId) => {
          res.json({cardId: cardId});
        },
        (err) => {
          res.status(400).send(err);
        });
    });

  /**
   * Batch update cards.
   *
   * - Request:
   *   cards: [
   *     {
   *       cardId: string
   *       card: object
   *     }
   *   ]
   */
  app.put(
    '/api/cards',
    (req, res) => {
      db.updateCards(
        req.body.cards,
        () => {
          res.end();
        },
        (err) => {
          res.status(400).send(err);
          console.log(err);
        });
    });


  /** Delete card */
  app.delete(
    '/api/cards/:cardId',
    (req, res) => {
      db.deleteCard(
        req.params.cardId,
        () => {
          res.status(200).end();
        }, (err) => {
          res.status(400).send(err);
        });
    });

  /**
   * List cards.
   *
   * - Response:
   *   {
   *     cards: [
   *       {
   *         cardId: string
   *         card: object
   *       }
   *     ]
   *     token: string
   *   }
   */
  app.get('/api/cards', (req, res) => {
    const token = req.query.token;
    const modifiedAfter = req.query.modified_after;
    db.listCards(
      token,
      modifiedAfter,
      (cards, nextToken) => {
        let data = {
          cards: cards,
        }
        if (nextToken) {
          data.token = '/api/cards?token=' + nextToken;
        }
        res.json(data);
      },
      (err) => {
        res.status(400).send(err);
      });
  });
}

