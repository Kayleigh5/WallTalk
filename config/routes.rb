Rails.application.routes.draw do
  get 'static_pages/home'

  get 'static_pages/step1'

  get 'static_pages/step2'

  get 'static_pages/step3'

  root to: 'users#index'
  match 'auth/facebook/callback', to: 'sessions#create', via: [:get]
  match 'auth/failure', to: redirect('/'), via: [:get]
  match 'signout', to: 'sessions#destroy', as: 'signout', via: [:get]
end