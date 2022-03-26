defmodule TriviaWeb.UserSocket do
  use Phoenix.Socket

  ## Channels
  channel "room:*", TriviaWeb.RoomChannel

  # Socket params are passed from the client and can
  # be used to verify and authenticate a user. After
  # verification, you can put default assigns into
  # the socket that will be set for all channels, ie
  #
  #     {:ok, assign(socket, :user_id, verified_user_id)}
  #
  # To deny connection, return `:error`.
  #
  # See `Phoenix.Token` documentation for examples in
  # performing token verification on connect.
    @max_age 24 * 60 * 60
    def connect(%{"player_token" => token, "access_code" => access_code}, socket, _connect_info) do
      case Phoenix.Token.verify(socket, "player token", token, max_age: @max_age) do
        {:ok, player_id} ->
          {:ok, assign(socket, :current_player_id, player_id)}

        {:error, _reason} ->
          {:ok, socket}
      end
    end

   def connect(%{"host_token" => token, "access_code" => access_code}, socket, _connect_info) do
    case Phoenix.Token.verify(socket, "host token", token, max_age: @max_age) do
      {:ok, host_id} ->
        {:ok, assign(socket, :current_host_id, host_id)}

      {:error, _reason} ->
        {:ok, socket}
    end
   end

   def connect(_params, _socket), do: :error

  # Socket id's are topics that allow you to identify all sockets for a given user:
  #
  #     def id(socket), do: "user_socket:#{socket.assigns.user_id}"
  #
  # Would allow you to broadcast a "disconnect" event and terminate
  # all active sockets and channels for a given user:
  #
  #     TriviaWeb.Endpoint.broadcast("user_socket:#{user.id}", "disconnect", %{})
  #
  # Returning `nil` makes this socket anonymous.
  @impl true
  def id(_socket), do: nil
end
