"use client";

import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { answerQuestion } from "@/actions/questionActions";
import { Avatar } from "@/components/Avatar";
import { AdminPagination } from "@/components/admin/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  product?: {
    _id: string;
    name: string;
    slug: string;
  };
}

interface AdminQuestionsListProps {
  initialQuestions: Question[];
}

const PAGE_SIZE = 10;

function normalize(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminQuestionsList({
  initialQuestions,
}: AdminQuestionsListProps) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [answerText, setAnswerText] = useState<Record<string, string>>({});
  const [loadingAnswer, setLoadingAnswer] = useState<string | null>(null);
  const [confirmOverwrite, setConfirmOverwrite] = useState<string | null>(null);
  const router = useRouter();

  const filteredQuestions = useMemo(() => {
    if (!query.trim()) return initialQuestions;
    const q = normalize(query);
    return initialQuestions.filter(
      (question) =>
        normalize(question.question).includes(q) ||
        normalize(question.customerName).includes(q) ||
        normalize(question.productName).includes(q),
    );
  }, [initialQuestions, query]);

  const totalPages = Math.ceil(filteredQuestions.length / PAGE_SIZE);

  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredQuestions.slice(start, start + PAGE_SIZE);
  }, [filteredQuestions, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    setCurrentPage(1);
  }, []);

  const toggleQuestion = (id: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
      // Initialize draft with existing answer when expanding
      const question = initialQuestions.find((q) => q._id === id);
      if (question?.answer && !Object.hasOwn(answerText, id)) {
        setAnswerText((prev) => ({ ...prev, [id]: question.answer ?? "" }));
      }
    }
    setExpandedQuestions(newExpanded);
  };

  const handleAnswer = async (questionId: string) => {
    const answer = answerText[questionId]?.trim();
    if (!answer || answer.length < 10) {
      toast.error("Resposta deve ter no mínimo 10 caracteres.");
      return;
    }

    const existingQuestion = initialQuestions.find((q) => q._id === questionId);

    if (existingQuestion?.answer && answer !== existingQuestion.answer) {
      setConfirmOverwrite(questionId);
      return;
    }

    await submitAnswer(questionId, answer);
  };

  const submitAnswer = async (questionId: string, answer: string) => {
    setLoadingAnswer(questionId);
    setConfirmOverwrite(null);

    try {
      await answerQuestion(questionId, answer);
      toast.success("Resposta enviada com sucesso!");
      // Clear draft for this question
      setAnswerText((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao enviar resposta.",
      );
    } finally {
      setLoadingAnswer(null);
    }
  };

  const unansweredCount = initialQuestions.filter((q) => !q.answered).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Perguntas dos Clientes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unansweredCount > 0
              ? `${unansweredCount} pergunta${unansweredCount > 1 ? "s" : ""} sem resposta`
              : "Todas as perguntas foram respondidas"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={unansweredCount > 0 ? "destructive" : "default"}
            className="text-sm"
          >
            {initialQuestions.length} pergunta
            {initialQuestions.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-4 h-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Buscar por pergunta, cliente ou produto..."
            className="h-11 pl-10 pr-10 bg-background border-input text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring hover:border-border"
          />
          {query && (
            <button
              type="button"
              onClick={() => handleQueryChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150 p-0.5 rounded-md hover:bg-muted"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">Nenhuma pergunta encontrada</p>
          <p className="text-sm mt-1">
            {query
              ? "Tente buscar com outros termos"
              : "As perguntas dos clientes aparecerão aqui"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedQuestions.map((question) => {
            const isExpanded = expandedQuestions.has(question._id);
            const currentAnswer = answerText[question._id] ?? "";
            return (
              <div
                key={question._id}
                className="border border-border/40 rounded-lg overflow-hidden transition-all duration-200 hover:border-border/60 bg-card"
              >
                <button
                  type="button"
                  onClick={() => toggleQuestion(question._id)}
                  className="w-full text-left p-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Avatar
                      name={question.customerName}
                      imageUrl={question.customerImage}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-foreground">
                          {question.customerName}
                        </span>
                        {question.answered ? (
                          <Badge
                            variant="default"
                            className="text-xs bg-emerald-600 hover:bg-emerald-700"
                          >
                            Respondida
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            Pendente
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-foreground mt-1">
                        {question.question}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{formatDate(question.createdAt)}</span>
                        {question.productName && (
                          <span>• Produto: {question.productName}</span>
                        )}
                      </div>
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

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border/40">
                    {question.answer && (
                      <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs font-semibold text-shop_dark_green mb-1">
                          Resposta atual
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                          {question.answer}
                        </p>
                      </div>
                    )}

                    <div className="mt-3 space-y-2">
                      <label
                        htmlFor={`answer-${question._id}`}
                        className="text-sm font-medium"
                      >
                        {question.answer ? "Editar resposta" : "Responder"}
                      </label>
                      <Textarea
                        id={`answer-${question._id}`}
                        value={currentAnswer}
                        onChange={(e) =>
                          setAnswerText((prev) => ({
                            ...prev,
                            [question._id]: e.target.value,
                          }))
                        }
                        placeholder="Digite sua resposta..."
                        rows={3}
                        className="resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        {confirmOverwrite === question._id && (
                          <div className="flex items-center gap-2 text-sm text-amber-600 mr-2">
                            <span>Substituir resposta existente?</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setConfirmOverwrite(null)}
                            >
                              Não
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                submitAnswer(
                                  question._id,
                                  answerText[question._id] || "",
                                )
                              }
                              disabled={loadingAnswer === question._id}
                            >
                              Sim
                            </Button>
                          </div>
                        )}
                        {!confirmOverwrite && (
                          <Button
                            onClick={() => handleAnswer(question._id)}
                            disabled={
                              loadingAnswer === question._id ||
                              !currentAnswer.trim() ||
                              currentAnswer.trim().length < 10
                            }
                            size="sm"
                            className="bg-shop_dark_green hover:bg-shop_btn_dark_green"
                          >
                            {loadingAnswer === question._id
                              ? "Enviando..."
                              : question.answer
                                ? "Atualizar resposta"
                                : "Enviar resposta"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
