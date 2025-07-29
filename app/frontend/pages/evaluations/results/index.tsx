import { Link, useForm, usePage } from "@inertiajs/react";
import {
  ArrowLeftIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  TimerIcon,
  XIcon,
} from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";

import Layout from "../../../components/Layout";
import ReviewScores from "../../../components/ReviewScores";
import StatusBadge from "../../../components/StatusBadge";
import type {
  Evaluation,
  EvaluationsProposal,
  Review,
} from "../../../serializers";

interface IndexProps {
  evaluation: Evaluation;
  reviews: Review[];
  proposals: EvaluationsProposal[];
}

type proposalStatus = "accepted" | "waitlisted" | "rejected";

const restoreSelectedProposals = (
  evaluation: Evaluation,
): Record<string, proposalStatus> => {
  const data = localStorage.getItem(`evaluations/${evaluation.id}/results`);
  if (!data) return {};

  return JSON.parse(data) as Record<string, proposalStatus>;
};

const storeSelectedProposals = (
  evaluation: Evaluation,
  statuses: Record<string, proposalStatus>,
) => {
  localStorage.setItem(
    `evaluations/${evaluation.id}/results`,
    JSON.stringify(statuses),
  );
};

export default function Index({ reviews, evaluation, proposals }: IndexProps) {
  const { user } = usePage().props;

  const [selectedProposals, setSelectedProposals] = useState(
    restoreSelectedProposals(evaluation),
  );
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});

  const { data, setData, post } = useForm({
    proposals: Object.entries(selectedProposals).map(([id, status]) => ({
      id,
      status,
    })),
  });

  function submitReview(e: FormEvent) {
    e.preventDefault();

    if (
      confirm(
        "Are you sure you want to submit the selected results? This will cause notifications sent to the speakers",
      )
    ) {
      post(`/evaluations/${evaluation.id}/results`, { preserveScroll: true });
    }
  }

  const progress =
    reviews.filter((review) => review.status === "submitted").length /
    reviews.length;

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

  const toggleProposalSelection = (
    proposalId: string,
    status: proposalStatus,
  ) => {
    const wasSelected = selectedProposals[proposalId] === status;

    setSelectedProposals((prev) => {
      if (status !== prev[proposalId]) {
        prev[proposalId] = status;
      } else {
        delete prev[proposalId];
      }
      storeSelectedProposals(evaluation, prev);
      return { ...prev };
    });

    if (wasSelected) {
      setData(`proposals`, [
        ...data.proposals.filter((v) => v.id != proposalId),
      ]);
    } else {
      setData(`proposals`, [
        ...data.proposals.filter((v) => v.id != proposalId),
        { id: proposalId, status },
      ]);
    }
  };

  const toggleCommentExpansion = (key: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const sortedProposals = proposals.sort((a, b) => {
    if (!a.reviews_count && b.reviews_count) return 1;
    if (a.reviews_count && !b.reviews_count) return -1;

    if (a.reviews_count && b.reviews_count)
      return a.score / a.reviews_count > b.score / b.reviews_count ? -1 : 1;

    return 0;
  });

  const canSubmit = evaluation.can_submit;

  const pendingProposals = sortedProposals.filter(
    (proposal) => !selectedProposals[proposal.id],
  );
  const acceptedProposals = sortedProposals.filter(
    (proposal) => selectedProposals[proposal.id] === "accepted",
  );
  const waitlistedProposals = sortedProposals.filter(
    (proposal) => selectedProposals[proposal.id] === "waitlisted",
  );
  const rejectedProposals = sortedProposals.filter(
    (proposal) => selectedProposals[proposal.id] === "rejected",
  );

  const renderProposals = (
    title: string,
    proposals: EvaluationsProposal[],
    test_id: string,
  ) => {
    if (proposals.length === 0) return null;

    return (
      <div className="not-first:mt-8" data-test-id={test_id}>
        <h2 className="mb-4 text-xl font-bold">
          {title} ({proposals.length})
        </h2>
        <div className="card border-secondary-800 animate-slide-up overflow-hidden border">
          <div className="overflow-x-auto">
            <table className="divide-secondary-800 min-w-full divide-y">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="text-cloud-800 w-1/3 p-2 text-left text-xs font-medium tracking-wider uppercase sm:px-6 sm:py-3"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="text-cloud-800 p-2 text-left text-xs font-medium tracking-wider uppercase sm:px-6 sm:py-3"
                  >
                    Score
                  </th>
                  <th
                    scope="col"
                    className="text-cloud-800 p-2 text-left text-xs font-medium tracking-wider uppercase sm:px-6 sm:py-3"
                  >
                    Comments
                  </th>
                  <th scope="col" className="px-2 py-4 print:hidden"></th>
                </tr>
              </thead>
              <tbody className="divide-secondary-800 divide-y bg-white">
                {proposals.map((proposal) => {
                  const proposal_reviews = reviews.filter(
                    (review) => review.proposal!.id == proposal.id,
                  );
                  const current_review = proposal_reviews.find(
                    (review) => review.user?.id == user.id,
                  );

                  return (
                    <tr key={proposal.id} className="">
                      <td className="p-2 sm:px-6 sm:py-4">
                        {current_review && (
                          <a
                            href={`/reviews/${current_review.id}`}
                            target="_blank"
                            className="text-cloud-900 hover:text-secondary-700 text-sm leading-tight font-medium"
                            rel="noreferrer"
                          >
                            {proposal.title}
                          </a>
                        )}
                        {!current_review && (
                          <div className="text-cloud-900 text-sm leading-tight font-medium">
                            {proposal.title}
                          </div>
                        )}
                        <div className="mt-2 flex items-center space-x-2">
                          <div className="text-secondary-700 text-sm">
                            {proposal.speaker_profile!.name}
                          </div>
                          <div className="badge badge-submitted">
                            {proposal.track}
                          </div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap sm:px-6 sm:py-4">
                        {proposal.reviews_count > 0 && (
                          <div className="flex items-center space-x-2">
                            <span
                              className={`badge ${scoreClass(proposal.score / proposal.reviews_count)}`}
                            >
                              {(
                                proposal.score / proposal.reviews_count
                              ).toFixed(1)}
                            </span>
                            <div className="flex flex-col space-y-2">
                              {proposal_reviews.map((review, index) => {
                                return (
                                  <ReviewScores
                                    key={index}
                                    scores={review.scores}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="p-2 sm:px-6 sm:py-4">
                        <div className="max-w-md space-y-2">
                          {proposal_reviews.map((review, index) => {
                            if (!review.comment) return null;

                            const commentKey = `${proposal.id}-${index}`;
                            const isExpanded = expandedComments[commentKey];
                            const isLong = review.comment.length > 60;

                            return (
                              <div
                                key={index}
                                className="text-cloud-600 rounded bg-neutral-50 p-2 text-xs print:p-0.5"
                              >
                                <div
                                  className={
                                    isExpanded
                                      ? ""
                                      : "line-clamp-2 print:line-clamp-none"
                                  }
                                >
                                  {review.comment}
                                </div>
                                {isLong && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleCommentExpansion(commentKey)
                                    }
                                    className="text-primary-600 hover:text-primary-800 mt-1 flex items-center text-xs font-medium print:hidden"
                                  >
                                    {isExpanded ? (
                                      <>
                                        <ChevronDownIcon className="mr-1 h-3 w-3" />
                                        Show less
                                      </>
                                    ) : (
                                      <>
                                        <ChevronRightIcon className="mr-1 h-3 w-3" />
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
                      <td className="p-2 text-right sm:px-6 sm:py-4">
                        {proposal.status === "submitted" && (
                          <>
                            <div className="flex justify-end space-x-0.5 print:hidden">
                              <button
                                type="button"
                                className={`btn cursor-pointer px-1 py-1 text-xs ${selectedProposals[proposal.id] === "accepted" ? "bg-green-800 text-white hover:bg-green-700 focus:ring-green-600" : "border border-green-800 text-green-800 hover:bg-green-100"}`}
                                onClick={() =>
                                  toggleProposalSelection(
                                    proposal.id,
                                    "accepted",
                                  )
                                }
                                aria-label={`Mark proposal "${proposal.title}" as accepted`}
                                aria-pressed={
                                  selectedProposals[proposal.id] === "accepted"
                                }
                              >
                                <span className="sr-only">Accept</span>
                                <CheckIcon />
                              </button>
                              <button
                                type="button"
                                className={`btn cursor-pointer px-1 py-1 text-xs ${selectedProposals[proposal.id] === "waitlisted" ? "bg-cloud-600 hover:bg-cloud-500 focus:ring-cloud-500 text-white" : "text-cloud-600 hover:bg-cloud-100 border-cloud-600 border"}`}
                                onClick={() =>
                                  toggleProposalSelection(
                                    proposal.id,
                                    "waitlisted",
                                  )
                                }
                                aria-label={`Mark proposal "${proposal.title}" as waitlisted`}
                                aria-pressed={
                                  selectedProposals[proposal.id] ===
                                  "waitlisted"
                                }
                              >
                                <span className="sr-only">Waitlist</span>
                                <TimerIcon />
                              </button>
                              <button
                                type="button"
                                className={`btn cursor-pointer px-1 py-1 text-xs ${selectedProposals[proposal.id] === "rejected" ? "bg-red-800 text-white hover:bg-red-700 focus:ring-red-600" : "border border-red-800 text-red-800 hover:bg-red-100"}`}
                                onClick={() =>
                                  toggleProposalSelection(
                                    proposal.id,
                                    "rejected",
                                  )
                                }
                                aria-label={`Mark proposal "${proposal.title}" as rejected`}
                                aria-pressed={
                                  selectedProposals[proposal.id] === "rejected"
                                }
                              >
                                <span className="sr-only">Reject</span>
                                <XIcon />
                              </button>
                            </div>
                            <div className="hidden text-sm font-medium print:block">
                              {selectedProposals[proposal.id] ? (
                                <span className="badge badge-draft">
                                  pending: {selectedProposals[proposal.id]}
                                </span>
                              ) : (
                                "Under Review"
                              )}
                            </div>
                          </>
                        )}
                        {proposal.status !== "submitted" && (
                          <StatusBadge status={proposal.status} />
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
    );
  };

  return (
    <Layout currentUser={user}>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 print:w-full print:px-0">
        <Link
          href={`/evaluations/${evaluation.id}/reviews`}
          className="text-cloud-600 hover:text-cloud-700 mb-6 flex items-center transition-colors print:hidden"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back to evaluation
        </Link>
        <div className="mx-auto max-w-4xl print:w-full">
          <form onSubmit={submitReview}>
            <div className="animate-fade-in mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <div>
                <h1 className="mb-2 text-3xl font-bold">Evaluation Results</h1>

                <div className="space-y-2">
                  <div className="flex items-center space-x-4 print:hidden">
                    <span className="text-cloud-700 text-sm font-medium">
                      Progress:
                    </span>
                    <div className="bg-secondary-200 h-2 max-w-xs flex-1 rounded-full">
                      <div
                        className="bg-secondary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.round(progress * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-cloud-600 text-sm">
                      {Math.round(progress * 100)}%
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary flex cursor-pointer items-center justify-center print:hidden"
                    disabled={!canSubmit}
                    title={
                      canSubmit
                        ? "Submit review results"
                        : "Only admins can submit review results"
                    }
                  >
                    Submit Review Results
                  </button>
                </div>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="card border-secondary-700 animate-slide-up border py-16 text-center">
                <h3 className="text-cloud-800 mb-4 text-xl font-medium">
                  This evaluation has no proposals for review
                </h3>
              </div>
            ) : (
              <>
                {renderProposals(
                  "Accepted",
                  acceptedProposals,
                  "accepted-proposals",
                )}
                {renderProposals(
                  "Waitlisted",
                  waitlistedProposals,
                  "waitlisted-proposals",
                )}
                {renderProposals(
                  "Under Review",
                  pendingProposals,
                  "pending-proposals",
                )}
                {renderProposals(
                  "Rejected",
                  rejectedProposals,
                  "rejected-proposals",
                )}
              </>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
}
