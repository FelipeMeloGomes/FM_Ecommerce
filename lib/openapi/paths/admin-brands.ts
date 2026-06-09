import { z } from "zod";
import { idParam, registry } from "@/lib/openapi/registry";

const brandBody = z.object({
  title: z.string().openapi({ description: "Brand title" }),
  description: z
    .string()
    .optional()
    .openapi({ description: "Brand description" }),
  image: z
    .string()
    .optional()
    .openapi({ description: "Brand image file", format: "binary" }),
  _removeImage: z.enum(["true"]).optional().openapi({
    description: "Set to true to remove existing image (PUT only)",
  }),
});

const success = z.object({ success: z.literal(true) });
const error = z.object({ success: z.literal(false), message: z.string() });

registry.registerPath({
  method: "post",
  path: "/api/admin/brands",
  summary: "Create a brand",
  description: "Creates a new brand with optional image. Admin-only endpoint.",
  tags: ["Admin - Brands"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      description: "Brand data as multipart/form-data",
      required: true,
      content: {
        "multipart/form-data": {
          schema: brandBody,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Brand created",
      content: { "application/json": { schema: success } },
    },
    400: {
      description: "Validation error",
      content: { "application/json": { schema: error } },
    },
    403: {
      description: "Unauthorized",
      content: { "application/json": { schema: error } },
    },
    500: {
      description: "Server error",
      content: { "application/json": { schema: error } },
    },
  },
});

registry.registerPath({
  method: "put",
  path: "/api/admin/brands/{id}",
  summary: "Update a brand",
  description: "Updates an existing brand. Admin-only endpoint.",
  tags: ["Admin - Brands"],
  security: [{ bearerAuth: [] }],
  request: {
    params: idParam,
    body: {
      description: "Updated brand data as multipart/form-data",
      required: true,
      content: {
        "multipart/form-data": {
          schema: brandBody,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Brand updated",
      content: { "application/json": { schema: success } },
    },
    400: {
      description: "Validation error",
      content: { "application/json": { schema: error } },
    },
    403: {
      description: "Unauthorized",
      content: { "application/json": { schema: error } },
    },
    404: {
      description: "Brand not found",
      content: { "application/json": { schema: error } },
    },
    500: {
      description: "Server error",
      content: { "application/json": { schema: error } },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/admin/brands/{id}",
  summary: "Delete a brand",
  description: "Deletes a brand by ID. Admin-only endpoint.",
  tags: ["Admin - Brands"],
  security: [{ bearerAuth: [] }],
  request: { params: idParam },
  responses: {
    200: {
      description: "Brand deleted",
      content: { "application/json": { schema: success } },
    },
    403: {
      description: "Unauthorized",
      content: { "application/json": { schema: error } },
    },
    404: {
      description: "Brand not found",
      content: { "application/json": { schema: error } },
    },
    500: {
      description: "Server error",
      content: { "application/json": { schema: error } },
    },
  },
});
