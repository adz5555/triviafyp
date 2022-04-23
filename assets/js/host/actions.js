import { Presence } from 'phoenix'

// Connectivity-related events
export const JOIN_ROOM = 'JOIN_ROOM'
export const RECEIVE_ERROR = 'RECEIVE_ERROR'
export const UPDATE_PARTICIPANTS = 'UPDATE_PARTICIPANTS'

// Game events
export const CATEGORY_SELECT = 'CATEGORY_SELECT'
export const QUESTION_DISPLAY = 'QUESTION_DISPLAY'
export const ANSWER_DISPLAY = 'ANSWER_DISPLAY'

export const joinRoom = (socket, room_id) => {
  return dispatch => {
    const channel = socket.channel(`room:${room_id}`, {})
    let presences = {}

    channel.join()
      .receive('ok', ({ scene, chooser, categories, questions, current_question, ...response }) => {
        const { players } = sortPresentUsers(response.presences)

        dispatch({
          type: JOIN_ROOM,
          room: room_id,
          players,
          channel,
          scene,
          chooser,
          categories,
          questions,
          current_question
        })

        setupPresenceEvents(channel, dispatch, presences)
        setupGameEvents(channel, dispatch)
      })
      .receive('error', ({ reason }) => {
        dispatch({
          type: RECEIVE_ERROR,
          error: reason
        })
      })
  }
}

const setupPresenceEvents = (channel, dispatch, presences) => {
  channel.on('presence_state', response => {
    presences = Presence.syncState(presences, response)
    syncPresentUsers(dispatch, presences)
  })

  channel.on('presence_diff', response => {
    presences = Presence.syncDiff(presences, response)
    syncPresentUsers(dispatch, presences)
  })
}

const setupGameEvents = (channel, dispatch) => {
  channel.on('category_select', ({ scene, chooser, categories }) => {
    dispatch({
      type: CATEGORY_SELECT,
      scene,
      chooser,
      categories
    });
  });

  channel.on("question_display", ({ scene, category, questions, current_question }) => {
    dispatch({
      type: QUESTION_DISPLAY,
      scene,
      category,
      questions,
      current_question
    });
  });

  channel.on("answer_display", ({ scene, questions, current_question, players }) => {
    dispatch({
      type: ANSWER_DISPLAY,
      scene,
      questions,
      current_question,
      players
    });
  });
}

const sortPresentUsers = (presences) => {
  const players = []

  Presence.list(presences).map(p => {
    const participant = p.metas[0]
    players.push(participant)
  })

  // Sort by the online_at timestamp
  players.sort((x, y) => (
    x.online_at - y.online_at
  ))

  return {
    players
  }
}

const syncPresentUsers = (dispatch, presences) => {
  const { players } = sortPresentUsers(presences)

  dispatch({
    type: UPDATE_PARTICIPANTS,
    players
  })
}
