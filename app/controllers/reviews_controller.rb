class ReviewsController < ApplicationController
  before_action :authenticate_reviewer!

  def index
    evaluation = current_user.evaluations.find(params[:evaluation_id])
    reviews = evaluation.reviews.where(user: current_user)

    render inertia: "reviews/Index", props: {reviews: serialize(reviews)}
  end

  def show
    review = current_user.reviews.find(params[:id])

    render inertia: "reviews/Show", props: {review: serialize(review)}
  end
end
