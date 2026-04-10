"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import React, { useCallback, useMemo, useState, useTransition } from "react";
import { urlFor } from "@/sanity/lib/image";
import {
  internalGroqTypeReferenceTo,
  type SanityImageCrop,
  type SanityImageHotspot,
} from "@/sanity.types";

type ImageAsset = {
  asset?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
  };
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
  _type: "image";
  _key: string;
};

interface Props {
  images?: ImageAsset[];
  isStock?: number;
}

const MotionDiv = motion.div;

const ImageView = React.memo(({ images = [], isStock }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPending, startTransition] = useTransition();

  const hasMultiple = images.length > 1;
  const active = images[activeIndex];

  const handleSelect = useCallback(
    (index: number) => {
      setDirection(index > activeIndex ? 1 : -1);
      startTransition(() => {
        setActiveIndex(index);
      });
    },
    [activeIndex],
  );

  const handlePrev = useCallback(() => {
    if (!hasMultiple) return;
    const newIndex = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    setDirection(-1);
    startTransition(() => {
      setActiveIndex(newIndex);
    });
  }, [activeIndex, images.length, hasMultiple]);

  const handleNext = useCallback(() => {
    if (!hasMultiple) return;
    const newIndex = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
    setDirection(1);
    startTransition(() => {
      setActiveIndex(newIndex);
    });
  }, [activeIndex, images.length, hasMultiple]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!hasMultiple) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    },
    [hasMultiple, handlePrev, handleNext],
  );

  const thumbnailButtons = useMemo(
    () =>
      images.map((image, index) => (
        <button
          key={image?._key}
          type="button"
          onClick={() => handleSelect(index)}
          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
            index === activeIndex
              ? "border-shop_orange ring-2 ring-shop_orange/20"
              : "border-border/40 hover:border-shop_orange/50"
          }`}
        >
          <Image
            src={urlFor(image).url()}
            alt={`Thumbnail ${image._key}`}
            fill
            sizes="80px"
            loading="lazy"
            className="object-cover"
          />
        </button>
      )),
    [images, activeIndex, handleSelect],
  );

  const dots = useMemo(
    () =>
      images.map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => handleSelect(index)}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === activeIndex
              ? "w-6 bg-shop_orange"
              : "w-2 bg-white/40 hover:bg-white/60"
          }`}
          aria-label={`Ir para imagem ${index + 1}`}
        />
      )),
    [images, activeIndex, handleSelect],
  );

  return (
    <div className="w-full lg:w-1/2 space-y-4">
      <div className="relative">
        <MotionDiv
          key={activeIndex}
          custom={direction}
          initial={{ opacity: 0, x: direction * 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -100 }}
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className={`relative aspect-square bg-muted/30 rounded-xl border border-border/60 overflow-hidden ${
            isStock === 0 ? "opacity-60" : ""
          } ${isPending ? "cursor-wait" : ""}`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          role="region"
          aria-label="Galeria de imagens do produto"
        >
          <Image
            src={urlFor(active).url()}
            alt="productImage"
            fill
            priority={activeIndex === 0}
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </MotionDiv>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              disabled={isPending}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 disabled:opacity-50 text-white transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isPending}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 disabled:opacity-50 text-white transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {dots}
            </div>
          </>
        )}
      </div>

      <div
        className="grid grid-cols-4 lg:grid-cols-6 gap-2"
        role="tablist"
        aria-label="Miniaturas das imagens"
      >
        {thumbnailButtons}
      </div>
    </div>
  );
});

ImageView.displayName = "ImageView";

export default ImageView;
