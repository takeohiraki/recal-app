const SlackStrategy = require('passport-slack').Strategy;
const keys = require('../config/keys');

module.exports = function (passport) {
    // When using Passport's session functionality, you need to tell passport how to
    // serialize/deserialize the user object to the session store
    passport.serializeUser((user, done) => {
        // Simplest possible serialization
        done(null, JSON.stringify(user));
    });
    passport.deserializeUser((json, done) => {
        // Simplest possible deserialization
        done(null, JSON.parse(json));
    });
    // setup the strategy using defaults 
    passport.use(new SlackStrategy({
        clientID: keys.slackClient,
        clientSecret: keys.slackSecret
    }, (accessToken, refreshToken, profile, done) => {
        // optionally persist profile data
        done(null, {
            profile: profile,
            token: accessToken
        });
    }));
};