defmodule Trivia.Repo.Migrations.EditEnumNew do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      remove :questions
    end

    execute("drop type question")

    alter table(:rooms) do
      add :questions, {:array, :map}, default: []
    end
  end
end
