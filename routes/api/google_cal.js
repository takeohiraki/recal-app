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
const axios = require("axios");

const jwtAuthz = require("express-jwt-authz");
const keys = require("../../config/keys");

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

//////////////////////////////////////////////////
// Define an endpoint that must be called with an access token
//////////////////////////////////////////////////
router_google.get("/api/seed/google_cal", checkJwt, (req, res) => {
  console.log("api/seed/google_cal");

  googleCalEventsDB.create({
    google_cal_event_id: "ge1",
    recurring_event_id: null,
    calendar_owner_user_id: "a123",
    status: "confirmed",
    creator_email: "tbhiraki@gmail.com",
    is_creator: true,
    organizer_email: "abc@gmail.com",
    is_organizer: false,
    event_title: "Title1111111",
    event_description: "Description11111111",
    hangoutLink: null,
    event_start: "2019-03-02T22:55:00.000Z",
    event_start_tz: "America/Los_Angeles",
    event_end: "2019-03-02T22:55:00.000Z",
    event_end_tz: "America/Los_Angeles",
    event_original_start: "2019-03-02T22:55:00.000Z",
    event_original_tz: "America/Los_Angeles",
    event_created_at: "2019-03-02T22:55:00.000Z",
    event_updated_at: "2019-03-02T22:55:00.000Z",
    createdAt: "2019-03-02",
    updatedAt: "2019-03-02"
  });
  googleCalEventsDB.create({
    google_cal_event_id: "ge2",
    recurring_event_id: "123",
    calendar_owner_user_id: "google-oauth2|114577142554347012839",
    status: "confirmed",
    creator_email: "xyzgmail.com",
    is_creator: true,
    organizer_email: "abc@gmail.com",
    is_organizer: false,
    event_title: "Title2",
    event_description: "Description2",
    hangoutLink: "example.hangouts.com",
    event_start: "2019-03-02T22:55:00.000Z",
    event_start_tz: "America/Los_Angeles",
    event_end: "2019-03-02T22:55:00.000Z",
    event_end_tz: "America/Los_Angeles",
    event_original_start: "2019-03-02T22:55:00.000Z",
    event_original_tz: "America/Los_Angeles",
    event_created_at: "2019-03-02T22:55:00.000Z",
    event_updated_at: "2019-03-02T22:55:00.000Z",
    createdAt: "2019-03-02",
    updatedAt: "2019-03-02"
  });
  googleCalEventsDB.create({
    google_cal_event_id: "ge3",
    recurring_event_id: null,
    calendar_owner_user_id: "google-oauth2|114577142554347012839",
    status: "confirmed",
    creator_email: "xyzgmail.com",
    is_creator: true,
    organizer_email: "abc@gmail.com",
    is_organizer: false,
    event_title: "Title33333333333",
    event_description: "Description33333333333",
    hangoutLink: null,
    event_start: "2019-03-02T22:55:00.000Z",
    event_start_tz: "America/Los_Angeles",
    event_end: "2019-03-02T22:55:00.000Z",
    event_end_tz: "America/Los_Angeles",
    event_original_start: null,
    event_original_tz: null,
    event_created_at: "2019-03-02T22:55:00.000Z",
    event_updated_at: "2019-03-02T22:55:00.000Z",
    createdAt: "2019-03-02",
    updatedAt: "2019-03-02"
  });
  googleCalEventsDB.create({
    google_cal_event_id: "ge4",
    recurring_event_id: null,
    calendar_owner_user_id: "google-oauth2|114577142554347012839",
    status: "confirmed",
    creator_email: "xyzgmail.com",
    is_creator: true,
    organizer_email: "abc@gmail.com",
    is_organizer: false,
    event_title: "Title444444444",
    event_description: "Description4444444444",
    hangoutLink: null,
    event_start: "2019-03-02T22:55:00.000Z",
    event_start_tz: "America/Los_Angeles",
    event_end: "2019-03-02T22:55:00.000Z",
    event_end_tz: "America/Los_Angeles",
    event_original_start: null,
    event_original_tz: null,
    event_created_at: "2019-03-02T22:55:00.000Z",
    event_updated_at: "2019-03-02T22:55:00.000Z",
    createdAt: "2019-03-02",
    updatedAt: "2019-03-02"
  });

  res.send({
    msg: "Calendar seeded"
  });
});

//////////////////////////////////////////////////
// pulls calendar events for a valid session
//////////////////////////////////////////////////
router_google.get(
  "/api/fetch_google_calendar_events",
  checkJwt,
  jwtAuthz(["openid", "profile", "email"]),
  (req, res) => {
    console.log("api/fetch_google_calendar_events");

    // grab user_id
    // Reminder: may need to add logic here if there is no user_id, since it may indicate the user isn't auth'd
    console.log(req.user.sub);
    let user_id = req.user.sub;

    axios
      .get("https://dawn-moon-0315.auth0.com/userinfo", {
        headers: {
          Authorization: req.headers.authorization
        }
      })
      .then(function(response) {
        let user_identities_json =
          response.data["http://www.recal.com/user_identities"];
        let user_identities = JSON.parse(user_identities_json);
        let google_access_token = user_identities[0].access_token;
        let google_refresh_token = user_identities[0].refresh_token;
        console.log("GOOGLE ACCESS TOKEN: " + google_access_token);
        console.log("GOOGLE REFRESH TOKEN: " + google_refresh_token);
        console.log(user_identities);

        const oAuth2Client = new google.auth.OAuth2(
          keys.googleClient,
          keys.googleSecret,
          "http://localhost:3000/auth/google/callback"
        );

        oAuth2Client.setCredentials({
          // Reminder: Not sure if this auto-uses refresh token if access token is expired
          // Also we grab a new refresh token each time they login
          access_token: google_access_token,
          refresh_token: google_refresh_token
        });

        // first pulls google calendar events
        googleCalMethods
          .getEventsFromGoogle(oAuth2Client)
          // then takes the events, grabs their ids and puts them into an array
          .then(resolvedData => {
            console.log("writeMeetingDB");
            // console.log(resolvedData);
            return googleCalMethods.writeMeetingDB(resolvedData, user_id);
          })
          // display upcoming meetings
          .then(() => {
            console.log("displayEvents");
            return googleCalMethods.displayEvents(res, user_id);
          });
      })
      .catch(function(error) {
        console.log(error);
      });
  }
);

//////////////////////////////////////////////////
// Helper functions for pulling, writing, and displaying events
//////////////////////////////////////////////////
// Reminder: Move this somewhere else (helper file?)
let googleCalMethods = {
  // Pull events from DB
  displayEvents: function(res, user_id) {
    console.log("running displayEvents");
    googleCalEventsDB
      .findAll({
        where: {
          calendar_owner_user_id: user_id
        },
        order: [["createdAt", "DESC"]]
      })
      .then(googleCalEvents => {
        res.status(200).send(googleCalEvents);
      });
  },
  getEventsFromGoogle: function(auth) {
    console.log("run getEventsFromGoogle");
    return new Promise(function(resolve, reject) {
      const calendar = google.calendar({
        version: "v3",
        auth
      });
      calendar.events.list(
        {
          calendarId: "primary",
          // timeMin: (new Date()).toISOString(),
          timeMin: new Date().toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: "startTime"
        },
        (err, res) => {
          if (err) return console.log("The API returned an error: " + err);
          const events = res.data.items;

          // console.log(events);
          console.log(events.attendees);
          // console.log(new Date().toISOString())

          if (events.length) {
            resolve(events);
          } else {
            console.log("No upcoming events found.");
            reject("No upcoming events found.");
          }
        }
      );
    });
  },
  // Create new entries in the DB based on the events that are retrieved from Google
  writeMeetingDB: function(meetingsArr, userId) {
    console.log("running createUpdateGcalDB");
    console.log(meetingsArr);

    return new Promise(function(resolve, reject) {
      let gCalArr = [];

      meetingsArr.forEach(function(element) {
        gCalArr.push({
          google_cal_event_id: element.id,
          recurring_event_id: element.recurringEventId || null,
          calendar_owner_user_id: userId,
          status: element.status,
          creator_email: element.creator.email,
          is_creator: element.creator.self,
          organizer_email: element.organizer.email,
          is_organizer: element.organizer.self,
          event_title: element.summary,
          event_description: element.description || null,
          hangoutLink: element.hangoutLink,
          event_start: element.start.dateTime,
          event_start_tz: element.start.timeZone || null,
          event_end: element.end.dateTime,
          event_end_tz: element.end.timeZone || null,
          // Reminder: not using these fields
          // event_original_start: element.originalStartTime.dateTime || null,
          // event_original_tz: element.originalStartTime.timeZone || null,
          event_created_at: element.created,
          event_updated_at: element.updated
        });
      });
      googleCalEventsDB
        .bulkCreate(gCalArr, {
          // Reminder: I suspect that this is not updating events
          updateOnDuplicate: ["google_cal_event_id"]
        })
        .then(([affectedCount, affectedRows]) => {
          resolve(affectedCount);
        })
        .catch(function(error) {
          console.error(data);
        });
    });
  }
};

// Export routes for server.js to use.
module.exports = router_google;
