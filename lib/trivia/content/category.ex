defmodule Trivia.Content.Category do
  use Ecto.Schema
  import Ecto.Changeset

  schema "categories" do
    field :cat_id, :integer
    field :name, :string

    timestamps()
  end

  @doc false
  def changeset(category, attrs) do
    category
    |> cast(attrs, [:name, :cat_id])
    |> validate_required([:name, :cat_id])
    |> unique_constraint(:name)
    |> unique_constraint(:cat_id)
  end
end
