var express = require("express");
var router_main = express.Router();
var path = require("path");
const models = require('../models');
const slackMessages = models.slack_message;
const googleEvents = models.google_cal_events;
const projects = models.projects;
const auth0_helpers = require('../middleware/auth_helpers');

// Middleware to see if the request is coming from the auth callback
const checkAuthOrigin = (req, res, next) => {
    var origin = req.query.origin
    console.log("origin in checkAuthOrigin: " + origin)
    if (origin == "auth") {
        console.log("checkAuthOrigin --> from auth")
        next()
    }
    else {
        console.log("checkAuthOrigin --> sending to auth")
        res.redirect('/authorize')
    }
}

// Middleware to grab access token from cookies
var getAccessToken = (req, res, next) => {
    console.log("accessToken in getAccessToken:  " + req.cookies.access_token)
    req.accessToken = req.cookies.access_token
    next()
}

var modifyUrl = (req, res, next) => {
    // console.log("accessToken in getAccessToken:  " + req.cookies.access_token)
    // req.url = req.url.slice()
    console.log("modifyUrl")
    req.url = req.url.split("?")[0]
    console.log(req.url)
    next()
}


// Loads home page
router_main.get("/home", checkAuthOrigin, getAccessToken, modifyUrl, function (req, res) {

    console.log("accessToken in /home: " + req.accessToken)

    var accessToken = req.accessToken
    var origin = req.query.origin

    auth0_helpers.userId(accessToken, function (result) {

        var userId = result
        console.log('userId in /home: ' + userId)

        slackMessages.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
        }).then(slackMessages => {
            googleEvents.findAll({
                where: {
                    user_id: userId
                },
                order: [
                    ['createdAt', 'DESC']
                ]
            }).then(googleEvents => {
                projects.findAll({
                    /* where: {
                         userId: userId
                    }, */
                    order: [
                        ['createdAt', 'DESC']
                    ]
                }).then(projects => {
                    res.render("home", {
                        title: "Recal-Home",
                        name: "Recal",
                        style: "style.css",
                        messages: slackMessages,
                        google: googleEvents,
                        projects: projects
                    });
                });
            });
        })
    })
});

// route to the login page
router_main.get("/login-spa", function (req, res) {
    console.log(__dirname, "..", "public/views/login-spa.html");
    res.sendFile(path.join(__dirname, "..", "public/views/login-spa.html"));
});

router_main.get("/", function (req, res) {
    res.render("index", {
        title: "Recal",
        name: "Recal",
        style: "darkstyle.css"
    });
});

router_main.get("/googlelogin", function (req, res) {
    res.render("login", {
        title: "Recal-Google",
        name: "Recal",
        style: "darkstyle.css"
    });
});


// Export routes for server.js to use.
module.exports = router_main;