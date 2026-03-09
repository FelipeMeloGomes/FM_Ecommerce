import { defineQuery } from "next-sanity";

const BRANDS_QUERY = defineQuery(`*[_type=='brand'] | order(name asc) `);

const DEAL_PRODUCTS = defineQuery(
  `*[_type == 'product' && status == 'hot'] | order(name asc){
    ...,"categories": categories[]->title
  }`,
);

const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug] | order(name asc) [0]`,
);

const BRAND_QUERY = defineQuery(`*[_type == "product" && slug.current == $slug]{
  "brandName": brand->title
  }`);

const MY_ORDERS_QUERY = defineQuery(`
{
  "orders": *[
    _type == "order" &&
    ($isAdmin == true || clerkUserId == $userId)
  ] | order(orderDate desc) [$start...$end]{
    ...,
    products[]{
      ...,
      product->
    }
  },

  "total": count(*[
    _type == "order" &&
    ($isAdmin == true || clerkUserId == $userId)
  ])
}
`);

const GET_ADDRESSES_QUERY = defineQuery(`
  *[_type == "address" && clerkUserId == $userId]
  | order(createdAt desc)
`);

const GET_OTHER_ADDRESSES_QUERY = `
  *[_type == "address" && clerkUserId == $userId && _id != $id]
`;

const SHOP_PRODUCTS_QUERY = `
  *[_type == 'product' 
    && (!defined($selectedCategory) || references(*[_type == "category" && slug.current == $selectedCategory]._id))
    && (!defined($selectedBrand) || references(*[_type == "brand" && slug.current == $selectedBrand]._id))
    && price >= $minPrice && price <= $maxPrice
  ] 
  | order(name asc) {
    ...,
    "categories": categories[]->title
  }
`;

const PRODUCTS_BY_CATEGORY_QUERY = `
  *[_type == "product" && references(*[_type == "category" && slug.current == $categorySlug]._id)]
  | order(name asc){
    ...,
    "categories": categories[]->title
  }
`;

const PRODUCTS_BY_VARIANT_QUERY = `
  *[_type == "product" && variant == $variant] 
  | order(name asc){
    ...,
    "categories": categories[]->title
  }
`;

export {
  BRANDS_QUERY,
  DEAL_PRODUCTS,
  PRODUCT_BY_SLUG_QUERY,
  BRAND_QUERY,
  MY_ORDERS_QUERY,
  GET_ADDRESSES_QUERY,
  GET_OTHER_ADDRESSES_QUERY,
  SHOP_PRODUCTS_QUERY,
  PRODUCTS_BY_VARIANT_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
};
