import React, { Component } from "react";
import PropTypes from 'prop-types';

import ExternalApi from "../manual_triggers/ExternalApi.js";
import SeedCal from "../manual_triggers/SeedCal.js";
import SeedNotes from "../manual_triggers/SeedNotes.js";
import AddNote from "../manual_triggers/AddNote.js";
import AddSlackNote from "../manual_triggers/AddSlackNote.js";

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import NoteCard from '../NoteCard/NoteCard'
import EventCard from '../EventCard/EventCard'
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import "./style.css";

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  button: {
    margin: '10px 0px 0px 0px',
    marginLeft: "auto",
    marginRight: -12
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  iconSmall: {
    fontSize: 20,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  }
});

class Content extends Component {

  render() {
    
    const { classes } = this.props;

    let NoteCards = null;
    let EventCards = null;  

    if(this.props.notes)
    {
      NoteCards = 
      <div>
        <Typography></Typography>
        {
          Array.from(this.props.notes).map(note =>
          {
              console.log(note);
              return <NoteCard 
              key={ note.id } 
              message={ note.note_text } 
              created={ note.createdAt }
              username={ note.user_name }
              ></NoteCard>
          })
        }
      </div>
    }

    if(this.props.events)
    {
      EventCards = 
      <div>
        {
          Array.from(this.props.events).map(event =>
          {
              return <EventCard 
              key={event.id}
              title={event.event_title}
              desc={event.event_description}
              created={ event.event_created_at }
              creator={ event.creator_email }
              startDt={ event.event_start }
              endDt={ event.event_end }
              attendees={ JSON.parse(event.event_attendees) }
              ></EventCard>
          })
        }
      </div>
    }

    //<Paper className={classes.paper}>{NoteCards}<div>Notes: {JSON.stringify(this.props.notes, null, 2)}</div></Paper>
    //<Paper className={classes.paper}><div>Events: {JSON.stringify(this.props.events, null, 2)}</div></Paper>

    return (
        <div className={classes.root}>
        
          <Grid container spacing={3}>
            <Grid item xs={3}>
                <Typography variant="h4" gutterBottom>
                  Your Notes
                </Typography>
                <TextField
                  id="outlined-multiline-static"
                  label="Add Note"
                  multiline
                  rows="4"
                  className={classes.textField}
                  style={{ margin: 0, marginTop: 8 }}
                  margin="normal"
                  variant="outlined"
                  fullWidth
                  onKeyUp={this.props.addNote}
                />
                {NoteCards} 
 
            </Grid>
            <Grid item xs={9}>
                <Typography variant="h4" gutterBottom>
                  Meetings
                </Typography>
                {EventCards}
  
            </Grid>
          </Grid>
        </div>
    );
  }
}

/*  <ExternalApi />
          <SeedCal />
          <SeedNotes />
          <AddNote />
          <AddSlackNote />
          */

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles) (Content);
