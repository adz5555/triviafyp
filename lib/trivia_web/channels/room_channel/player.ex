defmodule TriviaWeb.RoomChannel.Player do
  import Phoenix.Channel, only: [push: 3, broadcast!: 3]
  import Phoenix.Socket, only: [assign: 3]
  import Ecto.Query

  alias Trivia.Repo
  alias Trivia.Games.{Player, Room}
  alias Trivia.Content
  alias TriviaWeb.Presence

  def join(access_code, player_id, socket) do
    player =
      Repo.get(Player, player_id)
      |> Repo.preload(:room)

    if player.room.access_code === access_code do
      player_info = %{
        name: player.name,
        id: player.id,
        is_lead: Presence.list(socket) |> Enum.empty?,
        score: player.score,
        answered: player.answered,
        answer: player.answer
      }
      response = %{
        player: player_info,
        scene: player.room.current_scene,
        presences: Presence.list(socket),
        is_choosing: player.id == player.room.chooser_id,
        categories: player.room.category_choices || [],
        questions: player.room.questions || [],
        current_question: player.room.current_question || %{}
      }
      send(self(), {:after_player_join, player_info})
      {:ok, response, assign(socket, :room_id, player.room.id)}
    else
      {:error, %{reason: "Invalid session."}}
    end
  end

  # After a player joins the game, track their Presence
  def after_player_join(player, socket) do
    push(socket, "presence_state", Presence.list(socket))
    {:ok, _} = Presence.track(socket, "player:#{player.id}", %{
      name: player.name,
      id: player.id,
      is_lead: player.is_lead,
      online_at: inspect(System.system_time(:second)),
      type: "player"
    })
    {:noreply, socket}
  end

  # Player starts the game
  def start_game(_params, %{assigns: %{current_player_id: _player_id}} = socket) do
    chooser = set_chooser(socket)
    categories = set_choices(socket)

    response = %{
      scene: "select-category",
      chooser: chooser,
      categories: categories
    }

    send(self(), {:after_start_game, response})
    {:noreply, socket}
  end

  # After player starts the game
  def after_start_game(response, socket) do
    broadcast!(socket, "category_select", response)
    {:noreply, socket}
  end

  # Player selects a category
  def select_category(%{"category" => category}, %{assigns: %{current_player_id: _player_id}} = socket) do
    category_id = Content.get_category_by_name!(category).cat_id
    questions = get_questions(socket, category_id)
    current_question = set_current_question(socket, questions)
    players = getCurrentPlayers(socket)
    allanswered = checkAllPlayersAnswered(socket)

    response = %{
      scene: "answering",
      category: category,
      questions: questions,
      current_question: current_question,
      players: players,
      allanswered: allanswered
    }

    send(self(), {:after_select_category, response})
    {:noreply, socket}
  end

  def after_select_category(response, socket) do
    broadcast!(socket, "question_display", response)
    {:noreply, socket}
  end

  # Player answers a question
  def select_option(%{"selected" => selected}, %{assigns: %{current_player_id: _player_id}} = socket) do
    checkAnswer(socket, selected)
    questions = getQuestionData(socket)
    current_question = getCurrentQuestionData(socket)
    players = getCurrentPlayers(socket)
    allanswered = checkAllPlayersAnswered(socket)

    if allanswered === false do
      response = %{
        scene: "answering",
        questions: questions,
        current_question: current_question,
        players: players,
        allanswered: allanswered
      }

      send(self(), {:after_select_option_waiting, response})
      {:noreply, socket}
    else
      questionAnswered(socket)

      response = %{
        scene: "answered",
        questions: questions,
        current_question: current_question,
        players: players
      }

      send(self(), {:after_select_option_done, response})
      {:noreply, socket}
      end
  end

  def after_select_option_waiting(response, socket) do
    broadcast!(socket, "question_display", response)
    {:noreply, socket}
  end

  def after_select_option_done(response, socket) do
    broadcast!(socket, "answer_display", response)
    {:noreply, socket}
  end

  # Select a random player to be the designated "chooser"
  defp set_chooser(%{assigns: %{room_id: room_id}} = socket) do
    chooser =
      Presence.list(socket)
      |> pick_random_online_player

    Room
    |> Repo.get(room_id)
    |> Room.changeset(%{current_scene: "select-category", chooser_id: chooser.id})
    |> Repo.update

    chooser
  end

  defp set_choices(%{assigns: %{room_id: room_id}}) do
    categories = Content.pick_random_categories

    Room
    |> Repo.get(room_id)
    |> Room.changeset(%{category_choices: categories})
    |> Repo.update

    categories
  end

  defp get_questions(%{assigns: %{room_id: room_id}}, category_id) do
    questions = Content.pick_random_questions(room_id, category_id)

    Room
    |> Repo.get(room_id)
    |> Room.changeset(%{current_scene: "answering"})
    |> Repo.update

    questions
  end

  defp set_current_question(%{assigns: %{room_id: room_id}}, questions) do
    current_question = Content.get_random_question(questions)

    Room
    |> Repo.get(room_id)
    |> Room.changeset(%{current_question: current_question})
    |> Repo.update

    current_question
  end

  defp checkAnswer(%{assigns: %{room_id: room_id, current_player_id: player_id}}, selected) do
    Repo.all(from r in Room, where: r.id == ^room_id, select: r.current_question)
    |> Content.getCurrentAnswer()
    |> Content.checkAnswer(player_id, selected)
  end

  defp getQuestionData(%{assigns: %{room_id: room_id, current_player_id: player_id}}) do
  player =
    Repo.get(Player, player_id)
    |> Repo.preload(:room)

    player.room.questions
  end

  defp getCurrentQuestionData(%{assigns: %{room_id: room_id, current_player_id: player_id}}) do
  player =
    Repo.get(Player, player_id)
    |> Repo.preload(:room)

    player.room.current_question
  end

  defp getCurrentPlayer(%{assigns: %{room_id: room_id, current_player_id: player_id}}) do
    Repo.get(Player, player_id)
  end

  defp getCurrentPlayers(%{assigns: %{room_id: room_id, current_player_id: player_id}}) do
    query =
      from p in Player,
      select: %{id: p.id, name: p.name, score: p.score, answered: p.answered, answer: p.answer},
      where: p.room_id == ^room_id

    Repo.all(query)
  end

  defp checkAllPlayersAnswered(%{assigns: %{room_id: room_id, current_player_id: player_id}}) do
    query =
      from p in Player,
      select: p.answered,
      where: p.room_id == ^room_id

    try do
     for x <- Repo.all(query) do
      if x === true do
        true
      else
        throw(:break)
      end
     end
    catch
     :break -> false
    end
  end

  defp questionAnswered(%{assigns: %{room_id: room_id}}) do
    Room
    |> Repo.get(room_id)
    |> Room.changeset(%{current_scene: "answered"})
    |> Repo.update
  end

  # Returns a random presence
  defp pick_random_online_player(presences) do
    {_, %{metas: [player]}} = Enum.random(presences)
    random_player?(presences, player)
  end

  # Validate that the randomly selected presence is a player
  defp random_player?(_presences, %{type: "player"} = player), do: player
  defp random_player?(presences, %{type: "audience"}) do
    pick_random_online_player(presences)
  end
end
