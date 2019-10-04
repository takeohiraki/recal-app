import React, {
    Fragment,
    useState,
    useEffect
} from "react";

import clsx from "clsx";

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';

import {
    useAuth0
} from "../../src/react-auth0-spa";

import {
    makeStyles
} from '@material-ui/core/styles';

const useStyles = makeStyles({
    title: {
        fontSize: 18,
        textDecoration: 'underline'
    },
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
      },
      input: {
        marginLeft: 1,
        flex: 1,
      },
      iconButton: {
        padding: 10,
      },
      textField: {
        marginLeft: 1,
        marginRight: 1,
      },
      dense: {
        marginTop: 2,
      },
});

const Settings = () => {

    const classes = useStyles();

    return ( 
        <Fragment >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography className={classes.title} >
                        Require Agendas
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography>
                        Users must have a description for the meeting in or else you will auto-opt out.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                <FormControlLabel
                    value="Enabled"
                    control={<Checkbox color="primary" />}
                    label="Enabled"
                    labelPlacement="start"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography className={classes.title} >
                        Whitelist
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography>
                       These users don't need to have a meeting description in order to create a meeting with you.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
     
                </Grid>
            </Grid>

            <Paper className={classes.root}>
                    <InputBase
                        className={classes.input}
                        placeholder="Type an email..."
                        inputProps={{ 'aria-label': 'Type an email' }}
                    />
                    <IconButton className={classes.iconButton} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
                <TextField
                    id="outlined-dense"
                    label="Dense"
                    className={clsx(classes.textField, classes.dense)}
                    margin="dense"
                    variant="outlined"
                />

                <TextField
                  id="outlined-multiline-static"
                  label="Add Note"
                
                  className={classes.textField}
                  style={{ margin: 0, marginTop: 8 }}
                  margin="normal"
                  variant="outlined"

                />

        </Fragment>
    );

}

export default Settings;