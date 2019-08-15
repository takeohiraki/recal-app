
// GENERIC REACT LIBS
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// MATERIAL UI COMPONENTS
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container'

// AUTH ROUTE
import PrivateRoute from "./components/PrivateRoute";

// COMPONENTS
import NavBar from "./components/NavBar/NavBar.jsx";
import Footer from "./components/Footer";
import Loading from "./components/Loading";

// REQUIRE AUTH
import Dashboard from "./views/Dashboard";
import Profile from "./views/Profile";
import ExternalApi from "./components/manual_triggers/ExternalApi";

// DOES NOT REQUIRE AUTH
import Home from "./views/Home";
import Privacy from "./views/Privacy";
import AgendaSubmission from "./views/AgendaSubmission";
import LandingPage from "./views/LandingPage/LandingPage";

// LIB
import { useAuth0 } from "./react-auth0-spa";

// APP STYLES 
import "./App.css";

// FONTS
import initFontAwesome from "./utils/initFontAwesome";
initFontAwesome();

var style = {
  backgroundColor: "lightgrey", 
}

const App = () => {
  const { loading } = useAuth0();

  if (loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <div id="app">
        <Container>
        <NavBar />
        <div style={style}>     
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/landing" exact component={LandingPage} />
            <Route path="/privacy" exact component={Privacy} />
            <Route path="/agenda-submission" exact component={AgendaSubmission} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/external-api" component={ExternalApi} />
          </Switch>
        </div>
        <Footer />
        </Container>
      </div>
    </BrowserRouter>
  );
};

export default App;