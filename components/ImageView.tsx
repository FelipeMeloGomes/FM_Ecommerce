"use client";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { urlFor } from "@/sanity/lib/image";
import {
  internalGroqTypeReferenceTo,
  type SanityImageCrop,
  type SanityImageHotspot,
} from "@/sanity.types";

interface Props {
  images?: Array<{
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
  }>;
  isStock?: number | undefined;
}

const ImageView = ({ images = [], isStock }: Props) => {
  const [active, setActive] = useState(images[0]);

  const handleSetActive = useCallback(
    (image: (typeof images)[0]) => () => {
      setActive(image);
    },
    [],
  );

  return (
    <div className="w-full lg:w-1/2 space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={active?._key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`relative aspect-square bg-muted/30 rounded-xl border border-border/60 overflow-hidden ${isStock === 0 ? "opacity-60" : ""}`}
        >
          <Image
            src={urlFor(active).url()}
            alt="productImage"
            fill
            priority
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
      </AnimatePresence>
      <div className="grid grid-cols-4 lg:grid-cols-6 gap-2">
        {images?.map((image) => (
          <button
            type="button"
            key={image?._key}
            onClick={handleSetActive(image)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              active?._key === image?._key
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
        ))}
      </div>
    </div>
  );
};

export default ImageView;
