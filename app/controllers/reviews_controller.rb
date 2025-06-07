class ReviewsController < ApplicationController
  before_action :authenticate_reviewer!
  before_action :set_review, only: [:show, :update]

  def index
    evaluation = current_user.evaluations.find(params[:evaluation_id])
    reviews = evaluation.reviews.where(user: current_user).joins(:proposal).order(proposals: {created_at: :desc})

    render inertia: "reviews/Index", props: {reviews: serialize(reviews)}
  end

  def show
    render inertia: "reviews/Show", props: {review: serialize(@review)}
  end

  def update
    form = ReviewForm.with(review: @review).from(params.require(:review))

    if form.save
      inertia_location review_path(@review)
    else
      render inertia: "reviews/Show", props: {review: serialize(@review)}
    end
  end

  private

  def set_review
    @review = current_user.reviews.find(params[:id])
  end
end
