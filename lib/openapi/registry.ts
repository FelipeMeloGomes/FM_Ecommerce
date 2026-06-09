import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "Clerk Session Token",
  description:
    "Clerk session token. Obtained automatically after client-side authentication.",
});

export const successResponse = z.object({
  success: z.literal(true),
});

export const errorResponse = z.object({
  success: z.literal(false),
  message: z.string(),
});

registry.register("ApiSuccessResponse", successResponse);
registry.register("ApiErrorResponse", errorResponse);

export const idParam = z.object({
  id: z.string().openapi({ description: "Resource ID" }),
});
