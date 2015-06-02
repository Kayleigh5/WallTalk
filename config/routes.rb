Rails.application.routes.draw do
  get 'static_pages/home'
  get 'static_pages/login'
  get 'static_pages/step1'
  get 'static_pages/step2'
  get 'static_pages/step3'

  get 'friends/index'
  get 'friends/refresh_part'
  post 'friends/like_message'
  get 'friends/like_part'
  get 'friends/comment_part'
  resources :friends
  root to: 'static_pages#home'
  match 'auth/facebook/callback', to: 'sessions#create', via: [:get]
  match 'auth/failure', to: redirect('/'), via: [:get]
  match 'signout', to: 'sessions#destroy', via: [:get]
end