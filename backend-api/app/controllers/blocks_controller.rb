class BlocksController < ApplicationController
	
	def index 
		@blocks = Block.all 
		render json: @blocks 
	end 

	def show 
		@block = Block.find params[:id]
		render json: @block 
	end 
	
	def create 
		@block = Block.new block_params 

		if @block.save 
			render json: @block, status: :created, location: @block 
		else 
			render json: @block.errors, status: 422 
		end 
	
	# def create
	# 	block = Block.new(block_params)
	# 	game = Game.find(block_params[:game_id])
	# 	if block.save
	# 		serialized_data = ActiveModelSerializers::Adapter::Json.new(
	# 			BlockSerializer.new(block)
	# 		).serializable_hash
	# 		BlocksChannel.broadcast_to game, serialized_data
	# 		head :ok
	# 	end
	# end
	
		private
		
		def block_params
			params.require(:block).permit(:row, :column, :username, :o_turn)
		end
end
