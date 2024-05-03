Rails.application.routes.draw do
  # TODO
  # Need to implement JWT Auth
  # Need to adjust it to the following API:
  # POST   /api/v1/users    => sign up
  # GET    /api/v1/users/me => get user data
  # PUT    /api/v1/users/me => update information
  # DELETE /api/v1/users/me => delete account

  # Remaining APIs are pretty much as is?
  namespace :api do
    namespace :v1 do
      resources :courses
      resources :deliverables
      resources :semesters
      resources :users
      # post 'users' => 'api_v1_users#create'
      # get 'users/me' => 'api_v1_users#show'
      # put 'users/me' => 'api_v1_users#update'
      # delete 'users/me' => 'api_v1_users#destroy'
    end
  end
  # namespace :api, defaults: {format: 'json'} do
  #   namespace :v1  do
  #     resources :semesters do
  #       resources :courses do
  #         resources :deliverables
  #       end
  #     end
  #   end
  # end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
