defmodule Trivia.Content.Question do
@moduledoc """
 Define question structure and validations.
 """
 @derive Jason.Encoder
 defstruct prompt: "", options: [], correct_option: ""

 @doc """
 Returns a `Trivia.Question` Struct with shuffled options, the
 answer is included as part of the options.
 """
 def new(%{prompt: prompt, options: options, correct_option: correct_option}) do
   shuffled_options = Enum.shuffle([correct_option | options])
   %__MODULE__{prompt: prompt, options: shuffled_options, correct_option: correct_option}
 end
end
