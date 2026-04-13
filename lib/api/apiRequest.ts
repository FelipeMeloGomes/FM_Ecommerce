import { type ApiErrorResponse, fetchJson } from "./fetchJson";

type ApiRequestOptions = RequestInit;

/**
 * Makes a standardized HTTP request to the API.
 *
 * - Automatically includes `credentials: "include"`.
 * - Adds CSRF token header for non-GET requests (reads from csrf-token cookie).
 * - Parses JSON using `fetchJson`.
 * - Throws error if response is not OK.
 * - Returns typed data on success.
 *
 * @template T Expected response type
 * @param url API endpoint URL
 * @param options Fetch options
 * @returns Typed API response data
 * @throws Error on non-OK response
 */
export async function apiRequest<T>(
  url: string,
  options?: ApiRequestOptions,
): Promise<T> {
  const method = options?.method?.toUpperCase() ?? "GET";

  const headers = new Headers(options?.headers);
  if (method !== "GET" && method !== "HEAD") {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers.set("X-CSRF-Token", csrfToken);
    }
  }

  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers,
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

/**
 * Gets CSRF token from cookie for non-GET requests.
 *
 * @returns CSRF token string or null
 */
function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "csrf-token") {
      return decodeURIComponent(value);
    }
  }
  return null;
}
