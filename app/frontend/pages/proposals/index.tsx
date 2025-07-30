import { Head, Link, router, usePage } from "@inertiajs/react";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";

import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";
import type { Proposal } from "@/serializers";

interface IndexProps {
  proposals: Proposal[];
}

export default function Index({ proposals }: IndexProps) {
  const { user, cfp_closed } = usePage().props;

  // Helper function to format the date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "–";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "2-digit",
    });
  };

  return (
    <Layout currentUser={user}>
      <Head title="My proposals" />

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-cloud-600 hover:text-cloud-700 mb-6 flex items-center transition-colors"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back home
        </Link>

        <div className="mx-auto max-w-4xl">
          <div className="animate-fade-in mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <div>
              <h1 className="mb-2 text-3xl font-bold">My Proposals</h1>
              <p className="text-cloud-700">
                Track and manage your conference talk proposals
              </p>
            </div>
          </div>

          {proposals.length === 0 ? (
            <div className="card border-secondary-700 animate-slide-up border py-16 text-center">
              <h3 className="text-cloud-800 mb-4 text-xl font-medium">
                You haven’t submitted any proposals yet
              </h3>
              {!cfp_closed && (
                <>
                  <p className="text-cloud-700 mx-auto mb-8 max-w-md">
                    Share your knowledge with the Ruby community by submitting a
                    proposal for EXAMPLE Conference.
                  </p>
                  <Link
                    href={`/proposals/new`}
                    className="btn btn-primary inline-flex items-center"
                  >
                    <PlusIcon className="mr-2 h-5 w-5" />
                    Submit Your First Proposal
                  </Link>
                </>
              )}
            </div>
          ) : (
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
                      <th
                        scope="col"
                        className="text-cloud-800 p-2 text-left text-xs font-medium tracking-wider uppercase sm:px-6 sm:py-3"
                      >
                        Submitted On
                      </th>
                      <th
                        scope="col"
                        className="text-cloud-800 p-2 text-left text-xs font-medium tracking-wider uppercase sm:px-6 sm:py-3"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-secondary-800 divide-y bg-white">
                    {proposals.map((proposal) => (
                      <tr
                        key={proposal.id}
                        className="hover:bg-secondary-50 cursor-pointer transition-colors"
                        onClick={() => router.get(`/proposals/${proposal.id}`)}
                      >
                        <td className="p-2 sm:px-6 sm:py-4">
                          <div className="text-sm font-medium break-words">
                            {proposal.title}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap sm:px-6 sm:py-4">
                          <div className="text-secondary-800 text-sm">
                            {proposal.track}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap sm:px-6 sm:py-4">
                          <div className="text-sm">
                            {formatDate(proposal.submitted_at)}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap sm:px-6 sm:py-4">
                          <StatusBadge status={proposal.status} />
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
