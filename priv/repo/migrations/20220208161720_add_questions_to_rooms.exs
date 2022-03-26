defmodule Trivia.Repo.Migrations.AddQuestionsToRooms do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      add :questions, {:array, :string}, default: []
      add :current_question, {:array, :string}, default: []
    end
  end
end