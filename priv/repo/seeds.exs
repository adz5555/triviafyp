# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Trivia.Repo.insert!(%Trivia.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

import Ecto.Query, warn: false

alias Trivia.Repo
alias Trivia.Games.Game
alias Trivia.Users
alias Trivia.Users.User

game_exists = Repo.exists?(from g in Game, where: g.name == "Classic Trivia")

if !game_exists do
  Repo.insert!(%Game{
     name: "Classic Trivia",
     description: "Put your General Knowledge to the Test"
  })
end

if length(System.argv) == 1 do
   [admin_email] = System.argv

   Repo.get_by!(User, email: admin_email)
   |> Users.set_admin_role
end