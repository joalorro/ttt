class CreateBlocks < ActiveRecord::Migration[5.2]
  def change
    create_table :blocks do |t|
      t.integer :row
      t.integer :column
      t.boolean :o_turn
      t.integer :game_id

      t.timestamps
    end
  end
end
