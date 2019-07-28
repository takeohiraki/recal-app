var express = require("express");
var router_auth = express.Router();
var path = require("path")
const keys = require('../config/keys');


// hits the Auth0 authorize endpoint
router_auth.get("/authorize", function (req, res) {
    console.log(req.headers.host)
    var client_id = keys.auth0Client

    if (req.headers.host == 'localhost:3000') {
        console.log("auth_routes --> localhost")
        var redirect_uri = 'http://localhost:3000/authorize/callback'    
    }
    else {
        console.log("auth_routes --> heroku")
        var redirect_uri = 'https://noodle-cal.herokuapp.com/authorize/callback'
    }
    
    var url = "https://dawn-moon-0315.auth0.com/authorize?response_type=id_token token&client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&scope=openid profile&state=xyzABC123&nonce=eqhPmz&prompt=none&access_type=offline"

    res.redirect(url)
})

// callback to silent auth
router_auth.get('/authorize/callback', function (req, res) {
    res.sendFile(path.join(__dirname, "..", "public/views/authorize.html"));
});

// callback to authlock screen
router_auth.post('/authlock/callback', function (req, res) {
    res.redirect("/home")
});

// Export routes for server.js to use.
module.exports = router_auth;