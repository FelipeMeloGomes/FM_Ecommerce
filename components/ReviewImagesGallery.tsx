"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";

export interface ReviewImage {
  id: string;
  file?: File;
  preview: string;
  isExisting?: boolean;
}

interface ReviewImagesGalleryProps {
  images: ReviewImage[];
  onChange?: (images: ReviewImage[]) => void;
  editable?: boolean;
}

export function ReviewImagesGallery({
  images,
  onChange,
  editable = false,
}: ReviewImagesGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null
        ? images.length - 1
        : prev === 0
          ? images.length - 1
          : prev - 1,
    );
  }, [images.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? 0 : prev === images.length - 1 ? 0 : prev + 1,
    );
  }, [images.length]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handleSelectIndex = useCallback((idx: number) => {
    setSelectedIndex(idx);
  }, []);

  const handleSelectIndexWrapper = useCallback(
    (idx: number) => () => handleSelectIndex(idx),
    [handleSelectIndex],
  );

  const handleRemoveImage = useCallback(
    (e: React.MouseEvent, idx: number) => {
      e.stopPropagation();
      onChange?.(images.filter((_, i) => i !== idx));
    },
    [images, onChange],
  );

  const handleRemoveImageWrapper = useCallback(
    (idx: number) => (e: React.MouseEvent) => handleRemoveImage(e, idx),
    [handleRemoveImage],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.stopPropagation();
        onChange?.(images.filter((_, i) => i !== idx));
      }
    },
    [images, onChange],
  );

  const handleKeyDownWrapper = useCallback(
    (idx: number) => (e: React.KeyboardEvent) => handleKeyDown(e, idx),
    [handleKeyDown],
  );

  const handleKeyDownForSelect = useCallback(
    (idx: number) => (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.stopPropagation();
        handleSelectIndexWrapper(idx)();
      }
    },
    [handleSelectIndexWrapper],
  );

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {images.map((image, idx) => (
          <div
            role="button"
            tabIndex={0}
            key={image.id}
            onClick={handleSelectIndexWrapper(idx)}
            onKeyDown={handleKeyDownForSelect(idx)}
            className={cn(
              "relative rounded-xl overflow-hidden border-2 border-border/50",
              "transition-all duration-300 ease-out",
              "hover:border-shop_orange hover:shadow-lg hover:shadow-shop_orange/20",
              "hover:scale-105",
              "group cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-shop_orange focus:ring-offset-2",
            )}
            style={{ width: 140, height: 140 }}
          >
            <Image
              src={image.preview}
              alt={`Foto ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {editable && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleRemoveImageWrapper(idx)}
                onKeyDown={handleKeyDownWrapper(idx)}
                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/80 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </span>
            )}
          </div>
        ))}
      </div>

      <Dialog open={selectedIndex !== null} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl w-full bg-black/95 border-none p-0">
          <DialogTitle className="sr-only">
            Galeria de imagens -{" "}
            {selectedIndex !== null ? selectedIndex + 1 : ""} de {images.length}
          </DialogTitle>
          <div className="relative h-[80vh] flex items-center justify-center">
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {selectedIndex !== null && (
              <div className="relative w-full h-full max-w-3xl">
                <Image
                  src={images[selectedIndex].preview}
                  alt={`Foto ${selectedIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={handleSelectIndexWrapper(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    idx === selectedIndex
                      ? "w-8 bg-shop_orange"
                      : "w-2 bg-white/40 hover:bg-white/60",
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="absolute top-4 left-4 text-white/80 text-sm font-medium">
              {(selectedIndex ?? 0) + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface ReviewImagesListProps {
  images: Array<{
    asset?: { _ref: string };
    _type: "image";
  }>;
}

export function ReviewImagesList({ images }: ReviewImagesListProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null
        ? images.length - 1
        : prev === 0
          ? images.length - 1
          : prev - 1,
    );
  }, [images.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? 0 : prev === images.length - 1 ? 0 : prev + 1,
    );
  }, [images.length]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handleSelectIndex = useCallback((idx: number) => {
    setSelectedIndex(idx);
  }, []);

  const handleSelectIndexWrapper = useCallback(
    (idx: number) => () => handleSelectIndex(idx),
    [handleSelectIndex],
  );

  const imageUrls = useMemo(
    () => images.map((img) => urlFor(img).url()),
    [images],
  );

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap gap-3 mt-4">
        {images.map((_img, idx) => {
          const src = imageUrls[idx];
          return (
            <button
              key={idx}
              type="button"
              onClick={handleSelectIndexWrapper(idx)}
              className="relative rounded-xl overflow-hidden border-2 border-border/50 transition-all duration-300 ease-out hover:border-shop_orange hover:shadow-lg hover:shadow-shop_orange/20 hover:scale-105 group cursor-pointer"
              style={{ width: 140, height: 140 }}
            >
              <Image
                src={src}
                alt={`Foto ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="font-medium">{idx + 1}</span>/{images.length}
              </div>
            </button>
          );
        })}
      </div>

      <Dialog open={selectedIndex !== null} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl w-full bg-black/95 border-none p-0">
          <DialogTitle className="sr-only">
            Galeria de imagens -{" "}
            {selectedIndex !== null ? selectedIndex + 1 : ""} de {images.length}
          </DialogTitle>
          <div className="relative h-[80vh] flex items-center justify-center">
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {selectedIndex !== null && (
              <div className="relative w-full h-full max-w-3xl">
                <Image
                  src={imageUrls[selectedIndex]}
                  alt={`Foto ${selectedIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={handleSelectIndexWrapper(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    idx === selectedIndex
                      ? "w-8 bg-shop_orange"
                      : "w-2 bg-white/40 hover:bg-white/60",
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="absolute top-4 left-4 text-white/80 text-sm font-medium">
              {(selectedIndex ?? 0) + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
