var express = require("express");
var router_google = express.Router();
var passport = require("passport");
const fs = require("fs");
var path = require("path");
const Sequelize = require("sequelize");
const { google } = require("googleapis");
const models = require("../models");
const googleCalEventsDB = models.google_cal_events;
const googleCallEventNotes = models.google_cal_event_notes;
const slackMessages = models.slack_message;
const auth0_helpers = require("../middleware/auth_helpers");

const morgan = require("morgan");
const helmet = require("helmet");

// For auth0 backend api auth
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const authConfig = require("./client/src/auth_config.json");
const proxy = require("./client/src/setupProxy.js");

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
router_google.get("/api/google/seed_experimental", checkJwt, (req, res) => {
  googleCalEventsDB.create({
    creator: "jingwen.nataly.sun@gmail.com",
    html_link:
      "https://www.google.com/calendar/event?eid=XzZ0bG5hcXJsZTVwNmNwY",
    i_cal_uid: "",
    google_cal_event_id: "",
    organizer_email: "jingwen.nataly.sun@gmail.com",
    start_date: "2019-06-29 18:00:00",
    end_date: "2019-06-30 18:00:00",
    description: "Noodle-Cal Study Day"
  });

  googleCalEventsDB.create({
    creator: "jingwen.nataly.sun@gmail.com",
    html_link:
      "https://www.google.com/calendar/event?eid=XzZ0bG5hcXJsZTVwNmNwY",
    i_cal_uid: "",
    google_cal_event_id: "",
    organizer_email: "jingwen.nataly.sun@gmail.com",
    start_date: "2019-06-27 16:00:00",
    end_date: "2019-06-27 17:00:00",
    description: "Metting with John"
  });

  googleCalEventsDB.create({
    creator: "jingwen.nataly.sun@gmail.com",
    html_link:
      "https://www.google.com/calendar/event?eid=XzZ0bG5hcXJsZTVwNmNwY",
    i_cal_uid: "",
    google_cal_event_id: "",
    organizer_email: "jingwen.nataly.sun@gmail.com",
    start_date: "2019-06-26 18:00:00",
    end_date: "2019-06-26 21:00:00",
    description: "Bootcamp Class"
  });

  res.status(200).redirect("/home");
});

/*router_google.post("/api/event/notes", (req, res) => {
  var eventIds = req.body.eventIds;

  googleCallEventNotes
    .findAll({
      where: {
        event_id: {
          [Sequelize.Op.in]: eventIds
        }
      }
    })
    .then(googleCallEventNotes => {
      var noteIds = googleCallEventNotes.map(function(item) {
        return item.note_id;
      });

      slackMessages
        .findAll({
          where: {
            id: {
              [Sequelize.Op.in]: noteIds
            }
          }
        })
        .then(slackMessages => {
          res.status(200).send({
            event_notes: googleCallEventNotes,
            messages: slackMessages
          });
        });
    });
});*/

/*router_google.post("/api/event/add-note", checkJwt, function(req, res) {
  googleCallEventNotes
    .create({
      event_id: req.body.event_id,
      note_id: req.body.note_id
    })
    .then(function(affectedRows) {
      res.sendStatus(200).send(affectedRows);
    });
});*/

router_google.delete("/api/google/delete-event", function(req, res) {
  googleCalEventsDB
    .destroy({
      where: {
        id: req.body.id
      }
    })
    .then(function(affectedRows) {
      res.sendStatus(200).send(affectedRows);
    });
});

router_google.post("/google-refresh-token", function(req, res) {
  //var cookie = JSON.stringify(req.cookies).replace(/\\/g, "").split(/"/g)[11]
  // var cookie = req.cookies.access_token
  var accessToken = req.body.accessToken;

  console.log("accessToken in google-refresh-token " + accessToken);
  async function run() {
    try {
      console.log("getting mgmtToken");
      var mgmtToken = await auth0_helpers.generateManagementToken();
    } catch (e) {
      return "error occurred";
    }

    try {
      console.log("getting auth0AccessToken");
      var auth0AccessToken = (await auth0_helpers.userIdAsync(
        accessToken
      )).split("|")[1];
    } catch (e) {
      return "error occurred";
    }

    try {
      console.log("refreshing gtoken");
      var gRefresh = await auth0_helpers.userInfoRefresh(
        auth0AccessToken,
        mgmtToken
      );
    } catch (e) {
      return "error occurred";
    }

    console.log(
      "Retrieved google refresh token in google-refresh-token: " + gRefresh
    );
    return res.send(gRefresh);
  }
  run();
});

// pulls calendar events for a valid session
router_google.post("/api/google/calendar/events", (req, res) => {
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

//  * Lists the next 10 events on the user's primary calendar.
// * @param {google.auth.OAuth2} auth An authorized OAuth2 client.

function listEvents(auth) {
  console.log("run list events");
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

        console.log(events);
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
}

// Export routes for server.js to use.
module.exports = router_google;
