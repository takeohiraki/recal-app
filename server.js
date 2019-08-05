// Dependencies
// =============================================================
var path = require("path");
var logger = require("morgan");

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const axios = require('axios');
//const routes = require("./routes");

// For auth0 backend api auth
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const {
  join
} = require("path");
const authConfig = require("./client/src/auth_config.json");
const proxy = require("./client/src/setupProxy.js");

const app = express();

if (!authConfig.domain || !authConfig.audience) {
  throw new Error(
    "Please make sure that auth_config.json is in place and populated"
  );
}

app.use(morgan("dev"));
app.use(helmet());

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

const jwtAuthz = require('express-jwt-authz');
const {
  google
} = require("googleapis");
const keys = require('./config/keys');

// Define an endpoint that must be called with an access token
app.get("/api/external", checkJwt, jwtAuthz(['openid', 'profile', 'email']), (req, res) => {

  axios.get('https://dawn-moon-0315.auth0.com/userinfo', {
      headers: {
        "Authorization": req.headers.authorization
      }
    })
    .then(function (response) {

      console.log(response);
      let user_identities_json = response.data["http://www.recal.com/user_identities"];
      let user_identities = JSON.parse(user_identities_json);
      let google_access_token = user_identities[0].access_token;
      console.log("GOOGLE ACCESS TOKEN: " + google_access_token);

      var googleRefreshToken = google_access_token;
      console.log(
        "google refresh token in api/google/calendar/events: " + googleRefreshToken
      );
    
      const oAuth2Client = new google.auth.OAuth2(
        keys.googleClient,
        keys.googleSecret,
        'http://localhost:3000/auth/google/callback'
      );

      oAuth2Client.setCredentials({
        access_token: googleRefreshToken
      });

      // first pulls google calendar events
      listEvents(oAuth2Client)
        // then takes the events, grabs their ids and puts them into an array
        .then(resolvedData => {
          console.log(resolvedData);
        })
        // displays next 10 meetings
        .then(() => {
          return pullNext10(res);
        });

    })
    .catch(function (error) {
      console.log(error);
    });

});

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


app.use(bodyParser.json());
/* app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); */

var google_routes = require("./routes/api/google_cal.js");
app.use(google_routes);


var notes_routes = require("./routes/api/notes.js");
app.use(notes_routes);

/* 
app.use(express.json({
  type: ['application/json', 'text/plain']
}))
 */

// Enable data parsing
// =============================================================
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.json());

// Sequelize Sync
// =============================================================
//const models = require("./models");
/*models.sequelize.sync({
    force: false
    // force set to true would drop and recreate the tables.
  })
  .then(() => {
    console.log(`Database & tables created!`)
  });*/

// Routes - importing so server can access them
// =============================================================

// Routes for navigating around app
/*var routes_main = require("./controllers/main_routes.js");
app.use(routes_main);*/

// Routes for handling Slack data
var slack_routes = require("./controllers/slack_routes.js");
app.use(slack_routes);

// Routes for handling Google data
/* var google_routes = require("./controllers/google_routes.js");
app.use(google_routes); */

// Routes for handling email data
var email_routes = require("./controllers/email_routes.js");
app.use(email_routes);

// Routes for handling project data
var project_routes = require("./controllers/project_routes.js");
app.use(project_routes);

// Routes for handling auth
/*var auth_routes = require("./controllers/auth_routes.js");
app.use(auth_routes);*/

if (process.env.NODE_ENV === "production") {
  // Express will serve up production assets.
  // Like main.js file or main.css file! (React)
  app.use(express.static("client/build"));

  // Express will serve up the index.html file
  // if the route is not recognized.
  // If route is not part of any of the /routes
  // or if not found in client/build
  // then use below:
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Starts the server to begin listening
// =============================================================
// PORT 5000 for DEV Server
// PORT 3000 for DEV Client
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));