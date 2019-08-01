import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";

import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "./react-auth0-spa";
import config from "./auth_config.json";

import 'bootstrap/dist/css/bootstrap.min.css';

// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}>
    <App />
  </Auth0Provider>,
  document.getElementById("global")
);

serviceWorker.unregister();
