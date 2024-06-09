Rails.application.routes.draw do
  # Remaining APIs are pretty much as is?
  namespace :api do
    namespace :v1 do
      resources :courses
      resources :deliverables
      resources :semesters
      get "products" => "products#index"
      get "users/me/progress" => "users#progress"
      get "users/me" => "users#show"
      put "users/me" => "users#update"
      patch "users/me" => "users#update"
      delete "users/me" => "users#destroy"
      post "users" => "users#create"
    end
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
