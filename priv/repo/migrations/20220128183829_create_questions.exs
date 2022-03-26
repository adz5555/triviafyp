defmodule Trivia.Repo.Migrations.CreateQuestions do
  use Ecto.Migration

  def change do
    create table(:questions) do
	add :prompt, :string
	add :wrong_options, {:array, :string}, default: []
	add :correct_option, :string
    end

  end
end
