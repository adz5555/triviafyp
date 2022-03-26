defmodule Trivia.Repo.Migrations.AddJsonToRoomsNewer do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      remove :questions
      add :questions, :map, default: %{}
    end
  end
end
