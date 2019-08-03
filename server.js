// Dependencies
// =============================================================
var path = require("path");
var logger = require("morgan");

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
//const routes = require("./routes");

// For auth0 backend api auth
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const { join } = require("path");
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

// Define an endpoint that must be called with an access token
app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your Access Token was successfully validated!"
  });
});



app.get("/api/google_seed", checkJwt, (req, res) => {
  console.log("ran google seed");
  const models = require('./models');
  const googleCalEventsDB = models.google_cal_events;
  

  googleCalEventsDB.create({
    creator: "jingwen.nataly.sun@gmail.com",
    html_link: "https://www.google.com/calendar/event?eid=XzZ0bG5hcXJsZTVwNmNwY",
    i_cal_uid: "abc",
    google_cal_event_id: "abc",
    organizer_email: "jingwen.nataly.sun@gmail.com",
    start_date: "2019-06-29 18:00:00",
    end_date: "2019-06-30 18:00:00",
    description: "Noodle-Cal Study Day"
  });

  googleCalEventsDB.create({
    creator: "jingwen.nataly.sun@gmail.com",
    html_link: "https://www.google.com/calendar/event?eid=XzZ0bG5hcXJsZTVwNmNwY",
    i_cal_uid: "cxz",
    google_cal_event_id: "cxz",
    organizer_email: "jingwen.nataly.sun@gmail.com",
    start_date: "2019-06-27 16:00:00",
    end_date: "2019-06-27 17:00:00",
    description: "Meeting with John"
  });

  googleCalEventsDB.create({
    creator: "jingwen.nataly.sun@gmail.com",
    html_link: "https://www.google.com/calendar/event?eid=XzZ0bG5hcXJsZTVwNmNwY",
    i_cal_uid: "ewq",
    google_cal_event_id: "ewq",
    organizer_email: "jingwen.nataly.sun@gmail.com",
    start_date: "2019-06-26 18:00:00",
    end_date: "2019-06-26 21:00:00",
    description: "Bootcamp Class"
  });

  res.send({
    msg: "Database seeded"
  });
});

/* app.use(routes);  */

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
