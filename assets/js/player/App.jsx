import React, { Component } from "react";
import { connect } from "react-redux";

import { joinRoom } from "./actions";
import GameStart from "./scenes/GameStart";
import SelectCategory from "./scenes/SelectCategory";
import Answering from "./scenes/Answering";
import Answered from "./scenes/Answered";
import Results from "./scenes/Results";
import Loading from "../common/Loading";
import Switch from "../common/Switch";

class App extends Component {
  componentDidMount() {
    const { dispatch, socket, room_id } = this.props;
    socket.connect();
    dispatch(joinRoom(socket, room_id));
  }

  render() {
    const { loading } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Switch>
        <GameStart scene="game-start" />
        <SelectCategory scene="select-category" />
        <Answering scene="answering" />
        <Answered scene="answered" />
        <Results scene="results" />
      </Switch>
    );
  }
}

function mapStateToProps(state) {
  const { loading } = state;

  return {
    loading
  };
}

export default connect(mapStateToProps)(App);
