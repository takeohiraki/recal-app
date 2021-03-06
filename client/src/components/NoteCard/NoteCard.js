import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Moment from 'react-moment';
import { useDrag } from 'react-dnd';
import CancelIcon from '@material-ui/icons/Cancel'
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  card: {
    marginTop: '20px'
  },
  title: {
    fontSize: 14,
    marginBottom: 10
  },
  pos: {
    marginBottom: 12,
  },
  deleteIcon: {
    verticalAlign: 'top',
    cursor: 'Pointer'
  }
});

export default function SimpleCard(props) {
  const classes = useStyles();

  const [{isDragging}, drag] = useDrag({
    item: { note_id: props.id, note_text: props.message, type: 'NOTE_CARD' },
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
  });

  return (
    <div
    ref={drag}
    style={{
      opacity: isDragging ? 1 : 1,
      fontSize: 25,
      fontWeight: 'bold',
      cursor: 'move',
      }}
    >
      <Card className={classes.card}>
        <CardContent>
          <Grid
              justify="space-between" // Add it here :)
              container 
            >
            <Grid item>
              <Typography className={classes.title} variant="h5" component="h3">
                  #{props.message}
              </Typography>
            </Grid>
            <Grid item>
              <CancelIcon className={classes.deleteIcon}
              onClick={(e) => props.deleteNote(e, props.id)}></CancelIcon>
            </Grid>
          </Grid>
          <Typography variant="body2" component="p">
              Created on&nbsp;
              <Moment format="DD-MM-YYYY HH:mm A">
                {props.created}
              </Moment>
          </Typography>
        </CardContent>
        <CardActions>
        </CardActions>
      </Card>
    </div>
  );
}