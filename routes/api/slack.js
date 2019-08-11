var express = require("express");
var router_slack = express.Router();
var passport = require('passport');

// Import the model to use its database functions.
const models = require("../../models");
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


router_slack.post("/api/slack/add-agenda", function (req, res) {
  console.log("/api/slack/add-agenda attempted")

  var newData = req.body
  var newData = {
    token, team_id, team_domain, enterprise_id, enterprise_name, channel_id, 
    channel_name, user_id, user_name, command, text, response_url, trigger_id
  } = req.body

  var recalUser = 'google-oauth2|114577142554347012839'

    // console.log(newData)
    // let stuff = JSON.parse(req.body)
    console.log(req.body)

  notes.create({
        note_text: newData.text,
        note_type: newData.command,
        user_name: newData.user_name,
        user_id: recalUser,
        slack_user_id: newData.user_id
      })
      .then(newNote => {
          console.log(newNote)
        res.status(201).send(newNote);
      })
      .catch(err => {
        console.log("Error while creating note from slack: ", err);
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