Rails.application.routes.draw do
  get 'static_pages/home'
  get 'static_pages/usechrome'
  get 'friends/index'
  get 'friends/refresh_part'
  post 'friends/like_message'
  get 'friends/like_part'
  get 'friends/comment_part'
  resources :friends
  root to: 'static_pages#home'
  
  match 'auth/facebook/callback', to: 'sessions#create', via: [:get]
  match 'auth/failure', to: redirect('/'), via: [:get]
  match 'signup_grandkid', to: 'sessions#destroy_grandkid', via: [:get]
  match 'signup_grandparent', to: 'sessions#destroy_before_grandparent', via: [:get]

end