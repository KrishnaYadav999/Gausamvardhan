import React from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating = 0, count = 0 }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={
            i <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">
        ({rating || 0})
      </span>
      {count > 0 && (
        <span className="text-xs text-gray-400 ml-1">
          • {count} reviews
        </span>
      )}
    </div>
  );
};

export default StarRating;
