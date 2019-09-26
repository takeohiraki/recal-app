import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Moment from 'react-moment';
import CancelIcon from '@material-ui/icons/Cancel'
import CheckIcon from '@material-ui/icons/Check'
import EmailIcon from '@material-ui/icons/Help'


import { useDrop } from 'react-dnd'

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

	const [{ isOver }, drop] = useDrop({
    accept: "NOTE_CARD",
    canDrop: () => { 
      return true; 
    },
		drop: (item) => {
      props.addNoteToEvent(item.note_id, props.event_id);
      console.log('Dropped note ' + item.note_id + ' into event ' + props.event_id);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    })
	})

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
            <Moment format="HH:mm A">
              { props.startDt }
            </Moment>
            &nbsp;-&nbsp;
            <Moment format="HH:mm A">
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
          {
            props.notes.map((item, index) => (
              <div key={item.id}>{item.note_text}</div>
            ))
          }
          <div
            ref={drop}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
          {isOver && (
            <div
              style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              zIndex: 1,
              opacity: 0.5,
              backgroundColor: 'yellow',
              padding: '10px'
              }}
              >Add note to this event...</div>
            )}
          </div>
        </Grid>
        <Grid item xs={3}>
          <Typography className={classes.cardTitles}>
            Attendees
          </Typography>
          <ul>
            {
              props.attendees.map((item, index) => (
                <li key={item.email}>
                  {(item.responseStatus == 'accepted') && <CheckIcon></CheckIcon>}
                  {(item.responseStatus == 'needsAction') && <EmailIcon></EmailIcon>}
                  {(item.responseStatus == 'rejected') && <CancelIcon></CancelIcon>}
                  {item.email}
                </li>
              ))
            }
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