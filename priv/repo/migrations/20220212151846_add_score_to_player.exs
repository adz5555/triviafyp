defmodule Trivia.Repo.Migrations.AddScoreToPlayer do
  use Ecto.Migration

  def change do
    alter table(:players) do
      add :score, :integer, default: 0
    end
  end
end
