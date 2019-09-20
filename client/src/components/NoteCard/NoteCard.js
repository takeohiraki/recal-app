import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Moment from 'react-moment';
import { useDrag } from 'react-dnd';

const useStyles = makeStyles({
  card: {
    minWidth: 275,
    marginTop: '20px'
  },
  title: {
    fontSize: 14,
    marginBottom: 10
  },
  pos: {
    marginBottom: 12,
  },
});

export default function SimpleCard(props) {
  const classes = useStyles();

  const [{isDragging}, drag] = useDrag({
    item: { type: 'NOTE_CARD' },
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
  });

  console.log(props);

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
          <Typography  className={classes.title} variant="h5" component="h3">
              #{props.message}
          </Typography>
          <Typography variant="body2" component="p">
              Created on&nbsp;
              <Moment format="DD-MM-YYYY HH:mm A">
                {props.created}
              </Moment>
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </div>
  );
}