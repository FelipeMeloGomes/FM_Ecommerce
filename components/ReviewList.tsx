import { CheckCircle2 } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { ReviewActions } from "./ReviewActions";
import { ReviewImagesList } from "./ReviewImagesGallery";
import StarRating from "./StarRating";

interface Review {
  _id: string;
  clerkUserId: string;
  customerName: string;
  customerImage?: string | null;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  images?: Array<{
    asset?: { _ref: string };
    _type: "image";
  }>;
  _createdAt: string;
}

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string | null;
}

export function ReviewList({ reviews, currentUserId }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => {
        const isOwnReview =
          currentUserId && currentUserId === review.clerkUserId;

        return (
          <div
            key={review._id}
            className="border-b border-border/40 pb-6 last:border-0"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Avatar
                  name={review.customerName}
                  imageUrl={review.customerImage}
                  size="md"
                />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.customerName}</span>
                    {review.verifiedPurchase && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Compra verificada
                      </span>
                    )}
                  </div>
                  <StarRating rating={review.rating} />
                  <h4 className="font-medium">{review.title}</h4>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(review._createdAt).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <p className="mt-2 text-muted-foreground">{review.comment}</p>

            {review.images && review.images.length > 0 && (
              <ReviewImagesList images={review.images} />
            )}

            {isOwnReview && <ReviewActions review={review} />}
          </div>
        );
      })}
    </div>
  );
}
