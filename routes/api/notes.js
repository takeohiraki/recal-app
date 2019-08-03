var express = require("express");
var router_notes_api = express.Router();
var passport = require("passport");
const fs = require("fs");
var path = require("path");
const Sequelize = require("sequelize");
const models = require("../../models");
const notes = models.notes;
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

  notes.create({
    note_text: "Complete MaintMax Design",
    note_type: "/Agenda",
    user_name: "Patrice",
    user_id: 123,
    slack_user_id: getRandomInt(1111111, 99999999)
  });

  notes.create({
    note_text: "Complete Testing",
    note_type: "/Agenda",
    user_name: "Amanda",
    user_id: 456,
    slack_user_id: getRandomInt(1111111, 99999999)
  });

  notes.create({
    note_text: "Complete Data Capture",
    note_type: "/Agenda",
    user_name: "Darren",
    user_id: 789,
    slack_user_id: getRandomInt(1111111, 99999999)
  });

  notes.create({
    note_text: "Go Live/Launch",
    note_type: "/Agenda",
    user_name: "Darren",
    user_id: 158,
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
