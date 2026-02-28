import type { SchemaTypeDefinition } from "sanity";
import { addressType } from "./addressType";
import { authorType } from "./authorType";
import { blockContentType } from "./blockContentType";
import { blogCategoryType } from "./blogCategoryType";
import { blogType } from "./blogType";
import { brandType } from "./brandTypes";
import { categoryType } from "./categoryType";
import { orderType } from "./orderType";
import { productType } from "./productType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    categoryType,
    blockContentType,
    productType,
    orderType,
    brandType,
    blogType,
    blogCategoryType,
    authorType,
    addressType,
  ],
};
