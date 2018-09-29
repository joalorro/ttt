class BlocksController < ApplicationController
	def create
		block = Block.new(block_params)
		game = Game.find(block_params[:game_id])
		if block.save
			serialized_data = ActiveModelSerializers::Adapter::Json.new(
				BlockSerializer.new(block)
			).serializable_hash
			BlocksChannel.broadcast_to game, serialized_data
			head :ok
		end
	end
	
		private
		
		def block_params
			params.require(:block).permit(:row, :column, :game_id, :o_turn)
		end
end
