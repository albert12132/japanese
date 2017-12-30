const express = require('express');

const app = express();
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.static(__dirname + '/static'));
app.set('view engine', 'pug');

const SECRET = process.env.SECRET || '';
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: [SECRET],
}));

const dao = require('./server/db.js');
const db = new dao.Database();

const routes = require('./server/routes.js');
routes.addRoutes(app, db);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});

