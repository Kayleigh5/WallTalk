class SessionsController < ApplicationController
	def create
		user = User.from_omniauth(env["omniauth.auth"])
		session[:fb_permissions] = 'user_events'
		session[:user_id] = user.id
		if request.env['omniauth.params']['user'] == 'grandkid'
			redirect_to root_url(:signed_in_type => 'grandkid_sign', :current_user => current_user, anchor: 'grandkid')
		elsif request.env['omniauth.params']['user'] == 'grandparent'
			redirect_to '/friends/index'
		end
	end

	def destroy_grandkid
		session[:user_id] = nil
		redirect_to "/auth/facebook?user=grandkid"
	end

	def destroy_before_grandparent
		session[:user_id] = nil
		redirect_to "/auth/facebook?user=grandparent"
	end
end