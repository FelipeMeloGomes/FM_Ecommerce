"use client";

import { Star } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { createReview } from "@/actions/reviewActions";
import {
  type ReviewImage,
  ReviewImageUploader,
} from "@/components/ReviewImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<ReviewImage[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSetRating = useCallback((star: number) => {
    setRating(star);
  }, []);

  const handleSetRatingWrapper = useCallback(
    (star: number) => () => handleSetRating(star),
    [handleSetRating],
  );

  const handleSetHoverRating = useCallback((star: number) => {
    setHoverRating(star);
  }, []);

  const handleSetHoverRatingWrapper = useCallback(
    (star: number) => () => handleSetHoverRating(star),
    [handleSetHoverRating],
  );

  const handleClearHoverRating = useCallback(() => {
    setHoverRating(0);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (rating === 0) {
        toast.error("Por favor, selecione uma avaliação");
        return;
      }

      if (!title.trim() || !comment.trim()) {
        toast.error("Preencha o título e o comentário");
        return;
      }

      setLoading(true);
      try {
        const files =
          images.length > 0
            ? images
                .map((img) => img.file)
                .filter((f): f is File => f !== undefined)
            : undefined;

        await createReview({
          productId,
          rating,
          title: title.trim(),
          comment: comment.trim(),
          images: files,
        });
        toast.success("Avaliação enviada!");
        setRating(0);
        setTitle("");
        setComment("");
        setImages([]);
        onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erro ao enviar avaliação";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [rating, title, comment, images, productId, onSuccess],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <span className="text-sm font-medium">Avaliação</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              aria-label={`Avaliar com ${star} estrelas`}
              onClick={handleSetRatingWrapper(star)}
              onMouseEnter={handleSetHoverRatingWrapper(star)}
              onMouseLeave={handleClearHoverRating}
              className="p-1 transition-colors"
            >
              <Star
                size={24}
                className={
                  star <= (hoverRating || rating)
                    ? "text-shop_orange fill-shop_orange"
                    : "text-muted"
                }
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-sm text-muted-foreground">
            {rating === 1 && "Ruim"}
            {rating === 2 && "Regular"}
            {rating === 3 && "Bom"}
            {rating === 4 && "Muito Bom"}
            {rating === 5 && "Excelente"}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="review-title" className="text-sm font-medium">
          Título
        </label>
        <Input
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da sua avaliação"
          maxLength={100}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="review-comment" className="text-sm font-medium">
          Comentário
        </label>
        <Textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Descreva sua experiência com o produto"
          className="min-h-[100px]"
          maxLength={1000}
        />
      </div>

      <ReviewImageUploader images={images} onChange={setImages} maxFiles={5} />

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-shop_dark_green hover:bg-shop_btn_dark_green"
      >
        {loading ? "Enviando..." : "Enviar Avaliação"}
      </Button>
    </form>
  );
}
