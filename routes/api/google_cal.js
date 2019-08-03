var express = require("express");
var router_google = express.Router();
var passport = require('passport');
const fs = require('fs');
var path = require("path");
const Sequelize = require('sequelize');
const {
    google
} = require('googleapis');
const models = require('../models');
const googleCalEventsDB = models.google_cal_events;
const googleCallEventNotes = models.google_cal_event_notes;
const slackMessages = models.slack_message;
const auth0_helpers = require('../middleware/auth_helpers')


console.log("ran google_cal")

const morgan = require("morgan");
const helmet = require("helmet");

// For auth0 backend api auth
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const authConfig = require("./client/src/auth_config.json");
const proxy = require('./client/src/setupProxy.js')

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

// Define an endpoint that must be called with an access token
router_google.get("/api/google/seed_experiment", checkJwt, (req, res) => {

    googleCalEventsDB.create({
        creator: 'jingwen.nataly.sun@gmail.com',
        html_link: 'https://www.google.com/calendar/event?eid=XzZ0bG5hcXJsZTVwNmNwY',
        i_cal_uid: '',
        google_cal_event_id: '',
        organizer_email: 'jingwen.nataly.sun@gmail.com',
        start_date: '2019-06-29 18:00:00',
        end_date: '2019-06-30 18:00:00',
        description: 'Noodle-Cal Study Day'
    });

    googleCalEventsDB.create({
        creator: 'jingwen.nataly.sun@gmail.com',
        html_link: 'https://www.google.com/calendar/event?eid=XzZ0bG5hcXJsZTVwNmNwY',
        i_cal_uid: '',
        google_cal_event_id: '',
        organizer_email: 'jingwen.nataly.sun@gmail.com',
        start_date: '2019-06-27 16:00:00',
        end_date: '2019-06-27 17:00:00',
        description: 'Meeting with John'
    });

    googleCalEventsDB.create({
        creator: 'jingwen.nataly.sun@gmail.com',
        html_link: 'https://www.google.com/calendar/event?eid=XzZ0bG5hcXJsZTVwNmNwY',
        i_cal_uid: '',
        google_cal_event_id: '',
        organizer_email: 'jingwen.nataly.sun@gmail.com',
        start_date: '2019-06-26 18:00:00',
        end_date: '2019-06-26 21:00:00',
        description: 'Bootcamp Class'
    });

    res.status(200).redirect('/home');

});


// Export routes for server.js to use.
module.exports = router_google;
