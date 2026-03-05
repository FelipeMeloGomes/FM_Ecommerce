import { type ApiErrorResponse, fetchJson } from "./fetchJson";

/**
 * Opções da requisição (mesmo tipo do fetch nativo).
 *
 * Request options (same as native fetch).
 */
type ApiRequestOptions = RequestInit;

/**
 * Faz uma requisição HTTP padronizada para a API.
 *
 * - Inclui `credentials: "include"` automaticamente.
 * - Faz o parse do JSON usando `fetchJson`.
 * - Lança erro automaticamente caso a resposta não seja OK.
 * - Retorna os dados tipados em caso de sucesso.
 *
 * ---
 *
 * Makes a standardized HTTP request to the API.
 *
 * - Automatically includes `credentials: "include"`.
 * - Parses JSON using `fetchJson`.
 * - Automatically throws an error if the response is not OK.
 * - Returns typed data on success.
 *
 * @template T Tipo esperado da resposta (Expected response type)
 * @param url URL da API (API endpoint URL)
 * @param options Opções do fetch (Fetch options)
 * @returns Dados tipados da API (Typed API response data)
 * @throws Error quando a resposta não for bem-sucedida (Throws on non-OK response)
 */
export async function apiRequest<T>(
  url: string,
  options?: ApiRequestOptions,
): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    ...options,
  });

  const data = await fetchJson<T>(response);

  if (!response.ok) {
    const message =
      (data as ApiErrorResponse)?.message ||
      `Erro na requisição (${response.status})`;

    throw new Error(message);
  }

  if (!data) {
    throw new Error("Resposta inválida da API");
  }

  return data as T;
}
