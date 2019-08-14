import React, { Component } from "react";
import PropTypes from 'prop-types';

import ExternalApi from "../manual_triggers/ExternalApi.js";
import SeedCal from "../manual_triggers/SeedCal.js";
import SeedNotes from "../manual_triggers/SeedNotes.js";
import AddNote from "../manual_triggers/AddNote.js";
import AddSlackNote from "../manual_triggers/AddSlackNote.js";

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

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

    return (
        <div className={classes.root}>
          <ExternalApi />
          <SeedCal />
          <SeedNotes />
          <AddNote />
          <AddSlackNote />
          <Grid container spacing={3}>
            <Grid item xs>
              <Paper className={classes.paper}><div>Notes: {JSON.stringify(this.props.notes, null, 2)}</div></Paper>
            </Grid>
            <Grid item xs={9}>
              <Paper className={classes.paper}><div>Events: {JSON.stringify(this.props.events, null, 2)}</div></Paper>
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
