import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from "@material-ui/core/Button";
import { newQuestion } from "../actions";
import { newRound } from "../actions";
import { showResults } from "../actions";

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: theme.spacing(3)
  },
  centeredText: {
    textAlign: 'center'
  },
  button: {
    marginTop: theme.spacing(3)
  }
}))

const Answered = ({ dispatch, channel, questions, current_question, player, answer, lead, rounds }) => {
  const classes = useStyles()
    let leadbool = false
    if (player.is_lead == undefined)
    {
      leadbool = lead
    } else
    {
      leadbool = player.is_lead
    }

    return (
      <Box className={classes.centeredText}>
      <Typography variant="h5" gutterBottom className={classes.title}>
        The correct answer was {current_question.correct_option}
      </Typography>
      <Typography variant="h5" gutterBottom className={classes.title}>
        {answer !== undefined && (
          <>
            You answered {answer}
          </>
        )}
        {answer == undefined && (
          <>
            You answered {player.answer}
          </>
        )}
        </Typography>
        {(leadbool && questions.length >= 2) && (
          <>
            <Button
              variant="contained"
              className={classes.button}
              onClick={() => dispatch(newQuestion(channel))}
            >
              Next Question
            </Button>
          </>
        )}

        {(!leadbool && questions.length >= 2) && (
          <Typography variant="body1">Waiting for next question...</Typography>
        )}

        {(leadbool && rounds > 1 && questions.length == 1) && (
          <>
            <Button
              variant="contained"
              className={classes.button}
              onClick={() => dispatch(newRound(channel))}
            >
              Next Round
            </Button>
          </>
        )}

        {(!leadbool && rounds > 1 && questions.length == 1) && (
          <Typography variant="body1">Waiting for next round...</Typography>
        )}

        {(leadbool && rounds == 1 && questions.length == 1) && (
          <>
            <Button
              variant="contained"
              className={classes.button}
              onClick={() => dispatch(showResults(channel))}
            >
              Show Results
            </Button>
          </>
        )}

        {(!leadbool && rounds == 1 && questions.length == 1) && (
          <Typography variant="body1">Waiting for the game results...</Typography>
        )}
      </Box>
    )
  }


function mapStateToProps(state) {
  const { channel, questions, current_question, player, answer, lead, rounds } = state

  return {
    channel,
    questions,
    current_question,
    player,
    answer,
    lead,
    rounds
  }
}

export default connect(mapStateToProps)(Answered)
