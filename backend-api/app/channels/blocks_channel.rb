class BlocksChannel < ApplicationCable::Channel
	def subscribed
		stream_from "blocks_channel"
		BlocksChannel.all_blocks(Block.all)
	end

	def unsubscribed
		# Any cleanup needed when channel is unsubscribed
	end

	def send_block data 

		block_hash = {
			row: data['row'].to_i,
			column: data['column'].to_i,
			o_turn: data['o_turn'],
			username: data['username']
		}
		
		Block.create(block_hash)
		ActionCable.server.broadcast('blocks_channel', block_hash)
	end 

	def self.all_blocks blocks 
		ActionCable.server.broadcast('blocks_channel', history:blocks)
	end 
end
