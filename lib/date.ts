export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeDate(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `${diffDays} dias atrás`;
  if (diffDays < 30)
    return `${Math.floor(diffDays / 7)} semana${diffDays >= 14 ? "s" : ""} atrás`;
  if (diffDays < 365)
    return `${Math.floor(diffDays / 30)} mês${diffDays >= 60 ? "es" : ""} atrás`;
  return `${Math.floor(diffDays / 365)} ano${diffDays >= 730 ? "s" : ""} atrás`;
}
