"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function AdminBackButton() {
  const router = useRouter();

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <button
      type="button"
      onClick={handleGoBack}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
    >
      <ArrowLeft className="w-4 h-4" />
      Voltar
    </button>
  );
}
