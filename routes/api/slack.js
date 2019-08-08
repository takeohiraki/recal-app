var express = require("express");
var router_slack = express.Router();
var passport = require('passport');

// Import the model to use its database functions.
const models = require('../models');
const notes = models.notes;
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


// Basic route that sends the user first to the AJAX Page
router_slack.post("/api/slack/add-agenda", function (req, res) {
  console.log("agenda attempted")
  var newData = req.body;
  const {
    text,
    command,
    user_name,
    user_id
  } = req.body

  notes.create({
      note_text: newData.text,
      note_type: newData.command,
      user_name: newData.user_name,
      user_id: newData.user_id,
      slack_user_id: newData.user_id
    })
    .then((note) => {
      res.status(201).json(note)
    })
    .catch((err) => {
      console.log("Error while creating slack message : ", err)
    });
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