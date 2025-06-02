Typelizer.configure do |config|
  config.output_dir = Rails.root.join("app/frontend/serializers")
  config.types_import_path = "../serializers"
end
