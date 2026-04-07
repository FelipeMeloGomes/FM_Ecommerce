import type { SchemaTypeDefinition } from "sanity";
import { addressType } from "./addressType";
import { brandType } from "./brandTypes";
import { categoryType } from "./categoryType";
import { orderType } from "./orderType";
import { productQuestionType } from "./productQuestionType";
import { productType } from "./productType";
import { reviewType } from "./reviewType";
import { wishlistType } from "./wishlistType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    categoryType,
    productType,
    orderType,
    brandType,
    addressType,
    wishlistType,
    reviewType,
    productQuestionType,
  ],
};
