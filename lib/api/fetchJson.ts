/**
 * 🔹 Resposta de sucesso padrão da API.
 *
 * T representa o tipo do payload retornado.
 * O campo `success` é opcional para manter flexibilidade.
 *
 * Exemplo:
 * {
 *   success: true,
 *   data: {...}
 * }
 *
 * -----------------------------------------
 *
 * 🔹 Standard API success response.
 *
 * T represents the returned payload type.
 * The `success` field is optional to keep flexibility.
 *
 * Example:
 * {
 *   success: true,
 *   data: {...}
 * }
 */
export type ApiSuccessResponse<T = unknown> = T & {
  success?: true;
};

/**
 * 🔹 Resposta padrão de erro da API.
 *
 * Todas as rotas devem retornar esse formato em caso de erro,
 * para garantir consistência no frontend.
 *
 * Exemplo:
 * {
 *   message: "Erro interno do servidor"
 * }
 *
 * -----------------------------------------
 *
 * 🔹 Standard API error response.
 *
 * All routes should return this format on errors
 * to ensure frontend consistency.
 *
 * Example:
 * {
 *   message: "Internal server error"
 * }
 */
export type ApiErrorResponse = {
  message: string;
};

/**
 * 🔹 Função utilitária para converter uma Response em JSON com segurança.
 *
 * - Evita erros caso a resposta não seja JSON válido
 * - Padroniza tratamento de sucesso e erro
 * - Retorna null se o parsing falhar
 *
 * @param response - Objeto Response do fetch
 * @returns Dados da API (sucesso ou erro) ou null
 *
 * -----------------------------------------
 *
 * 🔹 Safe helper to parse a Response as JSON.
 *
 * - Prevents runtime crashes if response is not valid JSON
 * - Normalizes success and error handling
 * - Returns null if parsing fails
 *
 * @param response - Fetch Response object
 * @returns API data (success or error) or null
 */
export async function fetchJson<T>(
  response: Response,
): Promise<ApiSuccessResponse<T> | ApiErrorResponse | null> {
  try {
    const data = (await response.json()) as
      | ApiSuccessResponse<T>
      | ApiErrorResponse;

    return data;
  } catch {
    return null;
  }
}
