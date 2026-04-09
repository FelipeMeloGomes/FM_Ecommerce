"use client";

import { Send } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { sendProductQuestion } from "@/actions/questionActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProductQuestionDialogProps {
  product: {
    _id: string;
    name: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string | null;
}

export function ProductQuestionDialog({
  product,
  open,
  onOpenChange,
  userId,
}: ProductQuestionDialogProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!question.trim() || question.trim().length < 10) {
        toast.error("Pergunta muito curta. Mínimo de 10 caracteres.");
        return;
      }

      if (!userId) {
        toast.error("Você precisa estar logado para fazer uma pergunta.");
        return;
      }

      setLoading(true);

      try {
        await sendProductQuestion(product._id, product.name, question.trim());
        toast.success("Pergunta enviada com sucesso!");
        setQuestion("");
        handleClose();
      } catch (error) {
        console.error("Error sending question:", error);
        toast.error("Erro ao enviar pergunta. Tente novamente.");
      } finally {
        setLoading(false);
      }
    },
    [question, userId, product, handleClose],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Fazer uma pergunta</DialogTitle>
          <DialogDescription>
            Tire suas dúvidas sobre "{product.name}"
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Sua pergunta</Label>
            <Textarea
              id="question"
              placeholder="Digite sua pergunta sobre o produto..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              required
              minLength={10}
            />
            <p className="text-xs text-muted-foreground">
              Mínimo 10 caracteres
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !question.trim()}
              className="bg-shop_dark_green hover:bg-shop_btn_dark_green"
            >
              {loading ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar pergunta
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
