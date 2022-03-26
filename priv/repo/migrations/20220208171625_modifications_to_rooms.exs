defmodule Trivia.Repo.Migrations.ModificationsToRooms do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      remove :questions
      add(:questions, {:map, {:array, :map}})
    end
  end
end
