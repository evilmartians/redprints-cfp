import Layout from "../../components/Layout";
import { usePage, router } from "@inertiajs/react";
import { Evaluation } from "../../serializers";
import { formatDeadline } from "../../utils/dateHelpers";

interface IndexProps {
  evaluations: Evaluation[]
}

export default function Index({ evaluations }: IndexProps) {
  const { user } = usePage().props;

  return (
    <Layout currentUser={user}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Evaluations</h1>
            </div>
          </div>

          {evaluations.length === 0 ? (
            <div className="card border border-sky-700 text-center py-16 animate-slide-up">
              <h3 className="text-xl font-medium text-cloud-800 mb-4">You don't have any proposal evaluations assigned yet</h3>
            </div>
          ) : (
            <div className="card border border-sky-800 overflow-hidden animate-slide-up">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-sky-800">
                  <thead>
                    <tr>
                      <th scope="col" className="p-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-cloud-800 uppercase tracking-wider">
                        Evaluation
                      </th>
                      <th scope="col" className="p-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-cloud-800 uppercase tracking-wider">
                        Tracks
                      </th>
                      <th scope="col" className="p-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-cloud-800 uppercase tracking-wider">
                        Deadline
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-sky-800">
                    {evaluations.map((evaluation) => (
                      <tr
                        key={evaluation.id}
                        className="hover:bg-sky-50 transition-colors cursor-pointer"
                        onClick={() => router.get(`/evaluations/${evaluation.id}/reviews`)}
                      >
                        <td className="p-2 sm:px-6 sm:py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">{evaluation.name}</div>
                        </td>
                        <td className="p-2 sm:px-6 sm:py-4 whitespace-nowrap">
                          {evaluation.tracks.map((track) => (
                            <span key={track} className="badge-draft">{track}</span>
                          ))}
                        </td>
                        <td className="p-2 sm:px-6 sm:py-4 whitespace-nowrap">
                          {evaluation.deadline ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              formatDeadline(evaluation.deadline).isPast 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {formatDeadline(evaluation.deadline).isPast ? '🔒' : '🕐'} {formatDeadline(evaluation.deadline).text}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">No deadline</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
