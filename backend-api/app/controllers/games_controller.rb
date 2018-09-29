class GamesController < ApplicationController 

	def index
		games = Game.all
		render json: games
	end

	def create
		game = Game.new
		if game.save
			serialized_data = ActiveModelSerializers::Adapter::Json.new(
				GameSerializer.new(game)
			).serializable_hash
			ActionCable.server.broadcast 'games_channel', serialized_data
			head :ok
			byebug
		end
	end
	
	private
	
	def game_params
		params.require(:game).permit(:id)
	end
end 