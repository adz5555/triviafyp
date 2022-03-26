defmodule Trivia.Repo.Migrations.CreateCategories do
  use Ecto.Migration

  def change do
    create table(:categories) do
      add :name, :string
      add :cat_id, :integer

      timestamps()
    end

    create unique_index(:categories, [:name])
    create unique_index(:categories, [:cat_id])
  end
end
