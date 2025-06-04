class ApplicationPrism
  def initialize(root_namespace = "")
    @root_namespace = root_namespace
  end

  def respond_to_missing?(_mid, _include_private = false)
    true
  end

  def method_missing(mid, *args, &block)
    mid.to_s.camelize.then do |class_prefix|
      page = "#{root_namespace}#{class_prefix}Page".safe_constantize
      next page.new(*args, &block) if page

      ApplicationPrism.new("#{root_namespace}#{class_prefix}::")
    end
  end

  def home = HomePage.new

  def startups = StartupsPage.new

  def proposals = ProposalsPage.new

  def proposal_form = ProposalFormPage.new

  def proposal = ProposalPage.new

  private

  attr_reader :root_namespace
end
