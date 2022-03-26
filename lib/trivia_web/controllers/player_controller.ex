defmodule TriviaWeb.PlayerController do
  use TriviaWeb, :controller
  alias Trivia.Games
  alias Trivia.Games.Player

  def create(conn, %{"player" => %{"name" => name, "access_code" => access_code}}) do
    attrs = %{name: name, access_code: String.upcase(access_code)}

    case Games.create_player_or_full(attrs) do
      {:ok, %Player{} = player} ->
        token = Phoenix.Token.sign(conn, "player token", player.id)
        conn
        |> put_session(:player_token, token)
        |> redirect(to: Routes.room_play_path(conn, :show, access_code))

      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_view(TriviaWeb.PageView)
        |> render("index.html", games: Games.list_games(), player_changeset: changeset, room_changeset: Games.new_room())
      nil ->
        conn
        |> put_flash(:error, "This Game is Full")
        |> redirect(to: Routes.page_path(conn, :index))
    end
  end

  def show(conn, %{"room_access_code" => access_code}) do
     token = get_session(conn, :player_token)

     conn
     |> put_layout({TriviaWeb.LayoutView, "player.html"})
     |> render("show.html", player_token: token, access_code: access_code)
  end
end
