import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";
import { usePage, router } from "@inertiajs/react";
import { Review } from "../../serializers";

interface IndexProps {
  reviews: Review[]
}

export default function Index({ reviews }: IndexProps) {
  const { user } = usePage().props;

  const pendingReviews = reviews.filter(review => review.status === 'pending');
  const completedReviews = reviews.filter(review => review.status === 'submitted');

  const renderReviews = (title: string, reviews: Review[], test_id: string) => {
    if (reviews.length === 0) return null;

    return <div className="not-first:mt-8" test-id={test_id}>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="card border border-sky-800 overflow-hidden animate-slide-up">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-sky-800">
            <thead>
              <tr>
                <th scope="col" className="p-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-cloud-800 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="p-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-cloud-800 uppercase tracking-wider">
                  Track
                </th>
                <th scope="col" className="p-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-cloud-800 uppercase tracking-wider">
                  Review Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-sky-800">
              {reviews.map((review) => (
                <tr
                  key={review.id}
                  className="hover:bg-sky-50 transition-colors cursor-pointer"
                  onClick={() => router.get(`/reviews/${review.id}`)}
                >
                  <td className="p-2 sm:px-6 sm:py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{review.proposal!.title}</div>
                  </td>
                  <td className="p-2 sm:px-6 sm:py-4 whitespace-nowrap">
                    <div className="text-sm text-sky-800">{review.proposal!.track}</div>
                  </td>
                  <td className="p-2 sm:px-6 sm:py-4 whitespace-nowrap">
                    <StatusBadge status={review.status} />
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold mb-2">Proposals Evaluation</h1>
              <p className="text-cloud-700">
                Review conference talk proposals
              </p>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="card border border-sky-700 text-center py-16 animate-slide-up">
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
