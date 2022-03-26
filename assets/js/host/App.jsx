import React, { Component } from 'react'
import { compose } from "redux";
import { connect } from 'react-redux'
import Grid from "@material-ui/core/Grid";

import { joinRoom } from './actions'
import { RoomCode } from "./components/Layout"

import GameStart from './scenes/GameStart'
import SelectCategory from "./scenes/SelectCategory";
import Answering from "./scenes/Answering";
import Loading from '../common/Loading'
import Switch from "../common/Switch";

class App extends Component {
  componentDidMount() {
    const { dispatch, socket, room_id } = this.props
    socket.connect()
    dispatch(joinRoom(socket, room_id))
  }

  render() {
    const { loading, room_id } = this.props;

    if (loading) {
      return (
        <Loading />
      )
    }

    return (
      <Grid container>
        <Switch>
          <GameStart scene="game-start" />
          <SelectCategory scene="select-category" />
          <Answering scene="answering" />
          {/* TODO: voting */}
          {/* TODO: leaderboard */}
          {/* TODO: game-end */}
        </Switch>
        <RoomCode room_id={room_id} />
      </Grid>
    )
  }
}

function mapStateToProps(state) {
  const { loading } = state

  return {
    loading
  }
}

export default compose(connect(mapStateToProps))(App);
