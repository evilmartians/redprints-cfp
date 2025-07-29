const URL_REGEX =
  /(?<!["'])(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/[^\s<]*)?)/g;

function detectUrls(text: string): { urls: string[]; positions: number[] } {
  const urls: string[] = [];
  const positions: number[] = [];
  let match;

  while ((match = URL_REGEX.exec(text)) !== null) {
    urls.push(match[0]);
    positions.push(match.index);
  }

  return { urls, positions };
}

export function linkifyText(text: string): string {
  const { urls, positions } = detectUrls(text);

  if (urls.length === 0) return text;

  let result = "";
  let lastIndex = 0;

  urls.forEach((url, i) => {
    const position = positions[i];
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;

    // Add text before the URL
    result += text.slice(lastIndex, position);

    // Add the URL as a link
    result += `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">${url}</a>`;

    lastIndex = position + url.length;
  });

  // Add remaining text
  result += text.slice(lastIndex);

  return result;
}

export const linkify = (content: string) => {
  // Split content by HTML tags
  const parts = content.split(/(<[^>]+>)/);
  return parts
    .map((part) => {
      if (part.startsWith("<")) {
        // Return HTML tags as is
        return part;
      } else {
        // Process text content for URLs
        return linkifyText(part);
      }
    })
    .join("");
};
