class RealtimeUpdatesController < ApplicationController

VERIFY_TOKEN = "cbecb59badd70d648fc33dff9e01728a"


def realtime_request?(request)
    ((request.method == "GET" && params['hub.mode'].present?) || 
       (request.method == "POST" && request.headers['X-Hub-Signature'].present?))
  end

def subscription
	if(realtime_request?(request))
	  case request.method
	  when "GET"
	    challenge = Koala::Facebook::RealtimeUpdates.meet_challenge(params, VERIFY_TOKEN)
	    if(challenge)
	      render :text => challenge
	    else
	      render :text => 'Failed to authorize facebook challenge request'
	    end
	  when "POST"
	  	render :text => 'Thanks for the update.'
	    case params['object']
	    # Do logic here...
	  end
	end
end

end
