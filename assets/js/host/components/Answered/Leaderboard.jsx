import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import LeaderboardItem from './LeaderboardItem'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  }
}))

const Leaderboard = ({ players }) => {
  const classes = useStyles()
  let position = 0;
  const player_items = players.sort(function (a, b) {
    return b.score - a.score;
  }).map(player => (
    position = position + 1,
    <LeaderboardItem player={player} key={player.id} position={position} />
  ))

  return (
    <Box className={classes.root}>
      {player_items}
    </Box>
  )
}

function mapStateToProps(state) {
  const { players } = state;
  return {
    players
  };
};

export default connect(mapStateToProps)(Leaderboard)
