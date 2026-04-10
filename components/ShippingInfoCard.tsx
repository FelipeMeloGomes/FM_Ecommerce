"use client";

import { CornerDownLeft, Truck } from "lucide-react";
import { useCallback, useMemo, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const deliveryInfo = {
  title: "Prazo de Entrega",
  description:
    "O prazo de entrega varia de acordo com sua localização. Utilize o calculador de frete para estimar o prazo.",
};

const returnPolicy = {
  title: "Política de Devolução",
  description:
    "Você tem até 30 dias após o recebimento para solicitar a devolução. O produto deve estar em sua embalagem original e sem sinais de uso.",
};

const refundInfo = {
  title: "Reembolso",
  description:
    "O reembolso será processado em até 10 dias úteis após o recebimento do produto devolvido.",
};

const infoItems = [deliveryInfo, returnPolicy, refundInfo];

function InfoSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h4 className="font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

const DeliveryCard = () => (
  <div className="p-4 flex items-start gap-4 bg-shop_light_pink/30 border-b border-border/40 dark:bg-muted/20">
    <div className="p-2.5 rounded-full bg-shop_orange/10">
      <Truck size={24} className="text-shop_orange" />
    </div>
    <div className="space-y-1">
      <p className="text-base font-semibold text-foreground">Entrega Grátis</p>
      <p className="text-sm text-muted-foreground">
        Digite seu CEP para ver a disponibilidade de entrega.
      </p>
    </div>
  </div>
);

const ReturnCard = ({ onOpenDetails }: { onOpenDetails: () => void }) => (
  <div className="p-4 flex items-start gap-4">
    <div className="p-2.5 rounded-full bg-shop_orange/10">
      <CornerDownLeft size={24} className="text-shop_orange" />
    </div>
    <div className="space-y-1">
      <p className="text-base font-semibold text-foreground">
        Devolução do Pedido
      </p>
      <p className="text-sm text-muted-foreground">
        Devoluções grátis em até 30 dias.{" "}
        <button
          type="button"
          onClick={onOpenDetails}
          className="text-shop_orange hover:underline underline-offset-2 font-medium"
        >
          Detalhes
        </button>
      </p>
    </div>
  </div>
);

export function ShippingInfoCard() {
  const [isPending, startTransition] = useTransition();
  const [shippingOpen, setShippingOpen] = useState(false);

  const handleOpenDetails = useCallback(() => {
    startTransition(() => {
      setShippingOpen(true);
    });
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    setShippingOpen(open);
  }, []);

  const dialogContent = useMemo(
    () => (
      <div className="space-y-4 text-sm">
        {infoItems.map((item) => (
          <InfoSection
            key={item.title}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    ),
    [],
  );

  return (
    <>
      <div className="flex flex-col gap-0 rounded-xl overflow-hidden border border-border/60">
        <DeliveryCard />
        <ReturnCard onOpenDetails={handleOpenDetails} />
      </div>

      <Dialog open={shippingOpen} onOpenChange={handleOpenChange}>
        <DialogContent className={isPending ? "cursor-wait" : ""}>
          <DialogHeader>
            <DialogTitle>Entrega e Devolução</DialogTitle>
            <DialogDescription>
              Informações sobre envio e política de devolução
            </DialogDescription>
          </DialogHeader>
          {dialogContent}
        </DialogContent>
      </Dialog>
    </>
  );
}
