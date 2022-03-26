defmodule TriviaWeb.PageController do
  use TriviaWeb, :controller
  alias Trivia.Games
  alias Trivia.Games.Player

  def index(conn, _params) do
    games = Games.list_games()
    player_changeset = Games.new_player()
    room_changeset = Games.new_room()

    render(conn, "index.html", games: games, player_changeset: player_changeset, room_changeset: room_changeset)
  end
end
