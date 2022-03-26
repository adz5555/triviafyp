defmodule Trivia.Repo.Migrations.AddJsonToRooms do
  use Ecto.Migration

  def change do
     alter table(:rooms) do
      add :questions, :json
    end
  end
end
