class ReviewForm < ApplicationForm
  attribute :comment
  attribute :scores

  validate :all_scores_set

  after_save :invalidate_proposal_scores

  attr_reader :review

  delegate :proposal, :evaluation, to: :review

  def submit!
    review.status = :submitted
    review.save!
  end

  def assign_context(**)
    super
    @review = context[:review]
  end

  def assign_attributes(attrs)
    super
    # Ensure scores are integers
    scores&.transform_values!(&:to_i)

    review.assign_attributes(comment:, scores:, score: scores.values.sum)
  end

  def permitted_attributes
    super.tap do
      _1.delete(:scores)
      _1.push({scores: evaluation.criteria})
    end
  end

  private

  def invalidate_proposal_scores = proposal&.invalidate_scores!

  def all_scores_set
    return errors.add(:scores, :blank) if scores.blank?

    evaluation.criteria.each do |criterion|
      return errors.add(:scores, "all scores must be set") unless scores[criterion].present? # rubocop:disable Rails/Blank
    end
  end
end
