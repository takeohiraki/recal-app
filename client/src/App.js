
// GENERIC REACT LIBS
import React, { Fragment } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import clsx from "clsx";

// DRAG & DROP CONTEXT
import HTML5Backend from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

// MATERIAL UI COMPONENTS
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Container from '@material-ui/core/Container'

import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import Link from '@material-ui/core/Link';

import logo from "../../client/src/assets/dark.png";

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

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
}));

var style = {
  backgroundColor: "lightgrey", 
}

const App = () => {
  const { loading } = useAuth0();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div id="app">
        <BrowserRouter>
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
              position="fixed"
              className={clsx(classes.appBar, {
                [classes.appBarShift]: open
              })}
            >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap>
                Dashboard
              </Typography>
            </Toolbar>
            </AppBar>
            <Drawer
              className={classes.drawer}
              variant="persistent"
              anchor="left"
              open={open}
              classes={{
                paper: classes.drawerPaper
              }}
            >
            <div className={classes.drawerHeader}>
              <Link to="/home"><img src={logo} alt="Recal" width="100" /></Link>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "ltr" ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </div>
            <Divider />
            <List>
              {[
              {"Label": "Home", "LinkHref": "/Home"}, 
              {"Label": "External Api", "LinkHref": "/External-Api"}, 
              {"Label": "Dashboard", "LinkHref": "/Dashboard"}
              ].map((item, index) => (
                <ListItem button component="a" href={item.LinkHref} key={item.Label}>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={item.Label} />
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {[  {"Label": "Calendar", "LinkHref": "/"}, 
              {"Label": "Project", "LinkHref": "/"}
              ].map((item, index) => (
                <ListItem button component="a" href={item.LinkHref} key={item.Label}>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={item.Label} />
                </ListItem>
              ))}
            </List>
            </Drawer>
            <main className={clsx(classes.content, {
              [classes.contentShift]: open
            })}>
              <div className={classes.drawerHeader} />
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
            </main>
          </div>
          <Footer />     
        </BrowserRouter>
      </div>
    </DndProvider>
  );
};

export default App;