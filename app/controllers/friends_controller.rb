class FriendsController < ApplicationController

def index
	@friends = current_user.friends

  respond_to do |format|
    format.json { 
      render 'friends/like' 
    }
    format.html {

    }
    end 
end

def show
end

def like_message(id)
  current_user.facebook.put_like("#{id}/likes")
end


private

def convert_facebook_time_to_datetime(time_facebook)
  date_split = time_facebook.split("T")
  time_split = date_split[1].split("+0000")
  dateTimeString = "#{date_split[0]} #{time_split[0]}"
  return DateTime.strptime(dateTimeString, "%Y-%m-%d %H:%M:%S")
end

def determine_latest_message
  @latest_time = DateTime.new.change(:offset => "+0000")
  @latest_message_id = 0
  @friends.each do |friend|
    @time = convert_facebook_time_to_datetime(
      current_user.facebook.get_object("#{friend.uid}/statuses?fields=updated_time,message,id&limit=1")[0]['updated_time'])      
    if @latest_time < @time
      @latest_time = @time
      @latest_message_id = current_user.facebook.get_object("#{friend.uid}/statuses?fields=updated_time,message,id&limit=1")[0]['id']
    end
  end
  return @latest_message_id
end

def nested_hash_values(obj,key)
  r = []  
  if obj.is_a?(Hash)        
    r.push(obj[key]) if obj.key?(key) 
    obj.each_value { |e| r += nested_hash_values(e,key) }
  end
  if obj.is_a?(Array)
    obj.each { |e| r += nested_hash_values(e,key) }
  end
  r
end

helper_method :nested_hash_values, :determine_latest_message, :convert_facebook_time_to_datetime
end
