/*jslint unparam: true*/

var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var PrettySlack = require('pretty-slack').PrettySlack;

var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var slack = new PrettySlack(config.slackToken);

app.get('/', function (req, res) {
  res.send('Hello world!');
});

app.post('/anon', function (req, res) {
  var token = req.body.token;

  if (!token || token !== config.slackPostToken) {
    res.status(401).send('Unauthorized');
    return;
  }

  console.log('received POST request to /anon');

  var message = req.body.text;

  if (!message) {
    console.log('something went wrong....message has no text');
    res.status(500).send('Cannot send empty message');
    return;
  }

  slack.chat('#anonybot', message, {}, function (err) {
    if (err) {
      console.log(err.name + ': ' + err.message);
      res.status(500).send('Internal Error');
      return;
    }
    console.log('successfully sent message');
    res.status(200).send('OK');
  });

});

app.listen(process.env.PORT || 3001);
console.log('Starting anonybot on port 3001...');
