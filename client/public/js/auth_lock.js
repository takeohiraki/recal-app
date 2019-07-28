const keys = require('../config/keys');
var redirectURLHostPrefix = "https://";

if (window.location.href.indexOf("localhost") > -1) {
    redirectURLHostPrefix = "http://";
}

    var options = {
        auth: {
            redirectUrl: redirectURLHostPrefix + location.host + '/authlock/callback',
            params: {
                connection: 'google-oauth2',
                accessType: 'offline',
                // approvalPrompt: 'force',
                scope: 'openid profile email offline_access',
                responseMode: 'form_post',
                responseType: 'token id_token' //,
                // connection_scope: 'https://www.googleapis.com/auth/calendar.readonly'
            }
        },
        theme: {
            logo: 'https://res.cloudinary.com/hwhpsei4r/image/upload/v1561874129/logo.png',
            primaryColor: '#FD9B5B'
        },
        languageDictionary: {
            title: ""
        }
        /* ,
        connectionScopes: {
            'google-oauth2': ['https://www.googleapis.com/auth/calendar.readonly']
        }*/
    }

    var lock = new Auth0Lock(
        keys.auth0Client,
        'dawn-moon-0315.auth0.com', options
    );

    var Auth = (function () {

        var wm = new WeakMap();
        var privateStore = {};
        var lock;

        function Auth() {
            this.lock = new Auth0Lock(
                keys.auth0Client,
                'dawn-moon-0315.auth0.com'
            );
            wm.set(privateStore, {
                appName: "Recal",
                accessType: "offline",
                approval_prompt = 'force'
            });
        }

        Auth.prototype.getProfile = function () {
            return wm.get(privateStore).profile;
        };

        Auth.prototype.authn = function () {
            // Listening for the authenticated event
            this.lock.on("authenticated", function (authResult) {
                // Use the token in authResult to getUserInfo() and save it if necessary
                this.getUserInfo(authResult.accessToken, function (error, profile) {
                    if (error) {
                        // Handle error
                        return;
                    }

                    //we recommend not storing Access Tokens unless absolutely necessary
                    wm.set(privateStore, {
                        accessToken: authResult.accessToken
                    });

                    wm.set(privateStore, {
                        profile: profile
                    });
                });
            });
        };
        return Auth;
    }());

    lock.show();
