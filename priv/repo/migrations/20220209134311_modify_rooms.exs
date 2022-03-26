defmodule Trivia.Repo.Migrations.ModifyRooms do
  use Ecto.Migration

  def change do
    execute("CREATE TYPE question AS ENUM ('prompt', 'options', 'correct_option')")

    alter table(:rooms) do
      remove :questions
      add :questions, :question
    end
  end
end
