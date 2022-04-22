import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: theme.spacing(3)
  },
  centered: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: 'center',
    overflow: "auto",
    flexDirection: "column"
  },
  button: {
    margin: "10px 0"
  }
}))

const Results = ({ dispatch, channel, players, winners, is_winner, score }) => {
  const classes = useStyles()

  const winners_list = winners.map(function(winner) {
    return <p key={winner.id}>{winner.name}</p>
  })

    return (
      <Box className={classes.centered}>
        {(is_winner && winners.length == 1) && (
          <>
            <Card sx={{ maxWidth: 345 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image="/images/cards/winner.jpg"
                  alt="winner"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    🎉 Congratulations - You Won! 🎉
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You won the game of trivia with {score}/25
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </>
        )}
        {(winners.length > 1) && (
          <>
            <Card sx={{ maxWidth: 345 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image="/images/cards/tie.jpg"
                  alt="winner"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    We Have A Tie!
                  </Typography>
                  <Typography component={'span'} variant="body2">
                    The following players won the game with {score}/25
                    {winners_list}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </>
        )}
        {!is_winner && (
          <>
          <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image="/images/cards/loser.jpg"
                alt="winner"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Commiserations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Unfortunately your score of {score}/25 wasn't enough to beat your opposition this time
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          </>
        )}
        <Button
          variant="contained"
          className={classes.button}
          onClick={event =>  window.location.href='http://trivia.amains.software'}
        >
          Return to Homepage
        </Button>
      </Box>
    )
  }


function mapStateToProps(state) {
  const { channel, questions, players, winners, is_winner, score } = state

  return {
    channel,
    players,
    winners,
    is_winner,
    score
  }
}

export default connect(mapStateToProps)(Results)
