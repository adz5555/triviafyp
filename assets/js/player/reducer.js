import { JOIN_ROOM, RECEIVE_ERROR, CATEGORY_SELECT, QUESTION_DISPLAY, ANSWER_DISPLAY, RESULTS_DISPLAY } from "./actions";

const initialState = {
  room: null,
  channel: null,
  player: {
    name: null,
    is_lead: null,
    score: 0
  },
  error: null,
  loading: true,
  scene: "game-start",
  categories: [],
  is_choosing: false,
  current_question: null
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case JOIN_ROOM:
      return {
        ...state,
        room: action.room,
        channel: action.channel,
        player: action.player,
        scene: action.scene,
        is_choosing: action.is_choosing,
        categories: action.categories,
        questions: action.questions,
        current_question: action.current_question,
        error: null,
        loading: false,
        rounds: action.rounds
      };
    case RECEIVE_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false
      };
    case CATEGORY_SELECT:
      return {
        ...state,
        scene: action.scene,
        is_choosing: action.is_choosing,
        categories: action.categories
      };
    case QUESTION_DISPLAY:
      return {
        ...state,
        scene: action.scene,
        current_question: action.current_question,
        answered: action.answered
      };
    case ANSWER_DISPLAY:
      return {
        ...state,
        scene: action.scene,
        questions: action.questions,
        current_question: action.current_question,
        player: action.newplayer,
        answer: action.answer,
        lead: action.lead,
        rounds: action.rounds
      };
      case RESULTS_DISPLAY:
        return {
          ...state,
          scene: action.scene,
          players: action.players,
          winners: action.winners,
          is_winner: action.is_winner,
          score: action.score
      };
    default:
      return state;
  }
};

export default reducer;
