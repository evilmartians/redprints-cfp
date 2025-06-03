RSpec.shared_context "site_prism" do
  let(:prism) { ApplicationPrism.new }
end

RSpec.configure do |config|
  config.include_context "site_prism", type: :system
end
