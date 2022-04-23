export const JOIN_ROOM = "JOIN_ROOM";
export const RECEIVE_ERROR = "RECEIVE_ERROR";

export const CATEGORY_SELECT = "CATEGORY_SELECT";
export const QUESTION_DISPLAY = "QUESTION_DISPLAY";
export const ANSWER_DISPLAY = "ANSWER_DISPLAY";
export const RESULTS_DISPLAY = "RESULTS_DISPLAY";

export const START_GAME = "START_GAME";
export const SELECT_CATEGORY = "SELECT_CATEGORY";
export const WAITING = "WAITING";
export const NEXT_QUESTION = "NEXT_QUESTION";
export const NEXT_ROUND = "NEXT_ROUND";
export const SHOW_RESULTS = "SHOW_RESULTS";

export const joinRoom = (socket, room_id) => {
  return dispatch => {
    const channel = socket.channel(`room:${room_id}`, {});

    channel
      .join()
      .receive("ok", ({ player, scene, is_choosing, categories, questions, current_question, rounds }) => {
        dispatch({
          type: JOIN_ROOM,
          room: room_id,
          channel,
          player,
          scene,
          is_choosing,
          categories,
          questions,
          current_question,
          rounds
        });
        setupGameEvents(channel, dispatch, player);
      })
      .receive("error", ({ reason }) => {
        dispatch({
          type: RECEIVE_ERROR,
          error: reason
        });
      });
  };
};

export const selectCategory = (channel, category) => {
  channel.push('select_category', {category})

  return {
    type: SELECT_CATEGORY
  }
}

export const selectOption = (channel, selected) => {
  channel.push('select_option', {selected})

  return {
    type: WAITING
  }
}

export const startGame = channel => {
  channel.push("start_game", {});

  return {
    type: START_GAME
  };
};

export const newQuestion = channel => {
  channel.push("next_question", {});

  return {
    type: NEXT_QUESTION
  };
};

export const newRound = channel => {
  channel.push("next_round", {});

  return {
    type: NEXT_ROUND
  };
};

export const showResults = channel => {
  channel.push("show_results", {});

  return {
    type: SHOW_RESULTS
  };
};

const setupGameEvents = (channel, dispatch, player) => {
  channel.on("category_select", ({ scene, chooser, categories }) => {
    let is_choosing = player.id == chooser.id

    dispatch({
      type: CATEGORY_SELECT,
      scene,
      is_choosing,
      categories
    });
  });

  channel.on("question_display", ({ allanswered, scene, questions, current_question, players }) => {
    let answered = players.filter(playerobj => (
      player.id == playerobj.id
    )).some(function(playerobj) {
        if (playerobj.answered === true) {
            return true;
        }
        else {
          return false;
        }
    });

    dispatch({
      type: QUESTION_DISPLAY,
      scene,
      allanswered,
      players,
      answered,
      questions,
      current_question
    });
  });

  channel.on("answer_display", ({ scene, questions, current_question, players, rounds }) => {
    let answer = players.filter(playerobj => (
      player.id == playerobj.id
    )).map(function(playerobj) {
      return playerobj.answer;
    });

    let lead = player.is_lead

    let newplayer = players.filter(playerobj => (
      player.id == playerobj.id
    ))

    dispatch({
      type: ANSWER_DISPLAY,
      scene,
      questions,
      current_question,
      answer,
      newplayer,
      lead,
      rounds
    });
  });

  channel.on("results_display", ({ scene, players, winners }) => {
    let is_winner = winners.some(function(winner) {
      return winner.id == player.id;
    });

    let score = players.filter(playerobj => (
      player.id == playerobj.id
    )).map(function(playerobj) {
      return playerobj.score;
    });

    dispatch({
      type: RESULTS_DISPLAY,
      scene,
      players,
      winners,
      is_winner,
      score
    });
  });
};
