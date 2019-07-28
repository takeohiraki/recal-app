// https://github.com/auth0-samples/auth0-javascript-samples/blob/master/01-Login/public/js/app.js


var express = require('express');
var passport = require('passport');
var axios = require("axios");
var request = require("request");
const keys = require('../config/keys');

// Export object with API calls
module.exports = {
    checkSession: function () {
        var cookies = document.cookie;
        console.log(cookies)
    },
    // use this to generate a new management token from auth0
    // this is required to get a user profile
    generateManagementToken: function () {
        var promise = new Promise(function (resolve, reject) {

            var request = require("request");

            var options = {
                method: 'POST',
                url: 'https://dawn-moon-0315.auth0.com/oauth/token',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                form:
                {
                    grant_type: 'client_credentials',
                    client_id: keys.auth0Client,
                    client_secret: keys.auth0Secret,
                    audience: 'https://dawn-moon-0315.auth0.com/api/v2/'
                }
            };
            request(options, function (error, response, body) {
                if (error) throw new Error(error);

                // console.log(typeof body);
                console.log(JSON.parse(body).access_token)
                resolve(JSON.parse(body).access_token)
            });
        })
        return promise
    },
    // exchange Auth0 accessToken for user_id
    userId: function (bearerToken, cb) {
        var url = "https://dawn-moon-0315.auth0.com/userinfo"

        console.log('access/bearer')
        console.log(bearerToken)

        var config = {
            headers: { 'Authorization': "bearer " + bearerToken }
        }

        axios.get(url, config, cb)
            .then(
                function (response) {
                    console.log(response.data.sub.substr(response.data.sub.indexOf("|") + 1))

                    console.log("sending result: ")
                    // console.log(response.data.sub)
                    cb(response.data.sub)
                }
            ).catch(error => {
                console.log(error.response)
            });
    },
    userIdAsync: function (bearerToken) {
        var promise = new Promise(function (resolve, reject) {
            var url = "https://dawn-moon-0315.auth0.com/userinfo"

            console.log(bearerToken)
            var config = {
                headers: { 'Authorization': "bearer " + bearerToken }
            }

            axios.get(url, config)
                .then(
                    function (response) {
                        console.log(response.data.sub.substr(response.data.sub.indexOf("|") + 1))

                        console.log("sending result: ")
                        console.log(response.data.sub)
                        resolve(response.data.sub)
                    }
                );
        })
        return promise
    },
    userInfoRefresh: function (userId, bearerToken) {
        console.log("userinfo")
        console.log(userId)
        console.log(bearerToken)

        var promise = new Promise(function (resolve, reject) {

            var url = "https://dawn-moon-0315.auth0.com/api/v2/users/google-oauth2%7C" + userId + "?include_fields=true&audience=dawn-moon-0315.auth0.com"

            var config = {
                headers: { 'Authorization': "bearer " + bearerToken }
            }

            axios.get(url, config)
                .then(
                    function (response) {
                        // console.log(response.data)
                        resolve(response.data.identities[0].refresh_token)
                        // console.log(response.data.identities[0].refresh_token)
                    }
                );
        });
        return promise
    },
    refreshGoogleToken: function (refreshToken) {

        /* var redirectURLHostPrefix = "https://";
        if (window.location.href.indexOf("localhost") > -1) {
            redirectURLHostPrefix = "http://";
        }
        console.log("refreshGoogleToken")
        console.log(redirectURLHostPrefix) */
        console.log("refreshGoogleToken")
        console.log(location.host)


        console.log("refreshToken from refreshGoogleToken")
        console.log(refreshToken)

        var clientSecret = keys.googleClient
        var clientId = keys.googleSecret

        var url = "https://www.googleapis.com/oauth2/v4/token?refresh_token=" + refreshToken + "&client_id=" + clientId + "&client_secret=" + clientSecret + "&grant_type=refresh_token&redirect_url=http://localhost:3000/callback"


        var promise = new Promise(function (resolve, reject) {

            // Call API
            axios.post(url)
                .then(
                    function (response) {
                        console.log(response.data)
                        resolve(response.data)
                    }
                );
        })
        return promise
    },
}

