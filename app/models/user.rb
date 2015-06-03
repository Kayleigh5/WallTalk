class User < ActiveRecord::Base
	has_many :friends
	def self.from_omniauth(auth)
		where(uid: auth.uid).first_or_initialize.tap do |user|
			user.uid = auth.uid
			user.name = auth.info.name
			user.oauth_token = auth.credentials.token
			user.oauth_expires_at = Time.at(auth.credentials.expires_at)
			#user.add_friends
			user.save
			user
		end
	end

	def add_friends
		facebook.get_connection("me", "friends").each do |hash|
      		self.friends.where(:name => hash['name'], :uid => hash['id']).first_or_create
    	end
    end

	def facebook
		@facebook ||= Koala::Facebook::API.new(oauth_token)
	end

end
