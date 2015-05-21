class SessionsController < ApplicationController
	def create
		user = User.from_omniauth(env["omniauth.auth"])
		session[:fb_permissions] = 'user_events'
		session[:user_id] = user.id
		if request.env['omniauth.params']['user'] == 'grandkid'
			redirect_to "/static_pages/step2"
		elsif request.env['omniauth.params']['user'] == 'grandparent'
			redirect_to "/static_pages/step3"
		end
	end

	def destroy
		session[:user_id] = nil
		if URI(request.referer).path == "/static_pages/step1"
			redirect_to "/static_pages/step2"
		elsif URI(request.referer).path == "/static_pages/step2"
			redirect_to "/auth/facebook?user=grandkid"
		elsif URI(request.referer).path == "/static_pages/step3"
			redirect_to "/auth/facebook?user=grandparent"
		else
			redirect_to request.referer
		end
	end
end