class ReviewsController < InertiaController
  before_action :authenticate_reviewer!
  before_action :set_review, only: [:show, :update]
  before_action :check_deadline, only: [:update]

  def index
    evaluation = current_user.evaluations.find(params[:evaluation_id])
    reviews = evaluation.reviews.where(user: current_user).joins(:proposal).order(score: :desc).order(proposals: {created_at: :desc})

    render inertia: {reviews: serialize(reviews), evaluation: serialize(evaluation, current_user:)}
  end

  def show
    render inertia: {review: serialize(@review)}
  end

  def update
    form = ReviewForm.with(review: @review).from(params.require(:review))

    if form.save
      redirect_to evaluation_reviews_path(@review.evaluation)
    else
      redirect_to review_path(@review), inertia: {errors: form.errors}
    end
  end

  private

  def set_review
    @review = current_user.reviews.find(params[:id])
  end

  def check_deadline
    return unless @review.evaluation.deadline&.past?

    redirect_to review_path(@review), alert: "The evaluation deadline has passed. You can no longer submit or edit reviews."
  end
end
