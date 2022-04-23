import {
  JOIN_ROOM,
  RECEIVE_ERROR,
  UPDATE_PARTICIPANTS,
  CATEGORY_SELECT,
  QUESTION_DISPLAY,
  ANSWER_DISPLAY
} from './actions'

const initialState = {
  players: [],
  room: null,
  channel: null,
  error: null,
  loading: true,
  scene: "game-start",
  chooser: {
    name: null,
    id: null
  },
  categories: [],
  current_question: null
}

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case JOIN_ROOM:
      return {
        ...state,
        room: action.room,
        channel: action.channel,
        players: action.players,
        scene: action.scene,
        chooser:  action.chooser,
        categories: action.categories,
        current_question: action.current_question,
        error: null,
        loading: false
      }
    case UPDATE_PARTICIPANTS:
      return {
        ...state,
        players: action.players,
        error: null
      }
    case RECEIVE_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false
      }
    case CATEGORY_SELECT:
      return {
        ...state,
        scene: action.scene,
        chooser: action.chooser,
        categories: action.categories
      }
    case QUESTION_DISPLAY:
      return {
        ...state,
        scene: action.scene,
        current_question: action.current_question
      };
    case ANSWER_DISPLAY:
      return {
        ...state,
        scene: action.scene,
        questions: action.questions,
        current_question: action.current_question,
        players: action.players
    };
    default:
      return state
  }
}

export default reducer
