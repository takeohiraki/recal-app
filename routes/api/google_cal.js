var express = require("express");
var router_google = express.Router();
var passport = require("passport");
const fs = require("fs");
var path = require("path");
const Sequelize = require("sequelize");
const { google } = require("googleapis");
const models = require("../../models");
const googleCalEventsDB = models.calendar_events;
// const auth0_helpers = require('../middleware/auth_helpers')

console.log("ran google_cal");

const morgan = require("morgan");
const helmet = require("helmet");

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
router_google.get("/api/seed/google_cal", checkJwt, (req, res) => {
  googleCalEventsDB.create({
    google_cal_event_id: "ge1",
    user_id: "abc",
    google_cal_user_id: "gu1",
    creator_id: "jingwen.nataly.sun@gmail.com",
    html_link:
      "https://www.google.com/calendar/event?eid=XzZ0bG5hcXJsZTVwNmNwY",
    i_cal_uid: "abc",
    google_cal_event_id: "def",
    organizer_email: "jingwen.nataly.sun@gmail.com",
    start_date: "2019-06-29 18:00:00",
    end_date: "2019-06-30 18:00:00",
    event_title: "Noodle-Cal Study Day Event 1",
    event_description: "Noodle-Cal Study Day Description 1",
    repeat_event: false,
    repeat_event_parent_id: "NULL"
  });

  googleCalEventsDB.create({
    google_cal_event_id: "ge2",
    user_id: "def",
    google_cal_user_id: "gu2",
    creator_id: "tbhiraki@gmail.com",
    html_link:
      "https://www.google.com/calendar/event?eid=XzZ0bG5hcXJsZTVwNmNwY",
    i_cal_uid: "ghi",
    google_cal_event_id: "jkl",
    organizer_email: "tbhiraki@gmail.com",
    start_date: "2019-07-29 18:00:00",
    end_date: "2019-07-30 18:00:00",
    event_title: "Noodle-Cal Study Day Event 2",
    event_description: "Noodle-Cal Study Day Description 2",
    repeat_event: false,
    repeat_event_parent_id: "NULL"
  });

  googleCalEventsDB.create({
    google_cal_event_id: "ge3",
    user_id: "mno",
    google_cal_user_id: "gu3",
    creator_id: "tbhiraki@gmail.com",
    html_link:
      "https://www.google.com/calendar/event?eid=XzZ0bG5hcXJsZTVwNmNwY",
    i_cal_uid: "pqr",
    google_cal_event_id: "stu",
    organizer_email: "test@recal.work",
    start_date: "2019-08-29 18:00:00",
    end_date: "2019-08-30 18:00:00",
    event_title: "Noodle-Cal Study Day Event 3",
    event_description: "Noodle-Cal Study Day Description 3",
    repeat_event: false,
    repeat_event_parent_id: "NULL"
  });

  res.send({
    msg: "Calendar seeded"
  });
});

//
// pulls calendar events for a valid session
//
router_google.get("/api/fetch_google_calendar_events", (req, res) => {
  var googleRefreshToken = req.body.googleRefreshToken;
  console.log(
    "google refresh token in api/google/calendar/events: " + googleRefreshToken
  );

  fs.readFile(
    path.join(__dirname, "..", "helpers/oauth_google/credentials.json"),
    (err, content) => {
      //fs.readFile('../helpers/oauth_google/credentials.json', (err, content) => {

      if (err) return console.log("Error loading client secret file:", err);
      // Authorize a client with credentials, then call the Google Calendar API.
      var credentials = JSON.parse(content);
      const { client_secret, client_id, redirect_uris } = credentials.web;
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );

      oAuth2Client.setCredentials({
        refresh_token: googleRefreshToken
      });

      // first pulls google calendar events
      listEvents(oAuth2Client)
        // then takes the events, grabs their ids and puts them into an array
        .then(resolvedData => {
          return createUpdateGcalDB(resolvedData, req);
        })
        // displays next 10 meetings
        .then(() => {
          return pullNext10(res);
        });
    }
  );
});
/* 
let googleCal = {
  pullNext10: function(res) {
    googleCalEventsDB
      .findAll({
        order: [["createdAt", "DESC"]]
      })
      .then(googleCalEvents => {
        // res.status(200).send(googleCalEvents);
        res.status(200).send(googleCalEvents);
      });
  },
  createUpdateGcalDB: function(gCalMeetings, req) {
    return new Promise(function(resolve, reject) {
      //var cookie = req.query.access_token
      // const cookies = req.cookies; // get not signed cookies
      // console.log('not-signed-cookies:', cookies);
      // or access directly to one cookie by its name :
      const accessTokenCookie = req.cookies.access_token;
      // console.log(myTestCookie)
      console.log("testcookie: " + accessTokenCookie);

      auth0_helpers.userId(accessTokenCookie, function(result) {
        var userId = result;
        console.log("userid calendar");
        console.log(userId);

        var gCalArr = [];

        gCalMeetings.forEach(function(element) {
          gCalArr.push({
            creator: element.creator.email,
            html_link: element.htmlLink,
            i_cal_uid: element.iCalUID,
            google_cal_event_id: element.id,
            organizer_email: element.organizer.email,
            start_date: element.start.dateTime,
            end_date: element.end.dateTime,
            description: element.summary,
            user_id: userId
          });
        });
        googleCalEventsDB
          .bulkCreate(gCalArr, {
            updateOnDuplicate: ["google_cal_event_id"]
          })
          .then(([affectedCount, affectedRows]) => {
            resolve(affectedCount);
          });
      });
    });
  }
}; */

function pullNext10(res) {
  googleCalEventsDB
    .findAll({
      order: [["createdAt", "DESC"]]
    })
    .then(googleCalEvents => {
      // res.status(200).send(googleCalEvents);
      res.status(200).send(googleCalEvents);
    });
}

// function compareDB(gCalMeetings, gCalIds) {
function createUpdateGcalDB(gCalMeetings, req) {
  return new Promise(function(resolve, reject) {
    //var cookie = req.query.access_token
    // const cookies = req.cookies; // get not signed cookies
    // console.log('not-signed-cookies:', cookies);
    // or access directly to one cookie by its name :
    const accessTokenCookie = req.cookies.access_token;
    // console.log(myTestCookie)
    console.log("testcookie: " + accessTokenCookie);

    auth0_helpers.userId(accessTokenCookie, function(result) {
      var userId = result;
      console.log("userid calendar");
      console.log(userId);

      var gCalArr = [];

      gCalMeetings.forEach(function(element) {
        gCalArr.push({
          creator: element.creator.email,
          html_link: element.htmlLink,
          i_cal_uid: element.iCalUID,
          google_cal_event_id: element.id,
          organizer_email: element.organizer.email,
          start_date: element.start.dateTime,
          end_date: element.end.dateTime,
          description: element.summary,
          user_id: userId
        });
      });
      googleCalEventsDB
        .bulkCreate(gCalArr, {
          updateOnDuplicate: ["google_cal_event_id"]
        })
        .then(([affectedCount, affectedRows]) => {
          resolve(affectedCount);
        });
    });
  });
}

// Export routes for server.js to use.
module.exports = router_google;
