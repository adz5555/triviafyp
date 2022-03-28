import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Option from '../components/Answering/Option'

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: theme.spacing(3)
  },
  centeredText: {
    textAlign: 'center'
  },
  button: {
    width: '100%',
    marginBottom: theme.spacing(2),
  }
}))

const Answering = ({ players, answered, dispatch, channel, current_question }) => {
  const classes = useStyles()

    const option_list = current_question.options.map((option, index) => (
      <Option option={option} index={index} key={option} dispatch={dispatch} channel={channel} />
    ))
    return (
      <Box className={classes.centeredText}>
      {!answered && (
        <>
          <Typography variant="h5" gutterBottom className={classes.title}>
            {current_question.prompt}
          </Typography>
          {option_list}
        </>
      )}

      {answered && (
        <Typography variant="body1">Waiting for other players to answer...</Typography>
      )}
      </Box>
    )
  }


function mapStateToProps(state) {
  const { channel, current_question } = state

  return {
    channel,
    current_question
  }
}

export default connect(mapStateToProps)(Answering)
