Typelizer.configure do |config|
  config.output_dir = Rails.root.join("app/frontend/serializers")
  config.types_import_path = "@/serializers"
  config.types_global += %w[Exclude]
  config.prefer_double_quotes = true
end
