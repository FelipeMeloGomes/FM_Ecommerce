"use client";

import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const NoProductAvailable = ({
  selectedTab,
  className,
}: {
  selectedTab?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 min-h-[400px] space-y-4 text-center bg-muted/30 rounded-xl w-full",
        className,
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-foreground">
          Nenhum produto disponível
        </h2>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-muted-foreground max-w-md"
      >
        Desculpe, não há produtos correspondentes a{" "}
        <span className="font-semibold text-shop_dark_green">
          {selectedTab}
        </span>{" "}
        no momento.
      </motion.p>

      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="flex items-center gap-2 text-shop_orange"
      >
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Em breve teremos estoque novamente</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-sm text-muted-foreground"
      >
        Volte mais tarde ou explore nossas outras categorias.
      </motion.p>
    </div>
  );
};

export default NoProductAvailable;
