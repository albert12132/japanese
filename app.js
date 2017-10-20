const express = require('express');
const http = require('http');
const path = require('path');
const GoogleAuth = require('google-auth-library');
const dao = require('./db.js');

const CLIENT_ID = "758984664053-vfv9uik68cssqfn0s7m6sc60t8u0fon0.apps.googleusercontent.com";

const auth = new GoogleAuth;
const client = new auth.OAuth2(CLIENT_ID, '', '');

const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.static('static'));

const db = new dao.Database();

app.post('/api/login', function(req, res) {
  const token = req.body.token;
  client.verifyIdToken(
      token,
      CLIENT_ID,
      function(e, login) {
        var payload = login.getPayload();
        var userid = payload['sub'];
        console.log(userid);
      });
});

/* Card resource */

// Create card
app.post('/api/cards', function(req, res) {
  db.insertCard(req.body, (cardId) => {
    res.json({card_id: cardId});
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

