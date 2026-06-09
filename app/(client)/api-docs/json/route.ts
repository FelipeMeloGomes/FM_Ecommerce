import { OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { registry } from "@/lib/openapi/registry";

import "@/lib/openapi/paths/webhook";
import "@/lib/openapi/paths/admin-products";
import "@/lib/openapi/paths/admin-categories";
import "@/lib/openapi/paths/admin-brands";

export async function GET() {
  const generator = new OpenApiGeneratorV31(registry.definitions);

  const document = generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "FM Ecommerce API",
      description:
        "API de administração do FM Ecommerce. " +
        "Endpoints para gerenciar produtos, categorias, marcas e pedidos. " +
        "Todos os endpoints admin requerem autenticação via Clerk (Bearer token).",
      version: "1.0.0",
    },
    servers: [
      { url: "http://localhost:3000", description: "Desenvolvimento local" },
    ],
  });

  return Response.json(document);
}
