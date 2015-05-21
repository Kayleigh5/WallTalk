Rails.application.routes.draw do
  get 'static_pages/home'
  get 'static_pages/login'
  get 'static_pages/step1'
  get 'static_pages/step2'
  get 'static_pages/step3'

  get 'friends/index'
  post 'friends/like_message'
  resources :friends
  root to: 'static_pages#home'
  match "auth/facebook/subscription", :controller => :realtime_updates, :action => :subscription, :as => 'facebook_subscription', :via => [:get,:post]
  match 'auth/facebook/callback', to: 'sessions#create', via: [:get]
  match 'auth/failure', to: redirect('/'), via: [:get]
  match 'signout', to: 'sessions#destroy', via: [:get]
end