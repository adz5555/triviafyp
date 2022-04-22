import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
}))

const LeaderboardItem = ({ player, position }) => {
  const classes = useStyles()
  let backcolour = '#fff';

  if (position == 1)
  {
    backcolour = '#FFD700'
  } else if (position == 2)
  {
    backcolour = '#C0C0C0'
  } else if (position == 3)
  {
    backcolour = '#CD7F32'
  }

  return (
    <Paper variant="outlined" className={classes.root} style={{background: backcolour}}>
      <Typography variant="h4">
        {player.name} | {player.score}
      </Typography>
    </Paper>
  )
}

export default LeaderboardItem
