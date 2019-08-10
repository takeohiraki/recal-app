import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import PrivateRoute from "./components/PrivateRoute";
import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Dashboard from "./views/Dashboard";
import Profile from "./views/Profile";
import { useAuth0 } from "./react-auth0-spa";
import ExternalApi from "./components/manual_triggers/ExternalApi";

// styles
import "./App.css";

// fontawesome
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
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <div style={style}>
        <Container className="flex-grow-1 mt-5 homepageland">
          <Switch>
            <Route path="/" exact component={Home} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/external-api" component={ExternalApi} />
          </Switch>
        </Container>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;