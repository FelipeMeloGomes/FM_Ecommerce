"use client";

import { HelpCircle, Share2, Split, Truck } from "lucide-react";
import { useCallback, useState } from "react";
import { ProductQuestionDialog } from "@/components/ProductQuestionDialog";
import { ShareDialog } from "@/components/ShareDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product } from "@/sanity.types";

interface ProductActionsProps {
  product: Product;
  userId?: string | null;
}

export function ProductActions({ product, userId }: ProductActionsProps) {
  const [questionOpen, setQuestionOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  const handleOpenCompare = useCallback(() => {
    setCompareOpen(true);
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
          onClick={handleOpenCompare}
          className="flex items-center gap-2.5 p-3 rounded-lg text-sm text-foreground hover:bg-muted/50 hoverEffect group"
        >
          <Split className="text-lg text-shop_orange group-hover:scale-110 transition-transform" />
          <span className="font-medium">Comparar cores</span>
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

      <Dialog open={shippingOpen} onOpenChange={setShippingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Entrega e Devolução</DialogTitle>
            <DialogDescription>
              Informações sobre envio e política de devolução
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold text-foreground mb-1">
                Prazo de Entrega
              </h4>
              <p className="text-muted-foreground">
                O prazo de entrega varia de acordo com sua localização. Utilize
                o calculador de frete para estimar o prazo.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">
                Política de Devolução
              </h4>
              <p className="text-muted-foreground">
                Você tem até 7 dias após o recebimento para solicitar a
                devolução. O produto deve estar em sua embalagem original e sem
                sinais de uso.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Reembolso</h4>
              <p className="text-muted-foreground">
                O reembolso será processado em até 10 dias úteis após o
                recebimento do produto devolvido.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comparar Cores</DialogTitle>
            <DialogDescription>
              Veja as variações de cores disponíveis para este produto
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              Este produto está disponível nas seguintes cores:
            </p>
            <div className="flex gap-3">
              {product.variant ? (
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-10 h-10 rounded-full border-2 border-border"
                    style={{ backgroundColor: product.variant }}
                  />
                  <span className="text-xs text-muted-foreground capitalize">
                    {product.variant}
                  </span>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Nenhuma variação de cor disponível.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
