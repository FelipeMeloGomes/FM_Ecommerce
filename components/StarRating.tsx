import { StarIcon } from "lucide-react";

interface StarRatingProps {
  rating?: number;
}

const StarRating = ({ rating = 4 }: StarRatingProps) => {
  return (
    <div className="flex items-center">
      <StarIcon
        size={14}
        className={rating > 0 ? "text-shop_light_green" : "text-lightText"}
        fill={rating > 0 ? "#93D991" : "#ababab"}
      />
      <StarIcon
        size={14}
        className={rating > 1 ? "text-shop_light_green" : "text-lightText"}
        fill={rating > 1 ? "#93D991" : "#ababab"}
      />
      <StarIcon
        size={14}
        className={rating > 2 ? "text-shop_light_green" : "text-lightText"}
        fill={rating > 2 ? "#93D991" : "#ababab"}
      />
      <StarIcon
        size={14}
        className={rating > 3 ? "text-shop_light_green" : "text-lightText"}
        fill={rating > 3 ? "#93D991" : "#ababab"}
      />
      <StarIcon
        size={14}
        className={rating > 4 ? "text-shop_light_green" : "text-lightText"}
        fill={rating > 4 ? "#93D991" : "#ababab"}
      />
    </div>
  );
};

export default StarRating;
