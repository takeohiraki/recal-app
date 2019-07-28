var express = require("express");
var router_slack = express.Router();
var passport = require('passport');

// Import the model to use its database functions.
const models = require('../models');
const slackMessages = models.slack_message;
//var model_slack = require("../models/model_slack.js");

const scopes = ['identity.basic', 'identity.email', 'identity.avatar', 'identity.team'];

// path to start the OAuth flow
router_slack.get('/auth/slack', passport.authorize('slack', {
  scope: scopes
}));

// OAuth callback url
router_slack.get('/auth/slack/callback',
  passport.authorize('slack', {
    failureRedirect: '/slack-session'
  }),
  (req, res) => {
    // console.log(req.account.token);
    req.session.slack_token = req.account.token;
    res.redirect('/slack-session');
  }
);

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

router_slack.get('/slack/seed', (req, res) => {

  slackMessages.create({
    message_text: 'Complete MaintMax Design',
    user_name: 'Patrice',
    command: '/Agenda',
    slack_user_id: getRandomInt(1111111, 99999999)
  });

  slackMessages.create({
    message_text: 'Complete Testing',
    user_name: 'Amanda',
    command: '/Agenda',
    slack_user_id: getRandomInt(1111111, 99999999)
  });

  slackMessages.create({
    message_text: 'Complete Data Capture',
    user_name: 'Darren',
    command: '/Agenda',
    slack_user_id: getRandomInt(1111111, 99999999)
  });

  slackMessages.create({
    message_text: 'Go Live/Launch',
    user_name: 'Darren',
    command: '/Agenda',
    slack_user_id: getRandomInt(1111111, 99999999)
  });

  slackMessages.create({
    message_text: 'Verify Functionality on Maintenance Servers',
     user_name: 'Johny',
    command: '/Agenda',
    slack_user_id: getRandomInt(1111111, 99999999)
  });

  slackMessages.create({
    message_text: 'Operational Acceptance',
    user_name: 'Darren',
    command: '/Agenda',
    slack_user_id: getRandomInt(1111111, 99999999)
  });

  res.status(200).redirect('/home');

});


// provides status of the token
router_slack.get('/slack-session', (req, res) => {
  if (req.session.slack_token) {
    res.cookie('slack-token', req.session.slack_token);
    res.json({
      status: 'session cookie set (' + req.session.slack_token + ")"
    });
  } else {
    res.cookie('slack-token', '')
    res.json({
      status: 'session cookie not set.'
    });
  }
});

router_slack.get("/api/messages", function (req, res) {
  // pulls in all messages
  slackMessages.findAll({
    order: [
      ['createdAt', 'DESC']
    ]
  }).then(slackMessages => {
    res.status(200).send(slackMessages);
  });

});

// Basic route that sends the user first to the AJAX Page
router_slack.post("/api/slack/add-agenda", function (req, res) {
  // console.log("agenda attempted")
  var newData = req.body;
  const {
    text,
    command,
    user_name,
    user_id
  } = req.body

  slackMessages.create({
      message_text: newData.text,
      command: newData.command,
      user_name: newData.user_name,
      slack_user_id: newData.user_id
    })
    .then((newSlackMessage) => {
      res.status(201).json(newSlackMessage)
    })
    .catch((err) => {
      console.log("Error while creating slack message : ", err)
    });

  /*model_slack.createPg([
    "message_text", "command", "user_name", "slack_user_id"
  ], [
    newData.text, newData.command, newData.user_name, newData.user_id
  ], function (result) {
    res.status(201).send('item added!')
  });*/

});

// Basic route that sends the user first to the AJAX Page
router_slack.delete("/api/slack/delete-agenda", function (req, res) {

  slackMessages.destroy({
    where: {
      id: req.body.id
    }
  }).then(function (affectedRows) {
    res.sendStatus(200).send(affectedRows);
  });
});

// Export routes for server.js to use.
module.exports = router_slack;