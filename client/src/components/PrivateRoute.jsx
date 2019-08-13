import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import { useAuth0 } from "../react-auth0-spa";


// this original code block was from Auth0 GH, kept prompting for login again
// https://github.com/auth0-samples/auth0-react-samples/blob/master/01-Login/src/components/PrivateRoute.js
// 


// const PrivateRoute = ({ component: Component, path, ...rest }) => {
//   const { isAuthenticated, loginWithRedirect } = useAuth0();

//   useEffect(() => {
//     const fn = async () => {
//       if (!isAuthenticated) {
//         await loginWithRedirect({
//           appState: { targetUrl: path },
//           access_type: 'offline', 
//           // Reminder: may need to add more
//           // connection_scope: 'https://www.googleapis.com/auth/calendar.events.readonly', 
//           // approval_prompt: 'force'
//         });
//       }
//     };
//     fn();
//   }, [isAuthenticated, loginWithRedirect, path]);

//   const render = props =>
//     isAuthenticated === true ? <Component {...props} /> : null;

//   return <Route path={path} render={render} {...rest} />;
// };

// PrivateRoute.propTypes = {
//   component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
//     .isRequired,
//   path: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.arrayOf(PropTypes.string)
//   ]).isRequired
// };


// Used code block directly from https://auth0.com/docs/quickstart/spa/react/01-login
// this help with no longer prompting login over and over again...
const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { loading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (loading || isAuthenticated) {
      return;
    }
    const fn = async () => {
      await loginWithRedirect({
        appState: { targetUrl: path }
      });
    };
    fn();
  }, [loading, isAuthenticated, loginWithRedirect, path]);

  const render = props => isAuthenticated === true ? <Component {...props} /> : null;

  return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;
