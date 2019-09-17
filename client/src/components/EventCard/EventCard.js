import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Moment from 'react-moment';

const useStyles = makeStyles({
  card: {
    minWidth: 275,
    marginTop: '20px'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  cardTitles: {
    fontSize: 14,
    textDecoration: 'underline'
  },
  pos: {
    marginBottom: 12,
  },
  titleGrid:
  {
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 207, 204, 0.89)',
    marginBottom: 10
  }
});

export default function SimpleCard(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.card}>
      <CardContent>
      <Grid className={classes.titleGrid} container direction="row" justify="space-between" alignItems="flex-start" spacing={3}>
        <Grid item xs={9}>
          <Typography variant="h5" component="h3">
              { props.title }
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h5" component="h3">
            <Moment format="HH:mm">
              { props.startDt }
            </Moment>
             - 
            <Moment format="HH:mm">
              { props.endDt }
            </Moment>
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={9}>
          <Typography className={classes.cardTitles} >
            Agenda & Notes
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography className={classes.cardTitles}>
            Attendees
          </Typography>
          <ul>
            <li>Coffee</li>
            <li>Tea</li>
            <li>Milk</li>
          </ul>
        </Grid>
      </Grid>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}