import React, {
  Fragment,
  useState,
  useEffect 
} from "react";

import logo from "../assets/dark.png";

import clsx from "clsx";
import Columns from "../components/Columns/index";
import NavBar from "../components/NavBar/NavBar";
import {
  useAuth0
} from "../../src/react-auth0-spa";

import GetNote from "../components/Notes/Notes";
import Sidebar from "../components/Sidebar";
import Notes from "../components/Notes/test";

import { makeStyles, useTheme } from "@material-ui/core/styles";
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

const Dashboardnew= () => {

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [showResult, setShowResult] = useState(false);
  const [userNotes, setUserNotes] = useState("");
  const [userEvents, setUserEvents] = useState("");
  const [userEventNotes, setUserEventNotes] = useState("");

  const {
    getTokenSilently, user
  } = useAuth0();

  const handleDrawerOpen = () => {
    setOpen(true);
  }

  const handleDrawerClose = () => {
    setOpen(false);
  }

  const loadUserData = (userToken) => {

    console.log("Dashboard loading...");
    const initGetUserData = async () => {

      let token = await getTokenSilently();
      console.log(`User Token - ${token.substring(0, 15) + '...'}`);

      /// NOTES /// 
      console.log(`Getting User Notes - ${token.substring(0, 15) + '...'}`);

      let notesDataResponse = await fetch("/api/notes/get", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      let notesDataJson = await  notesDataResponse.json()
      console.log(`Obtained ${notesDataJson.length} User Notes`);
      setUserNotes(notesDataJson);

       /// EVENTS /// 
      console.log(`Getting User Events - ${token.substring(0, 15) + '...'}`);
      const eventsDataResponse = await fetch("/api/fetch_google_calendar_events", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      let eventsDataJson = await  eventsDataResponse.json()
      console.log(`Obtained ${eventsDataJson.length} User Events`);
      setUserEvents(eventsDataJson);

      var eventIdsItems = eventsDataJson.map((item, index) =>{ 
        return item.id 
      });
      var eventIdsItemsJson = JSON.stringify(eventIdsItems);
      // EVENT NOTES // 
      console.log(`Getting Event Notes - ${token.substring(0, 15) + '...'}`);
     
      const eventNotesDataResponse = await fetch("/api/event/notes", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: eventIdsItemsJson
      });

      let eventNotesDataJson = await  eventNotesDataResponse.json()
      console.log(`Obtained ${eventNotesDataJson.eventNotes.length} User Event Notes`);
      setUserEventNotes(eventNotesDataJson);

      console.log(eventNotesDataJson);

      setShowResult(true);
     
    };

    initGetUserData();

  };

  const addNoteToDB = async (newNote) => {
    try {
      const token = await getTokenSilently();
      console.log("TOKEN: " + token);
      const response = await fetch("/api/notes/add-note", {
        method: "post",
        headers: {
          'Authorization': `Bearer ${token}`
          , 'Content-Type': 'application/json'
          , 'Accept': 'application/json',
        },
        body: JSON.stringify(newNote)
      });

      const responseData = await response.json();

      console.log(responseData);

      var existingNotes = [...userNotes];
      existingNotes.push(responseData);
  
      setUserNotes(existingNotes);
      console.log(existingNotes);

    } catch (error) {
      console.error(error);
    }
  };

  const noteAddedEvent = (event) => {
   
    if(event.key != 'Enter' || event.target.value == '') 
    {
        return;
    }

    var noteMessage = event.target.value;

    var newNote = {
      note_text: noteMessage,
      note_type: 'Manual',
      command: '',
      user_name: user.given_name,
      user_id: user.sub
    };

    addNoteToDB(newNote);

  }

  useEffect(() => loadUserData(user.sub), []);
  
  return (
  <Fragment>
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
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open
        })}>
        <div className={classes.drawerHeader} />
        {showResult && <Columns 
            addNote={noteAddedEvent} 
            notes={userNotes} 
            events={userEvents} 
            eventNotesBundle={userEventNotes} 
        />}
      </main>
    </div>
  
  </Fragment>
)};

export default Dashboardnew;