"use client";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { deleteReview, updateReview } from "@/actions/reviewActions";
import {
  type ReviewImage,
  ReviewImagesGallery,
} from "@/components/ReviewImagesGallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { urlFor } from "@/sanity/lib/image";

interface ReviewActionsProps {
  review: {
    _id: string;
    rating: number;
    title: string;
    comment: string;
    images?: Array<{
      asset?: { _ref: string };
      _type: "image";
    }>;
    _createdAt: string;
  };
  onSuccess?: () => void;
}

const MAX_DAYS_TO_EDIT = 7;

function initializeImages(
  existingImages?: Array<{ asset?: { _ref: string }; _type: "image" }>,
): ReviewImage[] {
  if (!existingImages || existingImages.length === 0) return [];

  return existingImages.map((img) => ({
    id: img.asset?._ref || crypto.randomUUID(),
    preview: urlFor(img).url(),
    isExisting: true,
  }));
}

export function ReviewActions({ review, onSuccess }: ReviewActionsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [title, setTitle] = useState(review.title);
  const [comment, setComment] = useState(review.comment);
  const [images, setImages] = useState<ReviewImage[]>(() =>
    initializeImages(review.images),
  );
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const canEdit = useMemo(() => {
    const createdAt = new Date(review._createdAt);
    const daysSinceCreation = Math.floor(
      (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysSinceCreation < MAX_DAYS_TO_EDIT;
  }, [review._createdAt]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  const handleOpenEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleOpenDelete = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const handleSetRating = useCallback((star: number) => {
    setRating(star);
  }, []);

  const handleUpdate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const newImages = images.filter((img) => !img.isExisting && img.file);
        const keepImageIds = images
          .filter((img) => img.isExisting)
          .map((img) => img.id);

        const imageFiles: File[] | undefined =
          newImages.length > 0
            ? newImages
                .map((img) => img.file as File)
                .filter((f): f is File => f !== undefined)
            : undefined;

        await updateReview(review._id, {
          rating,
          title,
          comment,
          images: imageFiles,
          keepImageIds,
        });
        toast.success("Avaliação atualizada!");
        setIsEditing(false);
        setImages([]);
        onSuccess?.();
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erro ao atualizar",
        );
      } finally {
        setLoading(false);
      }
    },
    [images, rating, title, comment, review._id, onSuccess, router],
  );

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      await deleteReview(review._id);
      toast.success("Avaliação removida!");
      onSuccess?.();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao remover");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  }, [review._id, onSuccess, router]);

  if (isEditing) {
    return (
      <form
        onSubmit={handleUpdate}
        className="space-y-4 mt-4 p-4 bg-muted/30 rounded-lg"
      >
        <div className="space-y-2">
          <span className="text-sm font-medium">Avaliação</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`Avaliar com ${star} estrelas`}
                onClick={() => handleSetRating(star)}
                className="p-1 transition-colors"
              >
                <Star
                  size={20}
                  className={
                    star <= rating
                      ? "text-shop_orange fill-shop_orange"
                      : "text-muted"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-title" className="text-sm font-medium">
            Título
          </label>
          <Input
            id="edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-comment" className="text-sm font-medium">
            Comentário
          </label>
          <Textarea
            id="edit-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[80px]"
            maxLength={1000}
          />
        </div>

        <ReviewImagesGallery
          images={images}
          onChange={setImages}
          editable={true}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={loading} size="sm">
            Salvar
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancelEdit}
          >
            Cancelar
          </Button>
        </div>
      </form>
    );
  }

  if (showDeleteConfirm) {
    return (
      <div className="mt-4 p-4 bg-destructive/10 rounded-lg space-y-3">
        <p className="text-sm font-medium">Confirmar exclusão?</p>
        <p className="text-xs text-muted-foreground">
          Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
          >
            Excluir
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCancelDelete}>
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 mt-2">
      {canEdit && (
        <Button variant="ghost" size="sm" onClick={handleOpenEdit}>
          Editar
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpenDelete}
        className="text-destructive"
      >
        Excluir
      </Button>
    </div>
  );
}
