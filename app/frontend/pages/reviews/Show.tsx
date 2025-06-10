import Layout from "../../components/Layout";
import { Link, usePage, useForm } from "@inertiajs/react";
import { ArrowLeftIcon, AlertCircleIcon } from 'lucide-react';
import { Review } from "../../serializers";
import TextAreaWithCounter from "../../components/TextAreaWithCounter";
import StarRating from "../../components/StarRating";
import { useState, FormEvent } from "react";

interface ShowProps {
  review: Review
}

export default function Show({ review }: ShowProps) {
  const { user } = usePage().props;

  const { data, setData, patch, processing, errors } = useForm({
    review: {
      comment: review.comment || '',
      scores: review.scores || {} as Record<string, number>
    }
  });

  // Inertia's type inference for errors doesn't support nesting?
  const formErrors = errors as Partial<{scores: Array<string>, comment: Array<string>}>

  const [editing, setEditting] = useState(false);

  const proposal = review.proposal!;

  const hasReviewed = review.status === 'submitted';

  // Check if deadline has passed
  const deadlinePassed = review.evaluation?.deadline ? new Date(review.evaluation.deadline) < new Date() : false;

  function submitReview(e: FormEvent) {
    e.preventDefault()
    patch(`/reviews/${review.id}`, {preserveScroll: true})
  }

  return (
  <Layout currentUser={user}>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
          href={`/evaluations/${review.evaluation!.id}/reviews`}
        className="flex items-center text-cloud-600 hover:text-cloud-700 transition-colors mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        Back to evaluation
      </Link>

      <div className="max-w-4xl mx-auto">
        {/* Talk Information */}
        <div className="card border mb-8 animate-slide-up">
          <h2 className="text-xl font-bold mb-6 pb-4 border-b border-sky-700">Proposal Information</h2>

          <div className="space-y-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold mb-2 mr-3">{proposal.title}</h1>
            </div>

            <div>
              <h3 className="text-sm uppercase font-medium border-sky-700 text-sky-800 mb-2">Track</h3>
              <p className="text-cloud-700">{proposal.track}</p>
            </div>

            <div>
              <h3 className="text-sm uppercase font-medium border-sky-700 text-sky-800 mb-2">Abstract</h3>
              <p className="text-cloud-700 whitespace-pre-line">{proposal.abstract}</p>
            </div>

            <div>
              <h3 className="text-sm uppercase font-medium border-sky-700 text-sky-800 mb-2">Detailed Description</h3>
              <p className="text-cloud-700 whitespace-pre-line">{proposal.details}</p>
            </div>

            <div>
              <h3 className="text-sm uppercase font-medium border-sky-700 text-sky-800 mb-2">Why this talk matters</h3>
              <p className="text-cloud-700 whitespace-pre-line">{proposal.pitch}</p>
            </div>
          </div>
        </div>

        {/* Review Information */}
        <div className="card border border-sky-700 mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {/* Show deadline message if deadline passed and review not submitted */}
          {deadlinePassed && !hasReviewed && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800">
                  The evaluation deadline has passed. You can no longer submit a review for this proposal.
                </p>
              </div>
            </div>
          )}

          {(!hasReviewed || editing) && !deadlinePassed && (
            <>
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-neutral-200">Submit Review</h2>
              <form onSubmit={submitReview} className="space-y-6">
                <div className="flex flex-wrap space-x-4">
                  {review.evaluation?.criteria?.map((category) => (
                    <div key={category} className="w-[30%]">
                      <StarRating
                        name={category}
                        label={category}
                        value={data.review.scores[category]}
                        onChange={(value) => setData(`review.scores.${category}`, value)}
                        required
                      />
                    </div>
                  ))}
                </div>
                {formErrors.scores && (
                  <p className="text-red-600 text-sm mb-4">Scores {formErrors.scores.join(", ")}</p>
                )}

                <div>
                  <label className="label" htmlFor="comment">Review Comment</label>
                  <TextAreaWithCounter
                    id="comment"
                    value={data.review.comment}
                    onChange={(val) => setData('review.comment', val)}
                    maxLength={400}
                    placeholder="Provide detailed feedback for the proposal"
                  />
                </div>

                <div className="flex flex-col sm:flex-row-reverse justify-start space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse animate-slide-up" style={{ animationDelay: "0.2s" }}>
                  {hasReviewed && (
                    <button
                      className="btn btn-outline flex items-center justify-center cursor-pointer"
                      onClick={() => {
                        setEditting(false)
                      }}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn btn-ruby flex items-center justify-center cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </>
          )}

          {(hasReviewed && !editing) && (
            <>
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-neutral-200">Your Review</h2>
              <div className="pb-6 border-b border-neutral-200 last:border-0 last:pb-0">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {review.evaluation?.criteria?.map((category) => (
                    <div key={category}>
                      <StarRating
                        label={category}
                        value={review.scores && review.scores[category]}
                        readonly
                      />
                    </div>
                  ))}
                </div>
                <hr className="my-4" />
                <p className="text-neutral-700 whitespace-pre-line">{review.comment}</p>
                <div className="flex flex-col sm:flex-row-reverse justify-start space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse animate-slide-up" style={{ animationDelay: "0.2s" }}>
                  {!deadlinePassed && (
                    <button
                      className="btn btn-outline flex items-center justify-center cursor-pointer"
                      onClick={() => setEditting(true)}
                    >
                      Edit Review
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  </Layout>
  )
}
