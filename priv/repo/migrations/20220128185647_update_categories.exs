defmodule Trivia.Repo.Migrations.UpdateCategories do
  use Ecto.Migration

  def change do
     alter table (:categories) do
	add :global_id, :integer
     end
  end
end
