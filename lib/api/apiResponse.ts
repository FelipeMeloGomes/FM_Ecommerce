import { NextResponse } from "next/server";

/**
 * Retorna uma resposta JSON de sucesso padronizada.
 *
 * @param data Dados adicionais a mesclar na resposta (opcional)
 * @param status HTTP status code (padrão 200)
 */
export const successResponse = (data?: object, status = 200) =>
  NextResponse.json({ success: true, ...data }, { status });

/**
 * Retorna uma resposta JSON de erro padronizada.
 * O campo `message` é lido pelo `apiRequest` do cliente automaticamente.
 *
 * @param message Mensagem de erro
 * @param status HTTP status code
 */
export const errorResponse = (message: string, status: number) =>
  NextResponse.json({ success: false, message }, { status });
