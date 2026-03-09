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

export {
  BRANDS_QUERY,
  DEAL_PRODUCTS,
  PRODUCT_BY_SLUG_QUERY,
  BRAND_QUERY,
  MY_ORDERS_QUERY,
  GET_ADDRESSES_QUERY,
  GET_OTHER_ADDRESSES_QUERY,
};
