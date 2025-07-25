import { Link, useForm, usePage } from "@inertiajs/react";
import { AlertCircleIcon, ArrowLeftIcon, UserIcon } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";

import Layout from "../../components/Layout";
import StarRating from "../../components/StarRating";
import TextAreaWithCounter from "../../components/TextAreaWithCounter";
import type { Review } from "../../serializers";

interface ShowProps {
  review: Review;
}

export default function Show({ review }: ShowProps) {
  const { user } = usePage().props;

  const { data, setData, patch, errors } = useForm({
    review: {
      comment: review.comment ?? "",
      scores: review.scores ?? ({} as Record<string, number>),
    },
  });

  // Inertia's type inference for errors doesn't support nesting?
  const formErrors = errors as Partial<{ scores: string[]; comment: string[] }>;

  const [editing, setEditing] = useState(false);

  const proposal = review.proposal!;

  const hasReviewed = review.status === "submitted";

  // Check if submissions are allowed
  const submissionsAllowed = review.evaluation?.submissions_allowed ?? true;

  function submitReview(e: FormEvent) {
    e.preventDefault();
    patch(`/reviews/${review.id}`, { preserveScroll: true });
  }

  return (
    <Layout currentUser={user}>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href={`/evaluations/${review.evaluation!.id}/reviews`}
          className="text-cloud-600 hover:text-cloud-700 mb-6 flex items-center transition-colors"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back to evaluation
        </Link>

        <div className="mx-auto max-w-4xl">
          {/* Talk Information */}
          <div className="card animate-slide-up mb-8 border">
            <h2 className="border-secondary-700 mb-6 border-b pb-4 text-xl font-bold">
              Proposal Information
            </h2>

            <div className="space-y-6">
              <div className="flex items-center">
                <h1 className="mr-3 mb-2 text-3xl font-bold">
                  {proposal.title}
                </h1>
              </div>

              <div>
                <h3 className="border-secondary-700 text-secondary-800 mb-2 text-sm font-medium uppercase">
                  Track
                </h3>
                <p className="text-cloud-700">{proposal.track}</p>
              </div>

              <div>
                <h3 className="border-secondary-700 text-secondary-800 mb-2 text-sm font-medium uppercase">
                  Abstract
                </h3>
                <p className="text-cloud-700 whitespace-pre-line">
                  {proposal.abstract}
                </p>
              </div>

              <div>
                <h3 className="border-secondary-700 text-secondary-800 mb-2 text-sm font-medium uppercase">
                  Detailed Description
                </h3>
                <p className="text-cloud-700 whitespace-pre-line">
                  {proposal.details}
                </p>
              </div>

              <div>
                <h3 className="border-secondary-700 text-secondary-800 mb-2 text-sm font-medium uppercase">
                  Why this talk matters
                </h3>
                <p className="text-cloud-700 whitespace-pre-line">
                  {proposal.pitch}
                </p>
              </div>
            </div>
          </div>

          {/* Speaker Information */}
          {review.speaker && (
            <div
              className="card border-secondary-700 animate-slide-up mb-8 border"
              style={{ animationDelay: "0.1s" }}
            >
              <h2 className="border-secondary-700 mb-6 border-b pb-4 text-xl font-bold">
                Speaker Profile
              </h2>

              <div className="space-y-6">
                <div className="float-right">
                  {review.speaker.photo_url ? (
                    <img
                      src={review.speaker.photo_url}
                      alt={`${review.speaker.name}'s profile photo`}
                      className="border-secondary-700 h-32 w-32 rounded-full border-2 object-cover shadow-lg"
                    />
                  ) : (
                    <div className="border-secondary-700 bg-secondary-50 flex h-32 w-32 items-center justify-center rounded-full border-2 shadow-lg">
                      <UserIcon className="text-secondary-400 h-16 w-16" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="border-secondary-700 text-secondary-800 mb-2 text-sm font-medium uppercase">
                      Name
                    </h3>
                    <p className="text-cloud-700">{review.speaker.name}</p>
                  </div>

                  <div>
                    <h3 className="border-secondary-700 text-secondary-800 mb-2 text-sm font-medium uppercase">
                      Email
                    </h3>
                    <p className="text-cloud-700">{review.speaker.email}</p>
                  </div>
                </div>

                <div>
                  <h3 className="border-secondary-700 text-secondary-800 mb-2 text-sm font-medium uppercase">
                    Company/Organization
                  </h3>
                  <p className="text-cloud-700">
                    {review.speaker.role && (
                      <span>{review.speaker.role} @ </span>
                    )}
                    {review.speaker.company ?? "—"}
                  </p>
                </div>

                <div>
                  <h3 className="border-secondary-700 text-secondary-800 mb-2 text-sm font-medium uppercase">
                    Bio
                  </h3>
                  <p className="text-cloud-700 whitespace-pre-line">
                    {review.speaker.bio}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="border-secondary-700 text-secondary-800 mb-2 text-sm font-medium uppercase">
                      Socials
                    </h3>
                    <p className="text-cloud-700">
                      {review.speaker.socials ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Review Information */}
          <div
            className="card border-secondary-700 animate-slide-up mb-8 border"
            style={{ animationDelay: "0.1s" }}
          >
            {/* Show a deadline message if submissions not allowed and review not submitted */}
            {!submissionsAllowed && !hasReviewed && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-center">
                  <AlertCircleIcon className="mr-2 h-5 w-5 text-red-600" />
                  <p className="text-red-800">
                    The evaluation deadline has passed. You can no longer submit
                    a review for this proposal.
                  </p>
                </div>
              </div>
            )}

            {(!hasReviewed || editing) && submissionsAllowed && (
              <>
                <h2 className="mb-6 border-b border-neutral-200 pb-4 text-xl font-bold">
                  Submit Review
                </h2>
                <form onSubmit={submitReview} className="space-y-6">
                  <div className="flex flex-wrap space-x-4">
                    {review.evaluation?.criteria?.map((category) => (
                      <div key={category} className="w-[30%]">
                        <StarRating
                          name={category}
                          label={category}
                          value={data.review.scores[category]}
                          onChange={(value) =>
                            setData(`review.scores.${category}`, value)
                          }
                          required
                        />
                      </div>
                    ))}
                  </div>
                  {formErrors.scores && (
                    <p className="mb-4 text-sm text-red-600">
                      Scores {formErrors.scores.join(", ")}
                    </p>
                  )}

                  <div>
                    <label className="label" htmlFor="comment">
                      Review Comment
                    </label>
                    <TextAreaWithCounter
                      id="comment"
                      value={data.review.comment}
                      onChange={(val) => setData("review.comment", val)}
                      maxLength={400}
                      placeholder="Provide detailed feedback for the proposal"
                    />
                  </div>

                  <div
                    className="animate-slide-up flex flex-col justify-start space-y-4 sm:flex-row-reverse sm:space-y-0 sm:space-x-4 sm:space-x-reverse"
                    style={{ animationDelay: "0.2s" }}
                  >
                    {hasReviewed && (
                      <button
                        className="btn btn-outline flex cursor-pointer items-center justify-center"
                        onClick={() => {
                          setEditing(false);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="btn btn-primary flex cursor-pointer items-center justify-center"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              </>
            )}

            {hasReviewed && !editing && (
              <>
                <h2 className="mb-6 border-b border-neutral-200 pb-4 text-xl font-bold">
                  Your Review
                </h2>
                <div className="border-b border-neutral-200 pb-6 last:border-0 last:pb-0">
                  <div className="mb-4 grid grid-cols-3 gap-4">
                    {review.evaluation?.criteria?.map((category) => (
                      <div key={category}>
                        <StarRating
                          label={category}
                          value={review.scores?.[category]}
                          readonly
                        />
                      </div>
                    ))}
                  </div>
                  <hr className="my-4" />
                  <p className="whitespace-pre-line text-neutral-700">
                    {review.comment}
                  </p>
                  <div
                    className="animate-slide-up flex flex-col justify-start space-y-4 sm:flex-row-reverse sm:space-y-0 sm:space-x-4 sm:space-x-reverse"
                    style={{ animationDelay: "0.2s" }}
                  >
                    {submissionsAllowed && (
                      <button
                        className="btn btn-outline flex cursor-pointer items-center justify-center"
                        onClick={() => setEditing(true)}
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
  );
}
