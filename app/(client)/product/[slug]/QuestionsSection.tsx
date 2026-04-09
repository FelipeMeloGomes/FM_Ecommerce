"use client";

import {
  ChevronDown,
  ChevronUp,
  MessageCircleQuestion,
  Send,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { sendProductQuestion } from "@/actions/questionActions";
import { Avatar } from "@/components/Avatar";
import { QuestionActions } from "@/components/QuestionActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface Question {
  _id: string;
  question: string;
  answer?: string;
  answered: boolean;
  createdAt: string;
  userId: string;
  customerName: string;
  customerImage?: string | null;
  productName: string;
}

interface QuestionsSectionProps {
  productId: string;
  productName: string;
  userId: string | null;
  questions: Question[];
}

export default function QuestionsSection({
  productId,
  productName,
  userId,
  questions,
}: QuestionsSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set(),
  );

  const handleShowForm = useCallback(() => {
    setShowForm(true);
  }, []);

  const handleHideForm = useCallback(() => {
    setShowForm(false);
    setNewQuestion("");
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!newQuestion.trim() || newQuestion.trim().length < 10) {
        toast.error("Pergunta muito curta. Mínimo de 10 caracteres.");
        return;
      }

      setLoading(true);

      try {
        await sendProductQuestion(productId, productName, newQuestion.trim());
        toast.success("Pergunta enviada com sucesso!");
        setNewQuestion("");
        setShowForm(false);
      } catch (_error) {
        toast.error("Erro ao enviar pergunta. Tente novamente.");
      } finally {
        setLoading(false);
      }
    },
    [productId, productName, newQuestion],
  );

  const toggleQuestion = useCallback((id: string) => {
    setExpandedQuestions((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return newExpanded;
    });
  }, []);

  const handleToggleQuestion = useCallback(
    (id: string) => () => {
      toggleQuestion(id);
    },
    [toggleQuestion],
  );

  const formatDate = useCallback((dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);

  const handleQuestionUpdated = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <>
      <Separator className="my-8" />
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-shop_orange/10">
                <MessageCircleQuestion className="h-5 w-5 text-shop_orange" />
              </div>
              <CardTitle className="text-xl font-semibold">
                Perguntas e Respostas
              </CardTitle>
            </div>
            <Badge
              variant="secondary"
              className="bg-muted text-muted-foreground"
            >
              {questions.length}{" "}
              {questions.length === 1 ? "pergunta" : "perguntas"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {userId && !showForm && (
            <Button
              onClick={handleShowForm}
              className="w-full bg-shop_dark_green hover:bg-shop_btn_dark_green transition-all duration-200"
            >
              <MessageCircleQuestion className="h-4 w-4 mr-2" />
              Fazer uma pergunta
            </Button>
          )}

          {!userId && (
            <p className="text-sm text-muted-foreground text-center py-2">
              Faça login para fazer uma pergunta
            </p>
          )}

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 border border-border rounded-lg p-4 bg-muted/20"
            >
              <div className="space-y-2">
                <Label htmlFor="question">Sua pergunta</Label>
                <Textarea
                  id="question"
                  placeholder="Digite sua pergunta sobre o produto..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  rows={3}
                  required
                  minLength={10}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Mínimo 10 caracteres
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleHideForm}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={loading || !newQuestion.trim()}
                  className="bg-shop_dark_green hover:bg-shop_btn_dark_green"
                >
                  {loading ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send className="h-3 w-3 mr-1" />
                      Enviar
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {questions.length === 0 && !showForm && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircleQuestion className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhuma pergunta ainda</p>
              <p className="text-xs mt-1">Seja o primeiro a perguntar!</p>
            </div>
          )}

          <div className="space-y-3">
            {questions.map((q) => {
              const isExpanded = expandedQuestions.has(q._id);
              const isOwnQuestion = userId && userId === q.userId;
              return (
                <div
                  key={q._id}
                  className="border border-border/40 rounded-lg overflow-hidden transition-all duration-200 hover:border-border/60"
                >
                  <button
                    type="button"
                    onClick={handleToggleQuestion(q._id)}
                    className="w-full text-left p-4 bg-card hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar
                        name={q.customerName}
                        imageUrl={q.customerImage}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {q.customerName}
                          </span>
                          {q.answered && (
                            <Badge
                              variant="default"
                              className="text-xs bg-emerald-600 hover:bg-emerald-700"
                            >
                              Respondida
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-foreground mt-1">
                          {q.question}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(q.createdAt)}
                        </p>
                      </div>
                      <div className="shrink-0 p-1 hover:bg-muted rounded transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>

                  {isExpanded && q.answer && (
                    <div className="px-4 pb-4 pt-2 bg-muted/30 border-t border-border/40">
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded-full bg-shop_dark_green/10 shrink-0 mt-0.5">
                          <MessageCircleQuestion className="h-3.5 w-3.5 text-shop_dark_green" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-shop_dark_green mb-1">
                            Resposta da loja
                          </p>
                          <p className="text-sm text-foreground leading-relaxed">
                            {q.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {isOwnQuestion && (
                    <div className="px-4 pb-3">
                      <QuestionActions
                        question={{
                          _id: q._id,
                          question: q.question,
                          _createdAt: q.createdAt,
                        }}
                        onSuccess={handleQuestionUpdated}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
