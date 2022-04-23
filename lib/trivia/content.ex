defmodule Trivia.Content do
  @moduledoc """
  The Content context.
  """

  import Ecto.Query, warn: false
  alias Trivia.Repo

  alias Trivia.Games.Room
  alias Trivia.Games.Player

  alias Trivia.Content.Category
  alias Trivia.Content.Question

  @doc """
  Returns the list of categories.

  ## Examples

      iex> list_categories()
      [%Category{}, ...]

  """
  def list_categories do
    Repo.all(Category)
  end

  @doc """
  Gets a single category.

  Raises `Ecto.NoResultsError` if the Category does not exist.

  ## Examples

      iex> get_category!(123)
      %Category{}

      iex> get_category!(456)
      ** (Ecto.NoResultsError)

  """
  def get_category!(id), do: Repo.get!(Category, id)

  def get_category_by_name!(name) do
    Category
    |> Repo.get_by!(name: name)
  end

  @doc """
  Creates a category.

  ## Examples

      iex> create_category(%{field: value})
      {:ok, %Category{}}

      iex> create_category(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_category(attrs \\ %{}) do
    %Category{}
    |> Category.changeset(attrs)
    |> Repo.insert()
  end

  def pick_random_categories() do
    query =
      from c in Category,
      select: c.name,
      order_by: fragment("RANDOM()"),
      limit: 5

    Repo.all(query)
  end

  def getCurrentAnswer(current_question) do
    Enum.map(current_question, fn question ->
      question["correct_option"];
    end)
  end

  def checkAnswer(current_answer, player_id, selected) do
    cond do
     selected == Enum.at(current_answer, 0) ->
      incrementPlayerScore(player_id)
      setPlayerAnswered(player_id, selected)
     true ->
      setPlayerAnswered(player_id, selected)
    end
  end

  def incrementPlayerScore(player_id) do
    query =
      from p in Player,
      update: [inc: [score: 1]],
      where: p.id == ^player_id

    Repo.update_all(query, [])
  end

  def setPlayerAnswered(player_id, selected) do
    query =
      from p in Player,
      update: [set: [answered: true, answer: ^selected]],
      where: p.id == ^player_id

    Repo.update_all(query, [])
  end

  def get_random_question(questions) do
    Enum.random(questions)
  end

  def remove_question(current_question, questions, room_id) do
    questions = Enum.reject(questions, fn question ->
      question["prompt"] == current_question["prompt"]
    end)

    add_to_db(questions, room_id)

    questions
  end

  def pick_random_questions(room_id, id) do
    request_questions(id)
    |> decode_questions()
    |> parse_questions()
    |> add_to_db(room_id)
  end

  def request_questions(id) do
    case HTTPoison.get!("https://opentdb.com/api.php?amount=5&category=#{id}&type=multiple") do
      %{body: body, status_code: 200} ->
        body

      %{status_bode: 404} ->
        nil
    end
  end

  def decode_questions(body) do
    case Jason.decode(body) do
      {:ok, %{"response_code" => 0, "results" => questions}} ->
        questions

      {:error, _reason} ->
        []
    end
  end

  def add_to_db(questions, room_id) do
    Room
    |> Repo.get(room_id)
    |> Room.changeset(%{questions: questions})
    |> Repo.update

    questions
  end

  def parse_questions(raw_questions_list) do
    Enum.map(raw_questions_list, fn question ->
      Question.new(%{
        prompt: HtmlEntities.decode(question["question"]),
        options: Enum.map(question["incorrect_answers"], fn option -> HtmlEntities.decode(option) end),
        correct_option: HtmlEntities.decode(question["correct_answer"])
      })
    end)
  end

  @doc """
  Updates a category.

  ## Examples

      iex> update_category(category, %{field: new_value})
      {:ok, %Category{}}

      iex> update_category(category, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_category(%Category{} = category, attrs) do
    category
    |> Category.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a category.

  ## Examples

      iex> delete_category(category)
      {:ok, %Category{}}

      iex> delete_category(category)
      {:error, %Ecto.Changeset{}}

  """
  def delete_category(%Category{} = category) do
    Repo.delete(category)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking category changes.

  ## Examples

      iex> change_category(category)
      %Ecto.Changeset{data: %Category{}}

  """
  def change_category(%Category{} = category, attrs \\ %{}) do
    Category.changeset(category, attrs)
  end
end
