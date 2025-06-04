import Layout from "../../components/Layout";
import { Link, usePage, router } from "@inertiajs/react";
import { ArrowLeftIcon, PencilIcon, TrashIcon } from 'lucide-react';
import StatusBadge from "../../components/StatusBadge";
import { Proposal, SpeakerProfile } from "../../serializers";

interface ShowProps {
  proposal: Proposal
  speaker: SpeakerProfile
}

function Show({ proposal, speaker }: ShowProps) {
  const { user } = usePage().props;

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

  const hasFeedback = (proposal.status === 'accepted') ||
    (proposal.status === 'rejected') ||
    (proposal.status === 'waitlisted');

  const handleRetractProposal = () => {
    if (confirm('Are you sure you want to retract this proposal? This action is irreversible and will permanently delete your proposal.')) {
      router.delete(`/proposals/${proposal.id}`);
    }
  };

  return (
  <Layout currentUser={user}>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/proposals"
        className="flex items-center text-cloud-600 hover:text-cloud-700 transition-colors mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        Back to My proposals
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 animate-fade-in">
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-bold mb-2 mr-3">{proposal.title}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <StatusBadge status={proposal.status} />
            </div>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <Link
              href={`/proposals/${proposal.id}/edit`}
              className="btn btn-outline mt-4 sm:mt-0 flex items-center text-nowrap"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit Proposal
            </Link>
            <button
              onClick={handleRetractProposal}
              className="btn btn-outline mt-4 sm:mt-0 flex items-center text-nowrap border-red-300 text-red-700 hover:bg-red-50 focus:ring-red-500 cursor-pointer"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Retract Proposal
            </button>
          </div>
        </div>

        {/* Talk Information */}
        <div className="card border mb-8 animate-slide-up">
          <h2 className="text-xl font-bold mb-6 pb-4 border-b border-sky-700">Talk Information</h2>

          <div className="space-y-6">
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

        {/* Speaker Information */}
        <div className="card border border-sky-700 mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-xl font-bold mb-6 pb-4 border-b border-sky-700">Speaker Profile</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm uppercase font-medium border-sky-700 text-sky-800 mb-2">Name</h3>
                <p className="text-cloud-700">{speaker.name}</p>
              </div>

              <div>
                <h3 className="text-sm uppercase font-medium border-sky-700 text-sky-800 mb-2">Email</h3>
                <p className="text-cloud-700">{speaker.email}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm uppercase font-medium border-sky-700 text-sky-800 mb-2">Company/Organization</h3>
              <p className="text-cloud-700">{speaker.company || "—"}</p>
            </div>

            <div>
              <h3 className="text-sm uppercase font-medium border-sky-700 text-sky-800 mb-2">Bio</h3>
              <p className="text-cloud-700 whitespace-pre-line">{speaker.bio}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm uppercase font-medium border-sky-700 text-sky-800 mb-2">Socials</h3>
                <p className="text-cloud-700">{speaker.socials || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Information - Only shown for non-submitted proposals */}
        {hasFeedback && (
          <div className={`card border ${
            proposal.status === 'accepted'
              ? 'border-accent-200 bg-accent-50'
              : proposal.status === 'rejected'
                ? 'border-error-200 bg-error-50'
                : 'border-warning-200 bg-warning-50'
          } mb-8 animate-slide-up`} style={{ animationDelay: "0.2s" }}>
            <h2 className="text-xl font-bold mb-4">Feedback from the Committee</h2>

            {proposal.status === 'accepted' && (
              <p className="text-accent-800">
                Congratulations! Your proposal has been accepted. We're excited to have you speak at SF Ruby Conference.
                You'll receive an email with further instructions soon.
              </p>
            )}

            {proposal.status === 'rejected' && (
              <>
                <p className="text-error-800 mb-4">
                  Thank you for your submission. After careful consideration, we've decided not to include your talk in this year's program.
                </p>
              </>
            )}

            {proposal.status === 'waitlisted' && (
              <p className="text-warning-800">
                Your proposal has been placed on our waitlist. We had many excellent submissions and limited slots.
                We'll contact you if a spot becomes available. Thank you for your understanding.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  </Layout>
  )
}

export default Show;
