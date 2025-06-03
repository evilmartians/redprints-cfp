class ProposalForm < ApplicationForm
  attribute :title
  attribute :abstract
  attribute :details
  attribute :pitch
  attribute :track

  attribute :speaker_name
  attribute :speaker_email
  attribute :speaker_company
  attribute :speaker_bio
  attribute :speaker_socials

  attribute :drafting, :boolean, default: false

  validates :title, length: {maximum: 256}
  validates :abstract, length: {maximum: 400}
  validates :details, length: {maximum: 800}
  validates :pitch, length: {maximum: 600}
  validates :speaker_bio, length: {maximum: 300}

  validates :title, :abstract, :details, :pitch,
    :speaker_name, :speaker_email, :speaker_bio,
    presence: true, unless: :drafting

  attr_reader :proposal, :user, :speaker_profile

  delegate :id, :persisted?, to: :proposal, allow_nil: true

  def submit!
    if drafting
      # make sure it has at least a title
      proposal.title = "Untitled draft" if proposal.title.blank?
    else
      proposal.status = :submitted
      proposal.submitted_at = Time.current
    end
    proposal.save!
    speaker_profile.save!
  end

  def assign_context(**)
    super
    @proposal = context[:proposal]
    @user = context[:user]
  end

  def assign_attributes(attrs)
    super
    if @proposal
      @proposal.assign_attributes(build_proposal_attributes)
    else
      @proposal = user.proposals.new(build_proposal_attributes)
    end

    @speaker_profile = user.speaker_profile || user.build_speaker_profile
    @speaker_profile.assign_attributes(build_speaker_attributes)
  end

  private

  def build_proposal_attributes
    {
      title:,
      abstract:,
      details:,
      pitch:,
      track:
    }
  end

  def build_speaker_attributes
    {
      name: speaker_name,
      email: speaker_email,
      company: speaker_company,
      bio: speaker_bio,
      socials: speaker_socials
    }
  end

  # This method transfers attributes from the model to the form object
  # (before we use it in a view or validate it)
  def attributes_from_context
    attrs = {}
    profile = user&.speaker_profile

    attrs.merge!(
      {
        speaker_name: profile&.name || user&.name,
        speaker_email: profile&.email || user&.email,
        speaker_company: profile&.company,
        speaker_bio: profile&.bio,
        speaker_socials: profile&.socials
      }.compact
    )

    return attrs unless proposal

    attrs.merge!({
      title: proposal.title.presence,
      abstract: proposal.abstract.presence,
      details: proposal.details.presence,
      pitch: proposal.pitch.presence,
      track: proposal.track
    }.compact)

    attrs
  end
end
