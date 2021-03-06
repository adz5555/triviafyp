defmodule TriviaWeb.HostController do
  use TriviaWeb, :controller
  alias Trivia.Games

  def index(conn, %{"room_access_code" => access_code}) do
    host_token = get_session(conn, :host_token)

    case Games.get_room!(access_code) do
      [room] ->
        conn
        |> put_layout({TriviaWeb.LayoutView, "host.html"})
        |> render("index.html", access_code: access_code, host_token: host_token)
      [] ->
        conn
        |> put_flash(:error, "Something went wrong and room could not be found.")
        |> redirect(to: Routes.page_path(conn, :index))
      _ ->
        conn
        |> put_flash(:error, "Something went wrong and room could not be found.")
        |> redirect(to: Routes.page_path(conn, :index))
    end
  end
end
