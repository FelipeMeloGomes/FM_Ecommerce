"use client";

import { HelpCircle, Share2, Split, Truck } from "lucide-react";
import { useState } from "react";
import { ProductQuestionDialog } from "@/components/ProductQuestionDialog";
import { ShareDialog } from "@/components/ShareDialog";
import type { Product } from "@/sanity.types";

interface ProductActionsProps {
  product: Product;
  userId?: string | null;
}

export function ProductActions({ product, userId }: ProductActionsProps) {
  const [questionOpen, setQuestionOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/60">
        <button
          type="button"
          className="flex items-center gap-2.5 p-3 rounded-lg text-sm text-foreground hover:bg-muted/50 hoverEffect group"
        >
          <Split className="text-lg text-shop_orange group-hover:scale-110 transition-transform" />
          <span className="font-medium">Comparar cores</span>
        </button>
        <button
          type="button"
          onClick={() => setQuestionOpen(true)}
          className="flex items-center gap-2.5 p-3 rounded-lg text-sm text-foreground hover:bg-muted/50 hoverEffect group"
        >
          <HelpCircle className="text-lg text-shop_orange group-hover:scale-110 transition-transform" />
          <span className="font-medium">Faça uma pergunta</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-2.5 p-3 rounded-lg text-sm text-foreground hover:bg-muted/50 hoverEffect group"
        >
          <Truck className="text-lg text-shop_orange group-hover:scale-110 transition-transform" />
          <span className="font-medium">Entrega e Devolução</span>
        </button>
        <button
          type="button"
          onClick={() => setShareOpen(true)}
          className="flex items-center gap-2.5 p-3 rounded-lg text-sm text-foreground hover:bg-muted/50 hoverEffect group"
        >
          <Share2 className="text-lg text-shop_orange group-hover:scale-110 transition-transform" />
          <span className="font-medium">Compartilhar</span>
        </button>
      </div>

      <ProductQuestionDialog
        product={{ _id: product._id, name: product.name }}
        open={questionOpen}
        onOpenChange={setQuestionOpen}
        userId={userId}
      />

      <ShareDialog
        product={{ name: product.name, slug: product.slug?.current || "" }}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
    </>
  );
}
