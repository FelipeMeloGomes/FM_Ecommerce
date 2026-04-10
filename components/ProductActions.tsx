"use client";

import { HelpCircle, Share2, Split, Truck } from "lucide-react";
import { useCallback, useState } from "react";
import { ShippingDialog, SimilarProductsDialog } from "@/components/dialogs";
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
  const [shippingOpen, setShippingOpen] = useState(false);
  const [similarOpen, setSimilarOpen] = useState(false);

  const handleOpenSimilar = useCallback(() => {
    setSimilarOpen(true);
  }, []);

  const handleOpenQuestion = useCallback(() => {
    setQuestionOpen(true);
  }, []);

  const handleOpenShipping = useCallback(() => {
    setShippingOpen(true);
  }, []);

  const handleOpenShare = useCallback(() => {
    setShareOpen(true);
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/60">
        <button
          type="button"
          onClick={handleOpenSimilar}
          className="flex items-center gap-2.5 p-3 rounded-lg text-sm text-foreground hover:bg-muted/50 hoverEffect group"
        >
          <Split className="text-lg text-shop_orange group-hover:scale-110 transition-transform" />
          <span className="font-medium">Produtos similares</span>
        </button>
        <button
          type="button"
          onClick={handleOpenQuestion}
          className="flex items-center gap-2.5 p-3 rounded-lg text-sm text-foreground hover:bg-muted/50 hoverEffect group"
        >
          <HelpCircle className="text-lg text-shop_orange group-hover:scale-110 transition-transform" />
          <span className="font-medium">Faça uma pergunta</span>
        </button>
        <button
          type="button"
          onClick={handleOpenShipping}
          className="flex items-center gap-2.5 p-3 rounded-lg text-sm text-foreground hover:bg-muted/50 hoverEffect group"
        >
          <Truck className="text-lg text-shop_orange group-hover:scale-110 transition-transform" />
          <span className="font-medium">Entrega e Devolução</span>
        </button>
        <button
          type="button"
          onClick={handleOpenShare}
          className="flex items-center gap-2.5 p-3 rounded-lg text-sm text-foreground hover:bg-muted/50 hoverEffect group"
        >
          <Share2 className="text-lg text-shop_orange group-hover:scale-110 transition-transform" />
          <span className="font-medium">Compartilhar</span>
        </button>
      </div>

      <ShippingDialog open={shippingOpen} onOpenChange={setShippingOpen} />

      <SimilarProductsDialog
        open={similarOpen}
        onOpenChange={setSimilarOpen}
        product={product}
      />

      <ProductQuestionDialog
        product={{ _id: product._id, name: product.name || "" }}
        open={questionOpen}
        onOpenChange={setQuestionOpen}
        userId={userId}
      />

      <ShareDialog
        product={{
          name: product.name || "",
          slug: product.slug?.current || "",
        }}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
    </>
  );
}
