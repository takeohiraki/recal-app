import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import NoteCard from '../NoteCard/NoteCard'
import EventCard from '../EventCard/EventCard'
import "./style.css";

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
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
              return <EventCard></EventCard>
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
        
                {NoteCards}
 
            </Grid>
            <Grid item xs={9}>
            
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
