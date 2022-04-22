defmodule TriviaWeb.RoomChannel do
  use TriviaWeb, :channel
  import TriviaWeb.RoomChannel.MessagesHandler
  alias TriviaWeb.RoomChannel.{Host, Player}

  # Player joins the game
  def join("room:" <> access_code, _params, %{assigns: %{current_player_id: player_id}} = socket),
    do: Player.join(access_code, player_id, socket)

  # Host joins the game
  def join("room:" <> access_code, _params, %{assigns: %{current_host_id: _host_id}} = socket),
    do: Host.join(access_code, socket)

  # Refuse all other attempts to join
  def join(_room, _params, _socket),
    do: {:error, %{reason: "Invalid session."}}

  handle_incoming [
    :start_game,
    :select_category,
    :select_option,
    :next_question,
    :next_round,
    :show_results
  ], with_module: Player

  handle_broadcasts [
    :after_player_join,
    :after_start_game,
    :after_select_category,
    :after_select_option_waiting,
    :after_select_option_done,
    :after_next_question,
    :after_next_round,
    :after_show_results
  ], with_module: Player
end
