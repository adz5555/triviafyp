defmodule Trivia.Repo.Migrations.DropTokenFromPlayers do
  use Ecto.Migration

  def change do
    alter table(:players) do
      remove :token
    end
  end
end
