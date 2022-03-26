defmodule Trivia.Repo.Migrations.DropQuestions do
  use Ecto.Migration

  def change do
    drop table("questions")
  end
end
