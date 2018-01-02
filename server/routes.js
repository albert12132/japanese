
function isAuthorized(token) {
  if (!process.env.WHITELIST) {
    return true;
  }
  return process.env.WHITELIST.split(',').includes(token);
}

module.exports.addRoutes = (app, db) => {

  app.get('/', (req, res) => {
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
  app.post('/auth/login', (req, res) => {
    if (isAuthorized(req.body.token)) {
      req.session.token = req.body.token;
      res.status(200).end();
    } else {
      res.status(403).send('Unauthorized');
    }
  });

  app.get('/auth/logout', (req, res) => {
    req.session.token = null;
    res.status(200).end();
  });

  app.all('/api/\*', (req, res, next) => {
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
   * card: {
   *   kanji: string
   *   hiragana: string
   *   meaning: string
   *   tags (optional): [
   *     string
   *   ]
   * }
   *
   * - Response:
   * card_id: string
   */
  app.post('/api/cards', (req, res) => {
    db.insertCard(JSON.parse(req.body.card), (cardId) => {
      res.json({card_id: cardId});
    }, (err) => {
      res.status(400).send(err);
    });
  });

  /**
   * Update card.
   *
   * - Request:
   * card: {
   *   kanji (optional): string
   *   hiragana (optional): string
   *   meaning (optional): string
   *   tags (optional): [
   *     string
   *   ]
   *   successes (optional): {
   *     reading (optional): number
   *     listening (optional): number
   *     translating (optional): number
   *   }
   *   last_attempts: {
   *     reading (optional): number
   *     listening (optional): number
   *     translating (optional): number
   *   }
   * }
   */
  app.post('/api/cards/:cardId', (req, res) => {
    db.updateCard(req.params.cardId, JSON.parse(req.body.card), () => {
      res.end();
    }, (err) => {
      res.status(400).send(err);
    });
  });


  // Delete card
  app.delete('/api/cards/:cardId', (req, res) => {
    db.deleteCard(req.params.cardId, () => {
      res.status(200).end();
    }, (err) => {
      res.status(400).send(err);
    });
  });

  /**
   * List cards.
   *
   * - Response:
   * cards: [
   *   {
   *     card_id: string
   *     kanji: string
   *     hiragana: string
   *     meaning: string
   *     tags: [
   *       string
   *     ]
   *     successes: {
   *       reading (optional): number
   *       listening (optional): number
   *       translating (optional): number
   *     }
   *     last_attempts: {
   *       reading (optional): number
   *       listening (optional): number
   *       translating (optional): number
   *     }
   *   }
   * ]
   */
  app.get('/api/cards', (req, res) => {
    db.listCards((cards) => {
      res.json({cards: cards});
    }, (err) => {
      res.status(400).send(err);
    });
  });
}

