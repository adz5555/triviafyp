export const JOIN_ROOM = "JOIN_ROOM";
export const RECEIVE_ERROR = "RECEIVE_ERROR";

export const CATEGORY_SELECT = "CATEGORY_SELECT";
export const QUESTION_DISPLAY = "QUESTION_DISPLAY";
export const ANSWER_DISPLAY = "ANSWER_DISPLAY";

export const START_GAME = "START_GAME";
export const SELECT_CATEGORY = "SELECT_CATEGORY";
export const WAITING = "WAITING";

export const joinRoom = (socket, room_id) => {
  return dispatch => {
    const channel = socket.channel(`room:${room_id}`, {});

    channel
      .join()
      .receive("ok", ({ player, scene, is_choosing, categories, questions, current_question }) => {
        dispatch({
          type: JOIN_ROOM,
          room: room_id,
          channel,
          player,
          scene,
          is_choosing,
          categories,
          questions,
          current_question
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

const setupGameEvents = (channel, dispatch, player) => {
  channel.on("category_select", ({ scene, chooser, categories }) => {
    const is_choosing = player.id == chooser.id

    dispatch({
      type: CATEGORY_SELECT,
      scene,
      is_choosing,
      categories
    });
  });

  channel.on("question_display", ({ allanswered, scene, category, questions, current_question, players }) => {
    const answered = players.filter(playerobj => (
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
      category,
      questions,
      current_question
    });
  });

  channel.on("answer_display", ({ scene, category, questions, current_question, players_answer }) => {
    dispatch({
      type: ANSWER_DISPLAY,
      scene,
      category,
      questions,
      current_question,
      players_answer
    });
  });
};
