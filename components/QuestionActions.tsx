"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteQuestion, updateQuestion } from "@/actions/questionActions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface QuestionActionsProps {
  question: {
    _id: string;
    question: string;
    _createdAt: string;
  };
  onSuccess?: () => void;
}

const MAX_DAYS_TO_EDIT = 7;

export function QuestionActions({ question, onSuccess }: QuestionActionsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editQuestion, setEditQuestion] = useState(question.question);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const canEdit = (() => {
    const createdAt = new Date(question._createdAt);
    const daysSinceCreation = Math.floor(
      (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysSinceCreation < MAX_DAYS_TO_EDIT;
  })();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateQuestion(question._id, editQuestion);
      toast.success("Pergunta atualizada!");
      setIsEditing(false);
      onSuccess?.();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteQuestion(question._id);
      toast.success("Pergunta removida!");
      onSuccess?.();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao remover");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleUpdate}
        className="space-y-3 mt-3 p-3 bg-muted/30 rounded-lg"
      >
        <div className="space-y-2">
          <label htmlFor="edit-question" className="text-sm font-medium">
            Editar pergunta
          </label>
          <Textarea
            id="edit-question"
            value={editQuestion}
            onChange={(e) => setEditQuestion(e.target.value)}
            className="min-h-[60px] text-sm"
            maxLength={500}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading} size="sm">
            Salvar
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(false)}
          >
            Cancelar
          </Button>
        </div>
      </form>
    );
  }

  if (showDeleteConfirm) {
    return (
      <div className="mt-3 p-3 bg-destructive/10 rounded-lg space-y-2">
        <p className="text-sm font-medium">Confirmar exclusão?</p>
        <p className="text-xs text-muted-foreground">
          Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
          >
            Excluir
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 mt-2">
      {canEdit && (
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
          Editar
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDeleteConfirm(true)}
        className="text-destructive"
      >
        Excluir
      </Button>
    </div>
  );
}
