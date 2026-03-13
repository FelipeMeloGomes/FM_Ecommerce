"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
    >
      <ArrowLeft className="w-4 h-4" />
      Voltar
    </button>
  );
}
