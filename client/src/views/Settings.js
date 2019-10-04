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
import MaterialTable from 'material-table';

import {
    useAuth0
} from "../../src/react-auth0-spa";

import {
    makeStyles
} from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    title: {
        fontSize: 18,
        textDecoration: 'underline'
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    root: {
        flex: 1,
        padding :'2px 4px',
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
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 800
    },
    dense: {
        marginTop: theme.spacing(2),
    }
}));

const Settings = () => {

    const classes = useStyles();

    const [state, setState] = React.useState({
        columns: [
          { title: 'Name', field: 'name' },
          { title: 'Surname', field: 'surname' },
          { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
          {
            title: 'Birth Place',
            field: 'birthCity',
            lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
          },
        ],
        data: [
          { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
          {
            name: 'Zerya Betül',
            surname: 'Baran',
            birthYear: 2017,
            birthCity: 34,
          },
        ],
      });

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
                    <Paper className={classes.root}>
                        <InputBase
                            id="outlined-multiline-static"
                            label="Add Note"
                            multiline
                            className={classes.textField}      
                            placeholder="Type an email..."
                            inputProps={{ 'aria-label': 'Type an email' }}
                        />
                        <IconButton className={classes.iconButton} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                <MaterialTable
                        title="Editable Example"
                        columns={state.columns}
                        data={state.data}
                        editable={{
                            onRowAdd: newData =>
                            new Promise(resolve => {
                                setTimeout(() => {
                                resolve();
                                const data = [...state.data];
                                data.push(newData);
                                setState({ ...state, data });
                                }, 600);
                            }),
                            onRowUpdate: (newData, oldData) =>
                            new Promise(resolve => {
                                setTimeout(() => {
                                resolve();
                                const data = [...state.data];
                                data[data.indexOf(oldData)] = newData;
                                setState({ ...state, data });
                                }, 600);
                            }),
                            onRowDelete: oldData =>
                            new Promise(resolve => {
                                setTimeout(() => {
                                resolve();
                                const data = [...state.data];
                                data.splice(data.indexOf(oldData), 1);
                                setState({ ...state, data });
                                }, 600);
                            }),
                        }}
                    />
                </Grid>
            </Grid>
  
        </Fragment>
    );

}

export default Settings;