require "rails_helper"

# Specs load CFPs from spec/data. This checks the real config/data/cfps.yml,
# since FrozenRecord only defines attributes for keys present in the file.
RSpec.describe "config/data/cfps.yml" do
  around do |example|
    original_path = CFP.base_path
    CFP.base_path = Rails.root.join("config/data")
    CFP.unload!
    example.run
  ensure
    CFP.base_path = original_path
    CFP.unload!
  end

  it "has exactly one primary CFP" do
    expect(CFP.where(primary: true).count).to eq(1)
  end

  it "serializes every CFP" do
    CFP.all.to_a.each do |cfp|
      expect { CFPSerializer.new(cfp).serialize }.not_to raise_error
    end
  end
end
