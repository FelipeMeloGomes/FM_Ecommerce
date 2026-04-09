"use client";

import { useCallback, useState } from "react";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewList } from "@/components/ReviewList";
import StarRating from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Review {
  _id: string;
  clerkUserId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  _createdAt: string;
}

interface ReviewSectionProps {
  productId: string;
  userId: string | null;
  hasPurchased: boolean;
  reviews: Review[];
  ratingData: {
    average: number;
    count: number;
  };
}

export default function ReviewSection({
  productId,
  userId,
  hasPurchased,
  reviews,
  ratingData,
}: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false);

  const handleShowForm = useCallback(() => {
    setShowForm(true);
  }, []);

  const handleHideForm = useCallback(() => {
    setShowForm(false);
  }, []);

  const handleReviewSubmitted = useCallback(() => {
    setShowForm(false);
  }, []);

  return (
    <>
      <Separator className="my-8" />
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Avaliações de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-shop_orange">
                {ratingData.average.toFixed(1)}
              </div>
              <StarRating rating={Math.round(ratingData.average)} />
              <p className="text-sm text-muted-foreground mt-1">
                {ratingData.count}{" "}
                {ratingData.count === 1 ? "avaliação" : "avaliações"}
              </p>
            </div>
            {userId && !showForm && hasPurchased && (
              <Button
                onClick={handleShowForm}
                className="ml-auto bg-shop_dark_green hover:bg-shop_btn_dark_green"
              >
                Avaliar Produto
              </Button>
            )}
            {userId && !showForm && !hasPurchased && (
              <span className="ml-auto text-sm text-muted-foreground">
                Compre para avaliar
              </span>
            )}
            {userId && showForm && (
              <Button
                onClick={handleHideForm}
                variant="ghost"
                className="ml-auto"
              >
                Cancelar
              </Button>
            )}
          </div>

          {showForm && (
            <div className="border border-border rounded-lg p-4">
              <ReviewForm
                productId={productId}
                onSuccess={handleReviewSubmitted}
              />
            </div>
          )}

          <ReviewList reviews={reviews} currentUserId={userId} />
        </CardContent>
      </Card>
    </>
  );
}
