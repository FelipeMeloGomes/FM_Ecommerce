export function toHttpStatus(error: unknown): number {
  if (!(error instanceof Error)) return 500;
  if (error.message === "Unauthorized" || error.message === "Forbidden")
    return 403;
  if (error.message === "Slug já existe") return 400;
  if (error.message === "Categoria não encontrada") return 404;
  if (error.message === "Produto não encontrado") return 404;
  return 500;
}
