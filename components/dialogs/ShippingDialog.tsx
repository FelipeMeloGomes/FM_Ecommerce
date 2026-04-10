"use client";

import { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DeliveryInfoContent = () => (
  <div className="space-y-4 text-sm">
    <div>
      <h4 className="font-semibold text-foreground mb-1">Prazo de Entrega</h4>
      <p className="text-muted-foreground">
        O prazo de entrega varia de acordo com sua localização. Utilize o
        calculador de frete para estimar o prazo.
      </p>
    </div>
    <div>
      <h4 className="font-semibold text-foreground mb-1">
        Política de Devolução
      </h4>
      <p className="text-muted-foreground">
        Você tem até 30 dias após o recebimento para solicitar a devolução. O
        produto deve estar em sua embalagem original e sem sinais de uso.
      </p>
    </div>
    <div>
      <h4 className="font-semibold text-foreground mb-1">Reembolso</h4>
      <p className="text-muted-foreground">
        O reembolso será processado em até 10 dias úteis após o recebimento do
        produto devolvido.
      </p>
    </div>
  </div>
);

interface ShippingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShippingDialog({ open, onOpenChange }: ShippingDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleOpenChange = (newOpen: boolean) => {
    startTransition(() => {
      onOpenChange(newOpen);
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={isPending ? "cursor-wait" : ""}>
        <DialogHeader>
          <DialogTitle>Entrega e Devolução</DialogTitle>
          <DialogDescription>
            Informações sobre envio e política de devolução
          </DialogDescription>
        </DialogHeader>
        <DeliveryInfoContent />
      </DialogContent>
    </Dialog>
  );
}
