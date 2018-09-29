Rails.application.routes.draw do
	# For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
	# resources :conversations, only: [:index, :create]
	# resources :messages, only: [:create]

	resources :games, only: [:index,:create]
	resources :blocks, only: [:create]

	mount ActionCable.server => '/cable'
end
