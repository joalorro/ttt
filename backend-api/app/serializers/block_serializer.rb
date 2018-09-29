class BlockSerializer < ActiveModel::Serializer
	attributes :id, :game_id, :row, :column, :o_turn
end
