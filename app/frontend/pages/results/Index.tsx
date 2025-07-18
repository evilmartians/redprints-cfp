import Layout from "../../components/Layout";
import { useState } from 'react';
import { usePage } from "@inertiajs/react";
import { Evaluation, Review, EvaluationsProposal } from "../../serializers";
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import ReviewScores from "../../components/ReviewScores";

interface IndexProps {
  evaluation: Evaluation
  reviews: Review[]
  proposals: EvaluationsProposal[]
}

const restoreSelectedProposals = (evaluation: Evaluation): number[] => {
  const data = localStorage.getItem(`evaluations/${evaluation.id}/proposals/picked`);
  if (!data) return [];

  return JSON.parse(data);
}

const storeSelectedProposals = (evaluation: Evaluation, ids: number[]) => {
  localStorage.setItem(`evaluations/${evaluation.id}/proposals/picked`, JSON.stringify(ids));
}

export default function Index({ reviews, evaluation, proposals }: IndexProps) {
  const { user } = usePage().props;
  const [selectedProposals, setSelectedProposals] = useState(restoreSelectedProposals(evaluation));
  const [expandedComments, setExpandedComments] = useState<{[key: string]: boolean}>({});

  const progress = reviews.filter(review => review.status === 'submitted').length / reviews.length;

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

  const toggleProposalSelection = (proposalId: number) => {
    setSelectedProposals((prev) => {
      const newVal = prev.includes(proposalId)
        ? prev.filter(id => id !== proposalId)
        : [...prev, proposalId];

      storeSelectedProposals(evaluation, newVal);
      return newVal;
    });
  };

  const toggleCommentExpansion = (key: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const sortedProposals = proposals.sort((a, b) => {
    if (!a.reviews_count && b.reviews_count) return 1;
    if (a.reviews_count && !b.reviews_count) return -1;

    if (a.reviews_count && b.reviews_count) return (a.score / a.reviews_count) > (b.score / b.reviews_count) ? -1 : 1;

    return 0;
  });
  const pendingProposals = sortedProposals.filter(proposal => !selectedProposals.includes(proposal.id));
  const pickedProposals = sortedProposals.filter(proposal => selectedProposals.includes(proposal.id));

  const renderProposals = (title: string, proposals: EvaluationsProposal[], test_id: string) => {
    if (proposals.length === 0) return null;

    return <div className="not-first:mt-8" test-id={test_id}>
      <h2 className="text-xl font-bold mb-4">{title} ({proposals.length})</h2>
      <div className="card border border-secondary-800 overflow-hidden animate-slide-up">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-800">
            <thead>
              <tr>
                <th scope="col" className="p-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-cloud-800 uppercase tracking-wider w-1/3">
                  Title
                </th>
                <th scope="col" className="p-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-cloud-800 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="p-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-cloud-800 uppercase tracking-wider">
                  Comments
                </th>
                <th scope="col" className="px-2 py-4"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-800">
              {proposals.map((proposal) => {
                const proposal_reviews = reviews.filter(review => review.proposal!.id == proposal.id);
                const current_review = proposal_reviews.find(review => review.user?.id == user.id);

                return (
                  <tr
                    key={proposal.id}
                    className=""
                  >
                    <td className="p-2 sm:px-6 sm:py-4">
                      {current_review && (
                        <a href={`/reviews/${current_review!.id}`} target="_blank" className="text-sm font-medium text-cloud-900 leading-tight hover:text-secondary-700">
                          {proposal.title}
                        </a>
                      )}
                      {!current_review && (
                        <div className="text-sm font-medium text-cloud-900 leading-tight">
                          {proposal.title}
                        </div>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="text-sm text-secondary-700">{proposal.speaker_profile!.name}</div>
                        <div className="badge badge-submitted">{proposal.track}</div>
                      </div>
                    </td>
                    <td className="p-2 sm:px-6 sm:py-4 whitespace-nowrap">
                      {(proposal.reviews_count > 0) && (
                        <div className="flex items-center space-x-2">
                          <span className={`badge ${scoreClass(proposal.score / proposal.reviews_count)}`}>
                            {(proposal.score / proposal.reviews_count).toFixed(1)}
                          </span>
                          <div className="flex flex-col space-y-2">
                            {proposal_reviews.map((review, index) => {
                              return <ReviewScores key={index} scores={review.scores} />
                            })}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="p-2 sm:px-6 sm:py-4">
                      <div className="space-y-2 max-w-md">
                        {proposal_reviews.map((review, index) => {
                          if (!review.comment) return null;

                          const commentKey = `${proposal.id}-${index}`;
                          const isExpanded = expandedComments[commentKey];
                          const isLong = review.comment.length > 60;

                          return (
                            <div key={index} className="text-xs text-cloud-600 bg-neutral-50 rounded p-2">
                              <div className={isExpanded ? '' : 'line-clamp-2'}>
                                {review.comment}
                              </div>
                              {isLong && (
                                <button
                                  onClick={() => toggleCommentExpansion(commentKey)}
                                  className="mt-1 text-primary-600 hover:text-primary-800 flex items-center text-xs font-medium"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronDownIcon className="h-3 w-3 mr-1" />
                                      Show less
                                    </>
                                  ) : (
                                    <>
                                      <ChevronRightIcon className="h-3 w-3 mr-1" />
                                      Show more
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="p-2 sm:px-6 sm:py-4 text-right">
                      {!selectedProposals.includes(proposal.id) && (
                        <button
                          className="btn btn-secondary px-2 py-1 text-sm cursor-pointer"
                          onClick={() => toggleProposalSelection(proposal.id)}
                        >Pick
                        </button>
                      )}
                      {selectedProposals.includes(proposal.id) && (
                        <button
                          className="btn btn-outline px-2 py-1 text-sm cursor-pointer"
                          onClick={() => toggleProposalSelection(proposal.id)}
                        >Unpick
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
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
              <h1 className="text-3xl font-bold mb-2">Evaluation Results</h1>

              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-cloud-700">Progress:</span>
                  <div className="flex-1 bg-secondary-200 rounded-full h-2 max-w-xs">
                    <div
                      className="bg-secondary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round(progress * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-cloud-600">{Math.round(progress * 100)}%</span>
                </div>

                <p className="text-red-800 font-medium">
                  Picked proposals are only stored in the current browser.
                </p>
              </div>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="card border border-secondary-700 text-center py-16 animate-slide-up">
              <h3 className="text-xl font-medium text-cloud-800 mb-4">This evaluation has no reviews yet</h3>
            </div>
          ) : (
            <>
              {renderProposals("Picked Proposals", pickedProposals, "selected-proposals")}
              {renderProposals("Unpicked Proposals", pendingProposals, "proposals")}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
