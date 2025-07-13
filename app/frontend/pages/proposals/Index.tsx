import Layout from "../../components/Layout";
import { ArrowLeftIcon, PlusIcon } from 'lucide-react';
import StatusBadge from "../../components/StatusBadge";
import { usePage, Link, router } from "@inertiajs/react";
import { Proposal } from "../../serializers";

interface IndexProps {
  proposals: Proposal[]
}

export default function Index({ proposals }: IndexProps) {
  const { user, cfp_closed } = usePage().props;

  // Helper function to format the date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '–';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: '2-digit'
    });
  };

  return (
    <Layout currentUser={user}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="flex items-center text-cloud-600 hover:text-cloud-700 transition-colors mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Proposals</h1>
              <p className="text-cloud-700">
                Track and manage your conference talk proposals
              </p>
            </div>
          </div>

          {proposals.length === 0 ? (
            <div className="card border border-sky-700 text-center py-16 animate-slide-up">
              <h3 className="text-xl font-medium text-cloud-800 mb-4">You haven't submitted any proposals yet</h3>
              {!cfp_closed && (
                <>
                  <p className="text-cloud-700 mb-8 max-w-md mx-auto">
                    Share your knowledge with the Ruby community by submitting a proposal for SF Ruby Conference.
                  </p>
                  <Link
                    href={`/proposals/new`}
                    className="btn btn-ruby inline-flex items-center"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Submit Your First Proposal
                  </Link>
                </>
              )}
            </div>
          ) : (
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
                        Submitted On
                      </th>
                      <th scope="col" className="p-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-cloud-800 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-sky-800">
                    {proposals.map((proposal) => (
                      <tr
                        key={proposal.id}
                        className="hover:bg-sky-50 transition-colors cursor-pointer"
                        onClick={() => router.get(`/proposals/${proposal.id}`)}
                      >
                        <td className="p-2 sm:px-6 sm:py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">{proposal.title}</div>
                        </td>
                        <td className="p-2 sm:px-6 sm:py-4 whitespace-nowrap">
                          <div className="text-sm text-sky-800">{proposal.track}</div>
                        </td>
                        <td className="p-2 sm:px-6 sm:py-4 whitespace-nowrap">
                          <div className="text-sm">{formatDate(proposal.submitted_at)}</div>
                        </td>
                        <td className="p-2 sm:px-6 sm:py-4 whitespace-nowrap">
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
