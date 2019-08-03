var express = require("express");
var router_notes_api = express.Router();
var passport = require("passport");
const fs = require("fs");
var path = require("path");
const Sequelize = require("sequelize");
const models = require("../../models");
const slackMessages = models.slack_message;
// const auth0_helpers = require('../middleware/auth_helpers')

console.log("ran notes");

// For auth0 backend api auth
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const authConfig = require("../../client/src/auth_config.json");
const proxy = require("../../client/src/setupProxy.js");

const app = express();

if (!authConfig.domain || !authConfig.audience) {
  throw new Error(
    "Please make sure that auth_config.json is in place and populated"
  );
}

// Define middleware that validates incoming bearer tokens
// using JWKS from YOUR_DOMAIN
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ["RS256"]
});

//
// Define an endpoint that must be called with an access token
//

router_notes_api.get("/api/seed/notes", checkJwt, (req, res) => {

  console.log("api/seed/notes");

  slackMessages.create({
    message_text: "Complete MaintMax Design",
    user_name: "Patrice",
    command: "/Agenda",
    slack_user_id: getRandomInt(1111111, 99999999)
  });

  slackMessages.create({
    message_text: "Complete Testing",
    user_name: "Amanda",
    command: "/Agenda",
    slack_user_id: getRandomInt(1111111, 99999999)
  });

  slackMessages.create({
    message_text: "Complete Data Capture",
    user_name: "Darren",
    command: "/Agenda",
    slack_user_id: getRandomInt(1111111, 99999999)
  });

  slackMessages.create({
    message_text: "Go Live/Launch",
    user_name: "Darren",
    command: "/Agenda",
    slack_user_id: getRandomInt(1111111, 99999999)
  });

  slackMessages.create({
    message_text: "Verify Functionality on Maintenance Servers",
    user_name: "Johny",
    command: "/Agenda",
    slack_user_id: getRandomInt(1111111, 99999999)
  });

  slackMessages.create({
    message_text: "Operational Acceptance",
    user_name: "Darren",
    command: "/Agenda",
    slack_user_id: getRandomInt(1111111, 99999999)
  });

  res.send({
    msg: "Notes seeded"
  });
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  

module.exports = router_notes_api;
