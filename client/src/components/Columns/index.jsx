import React, { Fragment, Component } from "react";
import PropTypes from 'prop-types';
import Moment from "moment";

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
//import Moment from 'react-moment';


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
  },
  eventDayTitle: 
  {
    fontSize: 25,
    textDecoration: 'underline',
    marginTop: 20
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
        {
          Array.from(this.props.notes).map(note =>
          {
              return <NoteCard 
              key={ note.id } 
              id={ note.id } 
              message={ note.note_text } 
              created={ note.createdAt }
              username={ note.user_name }
              deleteNote={ this.props.deleteNote }
              ></NoteCard>
          })
        }
      </div>
    }

    if(this.props.events)
    {
      let previousDay_Month_Year = "";
      EventCards = 
      <div>
        {
          Array.from(this.props.events).map(event =>
          {
              var event_note_ids = this.props.eventNotesBundle.eventNotes.filter(en => { return en.event_id == event.id }).map(en => { return en.note_id });
              var event_notes = this.props.eventNotesBundle.notes.filter(n => { 
                return event_note_ids.indexOf(n.id) > -1 
              });

              var eventDayTitleText = '';
              let eventDate = new Date(event.event_start);
              let today = new Date();
              let tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              let  currentDay_Month_Year = eventDate.getDate() + "__" + eventDate.getMonth() + "__" + eventDate.getYear();

              if(eventDate.getDate() == today.getDate()
              && eventDate.getMonth() == today.getMonth()
              && eventDate.getYear() == today.getYear())
              {
                eventDayTitleText = "Today"
              }
              else if(eventDate.getDate() == tomorrow.getDate()
              && eventDate.getMonth() == tomorrow.getMonth()
              && eventDate.getYear() == tomorrow.getYear())
              {
                eventDayTitleText = "Tomorrow"
              }
              else
              {
                eventDayTitleText = eventDate.toDateString();
              }

              var EventFragment = <Fragment key={event.id}>
                {(currentDay_Month_Year != previousDay_Month_Year) && <Typography className={classes.eventDayTitle}>
                  { eventDayTitleText /*+ '(' + eventDate.toDateString() + ')'*/} 
                </Typography>}
                <EventCard 
                key={event.id}
                event_id={event.id}
                title={event.event_title}
                desc={event.event_description}
                created={ event.event_created_at }
                creator={ event.creator_email }
                startDt={ event.event_start }
                endDt={ event.event_end }
                attendees={ JSON.parse(event.event_attendees) }
                notes={ event_notes }
                addNoteToEvent= { this.props.addNoteToEvent }
              ></EventCard></Fragment>

              previousDay_Month_Year = eventDate.getDate() + "__" + eventDate.getMonth() + "__" + eventDate.getYear();
              
              return EventFragment;
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
                <Typography className={classes.cardTitles}>
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

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles) (Content);
