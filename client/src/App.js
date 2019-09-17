
// GENERIC REACT LIBS
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// DRAG & DROP CONTEXT
import HTML5Backend from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

// MATERIAL UI COMPONENTS
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container'

// AUTH ROUTE
import PrivateRoute from "./components/PrivateRoute";

// COMPONENTS
import Loading from "./components/Loading";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer";

// REQUIRE AUTH
import Dashboard from "./views/Dashboard";
import Dashboardnew from "./views/Dashboardnew";
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
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <div id="app">

            <Switch>
              <Route path="/" exact component={LandingPage} />
              <Route path="/privacy" exact component={Privacy} />
              <Route path="/homepage" exact component={Home} />
              <Route path="/agenda-submission" exact component={AgendaSubmission} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <PrivateRoute path="/home" component={Dashboardnew} />
              <PrivateRoute path="/profile" component={Profile} />
              <PrivateRoute path="/external-api" component={ExternalApi} />
            </Switch>

          <Footer />

        </div>
      </BrowserRouter>
    </DndProvider>
  );
};

export default App;