export function formatDeadline(deadline: string | null): {
  text: string;
  isPast: boolean;
  className: string;
} {
  if (!deadline) {
    return {
      text: "No deadline",
      isPast: false,
      className: "text-gray-500",
    };
  }

  const deadlineDate = new Date(deadline);
  const now = new Date();
  const isPast = deadlineDate < now;

  // Format the date
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };

  const formattedDate = deadlineDate.toLocaleDateString("en-US", options);

  // Calculate time difference
  const diffMs = Math.abs(deadlineDate.getTime() - now.getTime());
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  let timeText = "";
  if (diffDays > 0) {
    timeText = `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  } else if (diffHours > 0) {
    timeText = `${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
  } else {
    timeText = "Less than an hour";
  }

  if (isPast) {
    return {
      text: `Closed ${timeText} ago (${formattedDate})`,
      isPast: true,
      className: "text-red-600",
    };
  } else {
    return {
      text: `Closes in ${timeText} (${formattedDate})`,
      isPast: false,
      className: "text-green-600",
    };
  }
}

export function formatSimpleDate(date: string | null): string {
  if (!date) return "N/A";

  const dateObj = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  return dateObj.toLocaleDateString("en-US", options);
}
