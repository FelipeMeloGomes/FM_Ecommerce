export type ServerResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export function ok<T>(): ServerResult<T>;
export function ok<T>(data: T): ServerResult<T>;
export function ok<T>(data?: T): ServerResult<T> {
  return { success: true, data: data as T };
}

export function err<T = void>(message: string): ServerResult<T> {
  return { success: false, error: message };
}
