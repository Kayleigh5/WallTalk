Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, FACEBOOK_CONFIG['app_id'], FACEBOOK_CONFIG['secret'], {:scope => 'user_about_me, read_stream, user_friends, user_photos, publish_actions'}
end