const express = require('express');
const http = require('http');
const cookieSession = require('cookie-session');
const GoogleAuth = require('google-auth-library');
const dao = require('./db.js');

const app = express();

const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET || '';
const CLIENT_ID = '758984664053-vfv9uik68cssqfn0s7m6sc60t8u0fon0.apps.googleusercontent.com';

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.static(__dirname + '/static'));

app.use(cookieSession({
  name: 'session',
  keys: [SECRET],
}))

const db = new dao.Database();

const isUserWhitelisted = (userId) => {
  if (process.env.USER_WHITELIST) {
    return process.env.USER_WHITELIST.split(',').includes(userId);
  } else {
    return true;
  }
}

app.all('/api/\*', function(req, res, next) {
  if (isUserWhitelisted(req.session.userId)) {
    next();
  } else {
    res.status(403).send('Unauthorized');
  }
});

app.post('/login', function(req, res) {
  const auth = new GoogleAuth;
  const client = new auth.OAuth2(CLIENT_ID, '', '');
  client.verifyIdToken(
      req.body.token,
      CLIENT_ID,
      (err, login) => {
        const payload = login.getPayload();
        const userId = payload['sub'];
        if (isUserWhitelisted(userId)) {
          req.session.userId = userId;
          res.status(200).end();
        } else {
          res.status(403).end();
        }
      });
});

/* Card resource */

// Create card
app.post('/api/cards/create', function(req, res) {
  db.insertCard(req.body.card, (cardId) => {
    res.json({card_id: cardId});
  }, (err) => {
    res.status(400).send(err);
  });
});

// Update card
app.post('/api/cards/update', function(req, res) {
  db.updateCard(req.body.card, () => {
    res.end();
  }, (err) => {
    res.status(400).send(err);
  });
});


// Delete card
app.post('/api/cards/delete', function(req, res) {
  db.deleteCard(req.body.card_id, () => {
    res.status(200).end();
  }, (err) => {
    res.status(400).send(err);
  });
});

// List all cards
app.get('/api/cards', function(req, res) {
  db.listCards((cards) => {
    res.json({cards: cards});
  }, (err) => {
    res.status(400).send(err);
  });
});

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});

