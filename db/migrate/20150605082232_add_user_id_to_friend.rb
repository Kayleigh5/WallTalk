class AddUserIdToFriend < ActiveRecord::Migration
  def change
  	change_column :friends, :user_id, :integer, null: false
  end
end
