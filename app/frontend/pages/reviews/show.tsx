import Layout from "../../components/Layout";
import { Link, usePage, useForm } from "@inertiajs/react";
import { ArrowLeftIcon, AlertCircleIcon, UserIcon } from 'lucide-react';
import { Review } from "../../serializers";
import TextAreaWithCounter from "../../components/TextAreaWithCounter";
import StarRating from "../../components/StarRating";
import { useState, FormEvent } from "react";

interface ShowProps {
  review: Review
}

export default function Show({ review }: ShowProps) {
  const { user } = usePage().props;

  const { data, setData, patch, errors } = useForm({
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

  // Check if submissions are allowed
  const submissionsAllowed = review.evaluation?.submissions_allowed ?? true;

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
          <h2 className="text-xl font-bold mb-6 pb-4 border-b border-secondary-700">Proposal Information</h2>

          <div className="space-y-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold mb-2 mr-3">{proposal.title}</h1>
            </div>

            <div>
              <h3 className="text-sm uppercase font-medium border-secondary-700 text-secondary-800 mb-2">Track</h3>
              <p className="text-cloud-700">{proposal.track}</p>
            </div>

            <div>
              <h3 className="text-sm uppercase font-medium border-secondary-700 text-secondary-800 mb-2">Abstract</h3>
              <p className="text-cloud-700 whitespace-pre-line">{proposal.abstract}</p>
            </div>

            <div>
              <h3 className="text-sm uppercase font-medium border-secondary-700 text-secondary-800 mb-2">Detailed Description</h3>
              <p className="text-cloud-700 whitespace-pre-line">{proposal.details}</p>
            </div>

            <div>
              <h3 className="text-sm uppercase font-medium border-secondary-700 text-secondary-800 mb-2">Why this talk matters</h3>
              <p className="text-cloud-700 whitespace-pre-line">{proposal.pitch}</p>
            </div>
          </div>
        </div>

        {/* Speaker Information */}
        {review.speaker && (
          <div className="card border border-secondary-700 mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-secondary-700">Speaker Profile</h2>

            <div className="space-y-6">
              <div className="float-right">
                {review.speaker.photo_url ? (
                  <img
                    src={review.speaker.photo_url}
                    alt={`${review.speaker.name}'s profile photo`}
                    className="w-32 h-32 object-cover rounded-full border-2 border-secondary-700 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-2 border-secondary-700 bg-secondary-50 flex items-center justify-center shadow-lg">
                    <UserIcon className="w-16 h-16 text-secondary-400" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm uppercase font-medium border-secondary-700 text-secondary-800 mb-2">Name</h3>
                  <p className="text-cloud-700">{review.speaker.name}</p>
                </div>

                <div>
                  <h3 className="text-sm uppercase font-medium border-secondary-700 text-secondary-800 mb-2">Email</h3>
                  <p className="text-cloud-700">{review.speaker.email}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm uppercase font-medium border-secondary-700 text-secondary-800 mb-2">Company/Organization</h3>
                <p className="text-cloud-700">
                  {review.speaker.role && (
                    <span>{review.speaker.role} @ </span>
                  )}
                  {review.speaker.company || "—"}
                </p>
              </div>

              <div>
                <h3 className="text-sm uppercase font-medium border-secondary-700 text-secondary-800 mb-2">Bio</h3>
                <p className="text-cloud-700 whitespace-pre-line">{review.speaker.bio}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm uppercase font-medium border-secondary-700 text-secondary-800 mb-2">Socials</h3>
                  <p className="text-cloud-700">{review.speaker.socials || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review Information */}
        <div className="card border border-secondary-700 mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {/* Show deadline message if submissions not allowed and review not submitted */}
          {!submissionsAllowed && !hasReviewed && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800">
                  The evaluation deadline has passed. You can no longer submit a review for this proposal.
                </p>
              </div>
            </div>
          )}

          {(!hasReviewed || editing) && submissionsAllowed && (
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
                    className="btn btn-primary flex items-center justify-center cursor-pointer"
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
                  {submissionsAllowed && (
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
