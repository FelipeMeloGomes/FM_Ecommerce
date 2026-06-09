import { z } from "zod";
import { idParam, registry } from "@/lib/openapi/registry";

const categoryBody = z.object({
  title: z.string().openapi({ description: "Category title" }),
  description: z
    .string()
    .optional()
    .openapi({ description: "Category description" }),
  range: z.coerce
    .number()
    .min(0)
    .optional()
    .openapi({ description: "Sorting range" }),
  featured: z
    .enum(["true", "false", "on", "1"])
    .optional()
    .openapi({ description: "Whether category is featured" }),
  image: z
    .string()
    .optional()
    .openapi({ description: "Category image file", format: "binary" }),
  _removeImage: z.enum(["true"]).optional().openapi({
    description: "Set to true to remove existing image (PUT only)",
  }),
});

const success = z.object({ success: z.literal(true) });
const error = z.object({ success: z.literal(false), message: z.string() });

registry.registerPath({
  method: "post",
  path: "/api/admin/categories",
  summary: "Create a category",
  description:
    "Creates a new category with optional image. Admin-only endpoint.",
  tags: ["Admin - Categories"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      description: "Category data as multipart/form-data",
      required: true,
      content: {
        "multipart/form-data": {
          schema: categoryBody,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Category created",
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
  path: "/api/admin/categories/{id}",
  summary: "Update a category",
  description: "Updates an existing category. Admin-only endpoint.",
  tags: ["Admin - Categories"],
  security: [{ bearerAuth: [] }],
  request: {
    params: idParam,
    body: {
      description: "Updated category data as multipart/form-data",
      required: true,
      content: {
        "multipart/form-data": {
          schema: categoryBody,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Category updated",
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
      description: "Category not found",
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
  path: "/api/admin/categories/{id}",
  summary: "Delete a category",
  description: "Deletes a category by ID. Admin-only endpoint.",
  tags: ["Admin - Categories"],
  security: [{ bearerAuth: [] }],
  request: { params: idParam },
  responses: {
    200: {
      description: "Category deleted",
      content: { "application/json": { schema: success } },
    },
    403: {
      description: "Unauthorized",
      content: { "application/json": { schema: error } },
    },
    404: {
      description: "Category not found",
      content: { "application/json": { schema: error } },
    },
    500: {
      description: "Server error",
      content: { "application/json": { schema: error } },
    },
  },
});
