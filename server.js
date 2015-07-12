/*jslint unparam: true*/

var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var PrettySlack = require('pretty-slack');

var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var slack = new PrettySlack(config.slackToken);



app.get('/', function (req, res) {
  res.send('Hello world');
});

app.get('/confession', function (req, res) {
  res.send('You\'ve reached the Confession page');
});

app.post('/confession', function (req, res) {
  var token = req.body.token;
  if (!token || token !== config.slackPostToken) {
    res.status(401).send('Unauthorized');
    return;
  }

  console.log('received POST request to /confession');

  var message = req.body.text;

  if (!message) {
    console.log('something went wrong....message has no text');
  }

  slack.chat('#bot-test', message, {}, function (err, res) {
    if (err) {
      console.log(err.name + ': ' + err.message);
    } else {
      console.log('successfully sent message');
    }
  });

});
