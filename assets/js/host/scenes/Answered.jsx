import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography'

import Leaderboard from '../components/Answered/Leaderboard'

const useStyles = makeStyles(theme => ({
  centerText: {
    textAlign: "center",
    paddingTop: theme.spacing(6)
  }
}))

const Answered = ({ dispatch, channel, questions, current_question, players }) => {
    const classes = useStyles();
    return (
      <Grid item className={classes.centerText} xs={12}>
        <Typography variant="h4" gutterBottom>
          Current Leaderboard
        </Typography>
        <Grid
          container
          justify="center"
          alignItems="flex-start"
        >
          <Grid item xs={8} sm={6} md={5} lg={4}>
            <Leaderboard />
          </Grid>
        </Grid>
      </Grid>
    );
  }


function mapStateToProps(state) {
  const { questions, current_question, players } = state;

  return {
    questions,
    current_question,
    players
  };
};

export default connect(mapStateToProps)(Answered)
