defmodule Trivia.Repo.Migrations.ModifyCatFields do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      remove :category_ids
      add :category_choices, {:array, :string}, default: []
    end
  end
end
