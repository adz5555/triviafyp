import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: theme.spacing(3)
  },
  centeredText: {
    textAlign: 'center'
  }
}))

const Answered = ({ dispatch, channel, current_question, player, answer }) => {
  const classes = useStyles()

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
      </Box>
    )
  }


function mapStateToProps(state) {
  const { channel, current_question, player, answer } = state

  return {
    channel,
    current_question,
    player,
    answer
  }
}

export default connect(mapStateToProps)(Answered)
