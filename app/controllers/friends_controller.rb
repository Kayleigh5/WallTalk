class FriendsController < ApplicationController

def index
	@friends = current_user.friends

  respond_to do |format|
    format.json { 
      #render 'friends/like' 
    }
    format.html {

    }
    format.js
    end 
end

def show
end

def last_message
  current_user.friends.each do |friend|
    @message = current_user.facebook.get_object("#{friend.uid}/statuses?fields=updated_time,message,id&limit=1")[0]['message']
  end
end


def comment_part
  @latest_message = determine_latest_message
  @current_user = current_user
  @comment = String.new(params[:message])
end

def refresh_part
  @current_user = current_user
end

def like_part
  @current_user = current_user
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
  @current_user = current_user
  @latest_time = DateTime.new.change(:offset => "+0000")
  @latest_message_id = 0
  @current_user.friends.each do |friend|
    if determine_if_latest_picture_or_message(friend.uid)[1].nil?
      @time = convert_facebook_time_to_datetime(
        current_user.facebook.get_object("#{friend.uid}/statuses?fields=updated_time&limit=1")[0]['updated_time'])      
      if @latest_time < @time
        @latest_time = @time
        @latest_message_id = current_user.facebook.get_object("#{friend.uid}/statuses?fields=id&limit=1")[0]['id']
      end
    else
      @time = convert_facebook_time_to_datetime(current_user.facebook.get_object("#{friend.uid}/feed?fields=updated_time&limit=1")[0]['updated_time'])
      if @latest_time < @time
        @latest_time = @time
        @latest_message_id = current_user.facebook.get_object("#{friend.uid}/feed?fields=id&limit=1")[0]['id']
      end
    end
  end
  return @latest_message_id
end

def determine_if_latest_picture_or_message(friend_uid)
  @current_user = current_user
  
  @time_latest_status = convert_facebook_time_to_datetime(
      current_user.facebook.get_object("#{friend_uid}/statuses?fields=updated_time&limit=1")[0]['updated_time'])
  
  @latest_status_message = current_user.facebook.get_object("#{friend_uid}/statuses?fields=message&limit=1")[0]['message']
  
  @time_latest_picture = convert_facebook_time_to_datetime(current_user.facebook.get_object("#{friend_uid}/feed?fields=full_picture,updated_time&limit=1")[0]['updated_time'])

  @url_latest_picture = current_user.facebook.get_object("#{friend_uid}/feed?fields=full_picture&redirect=false&limit=1")[0]['full_picture']
  @message_latest_picture = current_user.facebook.get_object("#{friend_uid}/feed?fields=full_picture,message&limit=1")[0]['message']

  if @time_latest_status > @time_latest_picture # so if newest message is latest status
    return @latest_status_message
  else
    return @message_latest_picture, @url_latest_picture
  end
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

helper_method :nested_hash_values, :determine_latest_message, :convert_facebook_time_to_datetime, :determine_if_latest_picture_or_message
end
