import { Star } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  name?: string;
  onChange?: (rating: number) => void;
  label?: string;
  required?: boolean;
  readonly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  value,
  name,
  onChange,
  label,
  required,
  readonly,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (rating: number) => {
    if (onChange) onChange(rating);
  };

  const handleStarHover = (rating: number) => {
    setHoverRating(rating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const getStarColor = (starIndex: number, readonly = false) => {
    const currentRating = hoverRating || value;
    if (starIndex <= currentRating) {
      return "text-yellow-400 fill-yellow-400";
    }
    if (readonly) return "text-cloud-300";

    return "text-cloud-300 hover:text-yellow-300";
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="label">
          {label} {required && <span className="text-primary-600">*</span>}
        </label>
      )}
      <div
        className="flex items-center space-x-1"
        onMouseLeave={handleMouseLeave}
      >
        {readonly &&
          [1, 2, 3, 4, 5].map((starIndex) => (
            <span
              key={starIndex}
              className={`rounded ${getStarColor(starIndex, true)}`}
            >
              <Star className="h-8 w-8" />
            </span>
          ))}
        {!readonly &&
          [1, 2, 3, 4, 5].map((starIndex) => (
            <button
              key={starIndex}
              type="button"
              name={`${name}[${starIndex}]`}
              onClick={() => handleStarClick(starIndex)}
              onMouseEnter={() => handleStarHover(starIndex)}
              className={`rounded transition-all duration-150 hover:scale-110 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 focus:outline-none ${getStarColor(starIndex)}`}
              aria-label={`Rate ${starIndex} star${starIndex !== 1 ? "s" : ""}`}
            >
              <Star className="h-8 w-8" />
            </button>
          ))}
        {(hoverRating || value) > 0 && (
          <span className="text-cloud-600 ml-3 text-sm font-medium">
            {hoverRating || value}/5
          </span>
        )}
      </div>
    </div>
  );
};

export default StarRating;
