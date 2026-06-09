import { z } from "zod";
import { idParam, registry } from "@/lib/openapi/registry";

const productBody = z.object({
  name: z.string().openapi({ description: "Product name" }),
  description: z.string().openapi({ description: "Product description" }),
  price: z.coerce.number().openapi({ description: "Product price" }),
  discount: z.coerce
    .number()
    .min(0)
    .max(100)
    .optional()
    .openapi({ description: "Discount percentage (0-100)" }),
  stock: z.coerce
    .number()
    .int()
    .min(0)
    .optional()
    .openapi({ description: "Stock quantity" }),
  weight: z.coerce
    .number()
    .positive()
    .optional()
    .openapi({ description: "Weight in kg" }),
  width: z.coerce
    .number()
    .positive()
    .optional()
    .openapi({ description: "Width in cm" }),
  height: z.coerce
    .number()
    .positive()
    .optional()
    .openapi({ description: "Height in cm" }),
  length: z.coerce
    .number()
    .positive()
    .optional()
    .openapi({ description: "Length in cm" }),
  status: z.string().optional().openapi({ description: "Product status" }),
  variant: z.string().optional().openapi({ description: "Product variant" }),
  isFeatured: z
    .enum(["true", "false"])
    .optional()
    .openapi({ description: "Whether product is featured" }),
  categories: z
    .array(z.string())
    .optional()
    .openapi({ description: "Category IDs" }),
  brand: z.string().optional().openapi({ description: "Brand ID" }),
  images: z.array(z.string()).optional().openapi({
    description: "Product image files",
    format: "binary",
  }),
  retainedImages: z
    .string()
    .optional()
    .openapi({
      description:
        "JSON string of existing images to keep (PUT only). " +
        'Example: [{"_key":"abc","_type":"image","asset":{...}}]',
    }),
});

registry.registerPath({
  method: "post",
  path: "/api/admin/products",
  summary: "Create a product",
  description: "Creates a new product with images. Admin-only endpoint.",
  tags: ["Admin - Products"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      description: "Product data as multipart/form-data",
      required: true,
      content: {
        "multipart/form-data": {
          schema: productBody,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Product created successfully",
      content: {
        "application/json": {
          schema: z.object({ success: z.literal(true) }),
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: z.object({ success: z.literal(false), message: z.string() }),
        },
      },
    },
    403: {
      description: "Unauthorized or forbidden",
      content: {
        "application/json": {
          schema: z.object({ success: z.literal(false), message: z.string() }),
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: z.object({ success: z.literal(false), message: z.string() }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "put",
  path: "/api/admin/products/{id}",
  summary: "Update a product",
  description: "Updates an existing product. Admin-only endpoint.",
  tags: ["Admin - Products"],
  security: [{ bearerAuth: [] }],
  request: {
    params: idParam,
    body: {
      description: "Updated product data as multipart/form-data",
      required: true,
      content: {
        "multipart/form-data": {
          schema: productBody,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Product updated successfully",
      content: {
        "application/json": {
          schema: z.object({ success: z.literal(true) }),
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: z.object({ success: z.literal(false), message: z.string() }),
        },
      },
    },
    403: {
      description: "Unauthorized or forbidden",
      content: {
        "application/json": {
          schema: z.object({ success: z.literal(false), message: z.string() }),
        },
      },
    },
    404: {
      description: "Product not found",
      content: {
        "application/json": {
          schema: z.object({ success: z.literal(false), message: z.string() }),
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: z.object({ success: z.literal(false), message: z.string() }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/admin/products/{id}",
  summary: "Delete a product",
  description: "Deletes a product by ID. Admin-only endpoint.",
  tags: ["Admin - Products"],
  security: [{ bearerAuth: [] }],
  request: {
    params: idParam,
  },
  responses: {
    200: {
      description: "Product deleted successfully",
      content: {
        "application/json": {
          schema: z.object({ success: z.literal(true) }),
        },
      },
    },
    403: {
      description: "Unauthorized or forbidden",
      content: {
        "application/json": {
          schema: z.object({ success: z.literal(false), message: z.string() }),
        },
      },
    },
    404: {
      description: "Product not found",
      content: {
        "application/json": {
          schema: z.object({ success: z.literal(false), message: z.string() }),
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: z.object({ success: z.literal(false), message: z.string() }),
        },
      },
    },
  },
});
