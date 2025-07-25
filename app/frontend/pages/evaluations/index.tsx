import { router, usePage } from "@inertiajs/react";

import Layout from "../../components/Layout";
import type { Evaluation } from "../../serializers";
import { formatDeadline } from "../../utils/dateHelpers";

interface IndexProps {
  evaluations: Evaluation[];
}

export default function Index({ evaluations }: IndexProps) {
  const { user } = usePage().props;

  return (
    <Layout currentUser={user}>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="animate-fade-in mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <div>
              <h1 className="mb-2 text-3xl font-bold">My Evaluations</h1>
            </div>
          </div>

          {evaluations.length === 0 ? (
            <div className="card border-secondary-700 animate-slide-up border py-16 text-center">
              <h3 className="text-cloud-800 mb-4 text-xl font-medium">
                You don’t have any proposal evaluations assigned yet
              </h3>
            </div>
          ) : (
            <div className="card border-secondary-800 animate-slide-up overflow-hidden border">
              <div className="overflow-x-auto">
                <table className="divide-secondary-800 min-w-full divide-y">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="text-cloud-800 p-2 text-left text-xs font-medium tracking-wider uppercase sm:px-6 sm:py-3"
                      >
                        Evaluation
                      </th>
                      <th
                        scope="col"
                        className="text-cloud-800 p-2 text-left text-xs font-medium tracking-wider uppercase sm:px-6 sm:py-3"
                      >
                        Tracks
                      </th>
                      <th
                        scope="col"
                        className="text-cloud-800 p-2 text-left text-xs font-medium tracking-wider uppercase sm:px-6 sm:py-3"
                      >
                        Deadline
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-secondary-800 divide-y bg-white">
                    {evaluations.map((evaluation) => (
                      <tr
                        key={evaluation.id}
                        className="hover:bg-secondary-50 cursor-pointer transition-colors"
                        onClick={() =>
                          router.get(`/evaluations/${evaluation.id}/reviews`)
                        }
                      >
                        <td className="p-2 whitespace-nowrap sm:px-6 sm:py-4">
                          <div className="text-sm font-medium">
                            {evaluation.name}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap sm:px-6 sm:py-4">
                          {evaluation.tracks.map((track) => (
                            <span key={track} className="badge-draft">
                              {track}
                            </span>
                          ))}
                        </td>
                        <td className="p-2 whitespace-nowrap sm:px-6 sm:py-4">
                          {evaluation.deadline ? (
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                formatDeadline(evaluation.deadline).isPast
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {formatDeadline(evaluation.deadline).isPast
                                ? "🔒"
                                : "🕐"}{" "}
                              {formatDeadline(evaluation.deadline).text}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">
                              No deadline
                            </span>
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
