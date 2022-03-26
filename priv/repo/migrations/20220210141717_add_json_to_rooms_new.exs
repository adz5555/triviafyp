defmodule Trivia.Repo.Migrations.AddJsonToRoomsNew do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      remove :questions
      add :questions, :map
    end
  end
end
