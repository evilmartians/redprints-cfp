import React from 'react';

type ProposalStatus = 'draft' | 'submitted' | 'accepted' | 'rejected' | 'waitlisted' | 'pending';

interface StatusBadgeProps {
  status: ProposalStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let badgeClasses = 'badge ';
  let statusText = '';

  switch (status) {
    case 'draft':
      badgeClasses += 'badge-draft';
      statusText = 'Draft';
      break;
    case 'pending':
      badgeClasses += 'badge-draft';
      statusText = 'Pending';
      break;
    case 'submitted':
      badgeClasses += 'badge-submitted';
      statusText = 'Submitted';
      break;
    case 'accepted':
      badgeClasses += 'badge-accepted';
      statusText = 'Accepted';
      break;
    case 'rejected':
      badgeClasses += 'badge-rejected';
      statusText = 'Not Accepted';
      break;
    case 'waitlisted':
      badgeClasses += 'badge-waitlist';
      statusText = 'Waitlist';
      break;
    default:
      badgeClasses += 'badge-submitted';
      statusText = 'Submitted';
  }

  return (
    <span className={badgeClasses}>{statusText}</span>
  );
};

export default StatusBadge;
