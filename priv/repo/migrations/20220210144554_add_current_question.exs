defmodule Trivia.Repo.Migrations.AddCurrentQuestion do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      add :current_question, :map, default: %{}
    end
  end
end
