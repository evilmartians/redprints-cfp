import { Link, router, usePage } from "@inertiajs/react";
import { AlertCircleIcon, ExternalLinkIcon } from "lucide-react";

import Layout from "@/components/Layout";
import ReviewScores from "@/components/ReviewScores";
import StatusBadge from "@/components/StatusBadge";
import type { Evaluation, Review } from "@/serializers";
import { formatDeadline } from "@/utils/dateHelpers";

interface IndexProps {
  evaluation: Evaluation;
  reviews: Review[];
}

export default function Index({ reviews, evaluation }: IndexProps) {
  const { user } = usePage().props;

  const pendingReviews = reviews.filter(
    (review) => review.status === "pending",
  );
  const completedReviews = reviews.filter(
    (review) => review.status === "submitted",
  );

  const scoreClass = (value: number) => {
    const maxScore = 5 * evaluation.criteria.length;

    const percentage = value / maxScore;

    if (percentage >= 0.8) {
      return "badge-accepted";
    }

    if (percentage >= 0.6) {
      return "badge-waitlist";
    }

    return "badge-draft";
  };

  const renderReviews = (title: string, reviews: Review[], test_id: string) => {
    if (reviews.length === 0) return null;

    return (
      <div className="not-first:mt-8" data-test-id={test_id}>
        <h2 className="mb-4 text-xl font-bold">
          {title} ({reviews.length})
        </h2>
        <div className="card border-secondary-800 animate-slide-up overflow-hidden border">
          <div className="overflow-x-auto">
            <table className="divide-secondary-800 min-w-full divide-y">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="text-cloud-800 w-2/3 p-2 text-left text-xs font-medium tracking-wider uppercase sm:px-6 sm:py-3"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="text-cloud-800 p-2 text-left text-xs font-medium tracking-wider uppercase sm:px-6 sm:py-3"
                  >
                    Track
                  </th>
                  {!evaluation.blind && (
                    <th
                      scope="col"
                      className="text-cloud-800 p-2 text-left text-xs font-medium tracking-wider uppercase sm:px-6 sm:py-3"
                    >
                      Speaker
                    </th>
                  )}
                  <th
                    scope="col"
                    className="text-cloud-800 p-2 text-left text-xs font-medium tracking-wider uppercase sm:px-6 sm:py-3"
                  >
                    Review Status
                  </th>
                  <th
                    scope="col"
                    className="text-cloud-800 p-2 text-center text-xs font-medium tracking-wider uppercase sm:px-6 sm:py-3"
                  ></th>
                </tr>
              </thead>
              <tbody className="divide-secondary-800 divide-y bg-white">
                {reviews.map((review) => (
                  <tr
                    key={review.id}
                    className="hover:bg-secondary-50 cursor-pointer transition-colors"
                    onClick={(e) => {
                      // Prevent navigation if clicking on the external link button
                      if (
                        (e.target as HTMLElement).closest(".external-link-btn")
                      ) {
                        return;
                      }
                      router.get(`/reviews/${review.id}`);
                    }}
                  >
                    <td className="p-2 sm:px-6 sm:py-4">
                      <div className="text-sm font-medium break-words">
                        {review.proposal!.title}
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap sm:px-6 sm:py-4">
                      <div className="text-secondary-800 text-sm">
                        {review.proposal!.track}
                      </div>
                    </td>
                    {!evaluation.blind && (
                      <td className="p-2 whitespace-nowrap sm:px-6 sm:py-4">
                        <div className="text-secondary-800 text-sm">
                          {review.user!.name}
                        </div>
                      </td>
                    )}
                    <td className="p-2 whitespace-nowrap sm:px-6 sm:py-4">
                      {review.status !== "submitted" && (
                        <StatusBadge status={review.status} />
                      )}
                      {review.status === "submitted" && (
                        <div className="flex flex-col items-center space-y-2">
                          <span
                            className={`badge ${scoreClass(review.score!)}`}
                          >
                            Score: {review.score}
                          </span>
                          <ReviewScores scores={review.scores} />
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-center whitespace-nowrap sm:px-6 sm:py-4">
                      <button
                        className="external-link-btn text-secondary-600 hover:text-secondary-800 inline-flex cursor-pointer items-center justify-center rounded-md p-2 transition-colors hover:bg-white"
                        onClick={() =>
                          window.open(`/reviews/${review.id}`, "_blank")
                        }
                        title="Open in new tab"
                      >
                        <ExternalLinkIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout currentUser={user}>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Show warning banner when submissions are not allowed */}
          {!evaluation.submissions_allowed && (
            <div className="animate-slide-up mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-center">
                <AlertCircleIcon className="mr-2 h-5 w-5 flex-shrink-0 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">
                    The evaluation deadline has passed
                  </p>
                  <p className="mt-1 text-sm text-red-700">
                    You can view your submitted reviews, but you cannot submit
                    new reviews or edit existing ones.
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="animate-fade-in mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Proposals Evaluation</h1>
              <p className="text-cloud-700">Review conference talk proposals</p>
              {evaluation.deadline && (
                <p
                  className={`mt-2 text-sm font-medium ${formatDeadline(evaluation.deadline).className}`}
                >
                  Deadline: {formatDeadline(evaluation.deadline).text}
                </p>
              )}
              {evaluation.can_see_results && (
                <Link
                  href={`/evaluations/${evaluation.id}/results`}
                  className="btn btn-outline mt-2"
                >
                  Results
                </Link>
              )}
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="card border-secondary-700 animate-slide-up border py-16 text-center">
              <h3 className="text-cloud-800 mb-4 text-xl font-medium">
                You don’t have any proposals pending review yet
              </h3>
            </div>
          ) : (
            <>
              {renderReviews("Pending Reviews", pendingReviews, "pending")}
              {renderReviews(
                "Completed Reviews",
                completedReviews,
                "completed",
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
