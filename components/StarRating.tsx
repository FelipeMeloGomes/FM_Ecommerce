import { StarIcon } from "lucide-react";
import React from "react";

interface StarRatingProps {
  rating?: number;
}

const StarRating = React.memo(({ rating = 4 }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          size={14}
          className={star <= rating ? "text-shop_orange" : "text-muted"}
          fill={star <= rating ? "#fb6c08" : "none"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
});

StarRating.displayName = "StarRating";

export default StarRating;
