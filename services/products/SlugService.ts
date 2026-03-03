import slugify from "slugify";
import type { SlugGateway } from "@/core/products/SlugGateway";

export class SlugService implements SlugGateway {
  async generate(value: string): Promise<string> {
    return slugify(value, {
      lower: true,
      strict: true,
      locale: "pt",
    });
  }
}
