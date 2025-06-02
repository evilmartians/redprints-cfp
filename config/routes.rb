Rails.application.routes.draw do
  # Authentication
  namespace :auth do
    delete "sign_out", to: "sessions#destroy"

    # OmniAuth
    get "/failure", to: "omniauth#failure"
    get "/:provider/callback", to: "omniauth#create", as: :oauth_callback
    post "/:provider/callback", to: "omniauth#create"
    # This route should be unreachable, since it's served by OmniAuth middleware.
    # We declare it only to have a named route.
    get "/:provider", to: ->(_env) { [418, {}, ["Earl Grey or English Breakfast?"]] }, as: :oauth
  end

  mount Avo::Engine, at: Avo.configuration.root_path

  namespace :dev do
    if Rails.application.config.action_mailer.delivery_method == :letter_opener_web
      mount LetterOpenerWeb::Engine, at: "/letters"
    end

    if Rails.application.config.lookbook_enabled
      mount Lookbook::Engine, at: "/lookbook"
    end

    mount MissionControl::Jobs::Engine, at: "/jobs"
  end

  get "up" => "rails/health#show", :as => :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "home#index"
end
