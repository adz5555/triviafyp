defmodule Trivia.Repo.Migrations.ModifyRoomsAgain do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      remove :questions
      add :questions, {:array, :map}, default: []
    end
  end
end
