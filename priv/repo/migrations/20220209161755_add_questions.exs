defmodule Trivia.Repo.Migrations.AddQuestions do
  use Ecto.Migration

  def change do
    create table("questions") do
      add :prompt, :string
      add :options, {:array, :string}, default: []
      add :correct_option, :string

      timestamps()
    end
  end
end
