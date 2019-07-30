// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");

var logger = require("morgan");
const keys = require('./config/keys');

// Sequelize Sync
// =============================================================

const models = require("./models");
models.sequelize.sync({
    force: false
    // force set to true would drop and recreate the tables.
  })
  .then(() => {
    console.log(`Database & tables created!`)
  });

// Sets up the Express App
// =============================================================
var app = express();

app.use(express.static(path.join(__dirname, "public")));

// Enable data parsing
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.json());

//handlebars
var exphbs = require("express-handlebars");

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/public/views"));

// Routes - importing so server can access them
// =============================================================

// Routes for navigating around app
var routes_main = require("./controllers/main_routes.js");
app.use(routes_main);

// Routes for handling Slack data
var slack_routes = require("./controllers/slack_routes.js");
app.use(slack_routes);

// Routes for handling Google data
var google_routes = require("./controllers/google_routes.js");
app.use(google_routes);

// Routes for handling email data
var email_routes = require("./controllers/email_routes.js");
app.use(email_routes);

// Routes for handling project data
var project_routes = require("./controllers/project_routes.js");
app.use(project_routes);

// Routes for handling auth
var auth_routes = require("./controllers/auth_routes.js");
app.use(auth_routes);

// app.get('/authorize', '/home')

app.use(cookieParser());

/* // Routes for handling auth0 login/signup
var authRouter = require('./controllers/auth.js');
app.use(authRouter);

 */

// Starts the server to begin listening
// =============================================================
app.listen(process.env.PORT || 3000, function () {
  console.log("App listening on PORT " + (process.env.PORT || 3000));
});