class BlockSerializer < ActiveModel::Serializer
	attributes :id, :username, :row, :column, :o_turn
end
