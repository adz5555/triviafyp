defmodule Trivia.Repo.Migrations.EditEnum do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      remove :questions
    end

    execute("drop type question")
    execute("CREATE TYPE question AS ENUM ('prompt', 'options', 'correct_option')")

    alter table(:rooms) do
      add :questions, {:array, :question}, default: []
    end
  end
end
