"use client";

import { Copy, Facebook, Mail, Twitter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShareDialogProps {
  product: {
    name: string;
    slug: string | undefined;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDialog({ product, open, onOpenChange }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/product/${product.slug || ""}`
      : `/product/${product.slug || ""}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Erro ao copiar link");
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(product.name)}`,
    email: `mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(shareUrl)}`,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar produto</DialogTitle>
          <DialogDescription>
            Compartilhe "{product.name}" com seus amigos
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background"
            />
            <Button variant="outline" size="icon" onClick={handleCopy}>
              {copied ? (
                <span className="text-green-500 text-xs">✓</span>
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex justify-center gap-4">
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
              aria-label="Compartilhar no Facebook"
            >
              <Facebook className="h-5 w-5 text-white" />
            </a>
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-black hover:bg-gray-800 transition-colors"
              aria-label="Compartilhar no Twitter"
            >
              <Twitter className="h-5 w-5 text-white" />
            </a>
            <a
              href={shareLinks.email}
              className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors"
              aria-label="Enviar por email"
            >
              <Mail className="h-5 w-5 text-white" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
