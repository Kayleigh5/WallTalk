class Changefriends < ActiveRecord::Migration
  def change
  	drop_table :friends
  	create_table :friends do |t|
  		t.belongs_to :user, index: true
  		t.string :uid
  		t.string :name

  		t.timestamps null: false
  	end
  end
end