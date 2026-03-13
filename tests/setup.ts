import "@testing-library/jest-dom";
import { vi } from "vitest";

process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "test-project";
process.env.NEXT_PUBLIC_SANITY_API_VERSION = "2026-01-28";
process.env.SANITY_TOKEN_ADM = "test-token";

if (typeof File !== "undefined" && !File.prototype.arrayBuffer) {
  File.prototype.arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(8));
}
