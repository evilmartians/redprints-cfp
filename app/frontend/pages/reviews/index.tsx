import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";
import { usePage, router, Link } from "@inertiajs/react";
import { Evaluation, Review } from "../../serializers";
import { formatDeadline } from "../../utils/dateHelpers";
import { AlertCircleIcon, ExternalLinkIcon } from 'lucide-react';
import ReviewScores from "../../components/ReviewScores";

interface IndexProps {
  evaluation: Evaluation
  reviews: Review[]
}

export default function Index({ reviews, evaluation }: IndexProps) {
  const { user } = usePage().props;

  const pendingReviews = reviews.filter(review => review.status === 'pending');
  const completedReviews = reviews.filter(review => review.status === 'submitted');

  const scoreClass = (value: number) => {
    const maxScore = 5 * evaluation.criteria.length;

    const percentage = value / maxScore;

    if (percentage >= 0.8) {
      return 'badge-accepted';
    }

    if (percentage >= 0.6) {
      return 'badge-waitlist';
    }

    return 'badge-draft';
  }

  const renderReviews = (title: string, reviews: Review[], test_id: string) => {
    if (reviews.length === 0) return null;

    return <div className="not-first:mt-8" test-id={test_id}>
      <h2 className="text-xl font-bold mb-4">{title} ({reviews.length})</h2>
        <div className="card border border-secondary-800 overflow-hidden animate-slide-up">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-800">
            <thead>
              <tr>
                <th scope="col" className="p-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-cloud-800 uppercase tracking-wider w-2/3">
                  Title
                </th>
                <th scope="col" className="p-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-cloud-800 uppercase tracking-wider">
                  Track
                </th>
                {!evaluation.blind && (
                  <th scope="col" className="p-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-cloud-800 uppercase tracking-wider">
                    Speaker
                  </th>
                )}
                <th scope="col" className="p-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-cloud-800 uppercase tracking-wider">
                  Review Status
                </th>
                <th scope="col" className="p-2 sm:px-6 sm:py-3 text-center text-xs font-medium text-cloud-800 uppercase tracking-wider">

                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-800">
              {reviews.map((review) => (
                <tr
                  key={review.id}
                  className="hover:bg-secondary-50 transition-colors cursor-pointer"
                  onClick={(e) => {
                    // Prevent navigation if clicking on the external link button
                    if ((e.target as HTMLElement).closest('.external-link-btn')) {
                      return;
                    }
                    router.get(`/reviews/${review.id}`);
                  }}
                >
                  <td className="p-2 sm:px-6 sm:py-4">
                    <div className="text-sm font-medium break-words">{review.proposal!.title}</div>
                  </td>
                  <td className="p-2 sm:px-6 sm:py-4 whitespace-nowrap">
                    <div className="text-sm text-secondary-800">{review.proposal!.track}</div>
                  </td>
                  {!evaluation.blind && (
                    <td className="p-2 sm:px-6 sm:py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-800">{review.user!.name}</div>
                    </td>
                  )}
                  <td className="p-2 sm:px-6 sm:py-4 whitespace-nowrap">
                    {review.status !== 'submitted' && (
                      <StatusBadge status={review.status} />
                    )}
                    {review.status === 'submitted' && (
                      <div className="flex flex-col space-y-2 items-center">
                        <span className={`badge ${scoreClass(review.score!)}`}>Score: {review.score}</span>
                        <ReviewScores scores={review.scores} />
                      </div>
                    )}
                  </td>
                  <td className="p-2 sm:px-6 sm:py-4 whitespace-nowrap text-center">
                    <button
                      className="external-link-btn inline-flex items-center justify-center p-2 text-secondary-600 hover:text-secondary-800 hover:bg-white rounded-md transition-colors cursor-pointer"
                      onClick={() => window.open(`/reviews/${review.id}`, '_blank')}
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
  }

  return (
    <Layout currentUser={user}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Show warning banner when submissions are not allowed */}
          {!evaluation.submissions_allowed && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 animate-slide-up">
              <div className="flex items-center">
                <AlertCircleIcon className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">
                    The evaluation deadline has passed
                  </p>
                  <p className="text-red-700 text-sm mt-1">
                    You can view your submitted reviews, but you cannot submit new reviews or edit existing ones.
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold mb-2">Proposals Evaluation</h1>
              <p className="text-cloud-700">
                Review conference talk proposals
              </p>
              {evaluation.deadline && (
                <p className={`mt-2 text-sm font-medium ${formatDeadline(evaluation.deadline).className}`}>
                  Deadline: {formatDeadline(evaluation.deadline).text}
                </p>
              )}
              {evaluation.can_see_results && (
                <Link href={`/evaluations/${evaluation.id}/results`} className="btn btn-outline mt-2">Results</Link>
              )}
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="card border border-secondary-700 text-center py-16 animate-slide-up">
              <h3 className="text-xl font-medium text-cloud-800 mb-4">You don't have any proposals pending review yet</h3>
            </div>
          ) : (
            <>
              {renderReviews("Pending Reviews", pendingReviews, "pending")}
              {renderReviews("Completed Reviews", completedReviews, "completed")}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
