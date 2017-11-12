const express = require('express');
const http = require('http');
const path = require('path');
const dao = require('./db.js');

const app = express();

const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET || '';

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.static(__dirname + '/static'));

const db = new dao.Database();

app.all('/api/\*', function(req, res, next) {
  if (req.body.phrase !== SECRET) {
    res.status(403).send('Unauthorized');
  } else {
    next();
  }
});

app.post('/api/login', function(req, res) {
  res.status(200).end();
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

// Update card successes
app.post('/api/cards/update/successes', function(req, res) {
  db.updateCardSuccesses(req.body.card_id, JSON.parse(req.body.successes), () => {
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
app.post('/api/cards/list', function(req, res) {
  db.listCards((cards) => {
    res.json({cards: cards});
  }, (err) => {
    res.status(400).send(err);
  });
});

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});

