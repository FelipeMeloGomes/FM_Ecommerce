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

const PRODUCTS_BY_BRAND_QUERY = defineQuery(
  `*[_type == "product" && brand->slug.current == $brandSlug] | order(name asc){
    ...,
    "categories": categories[]->{_id, title, slug}
  }`,
);

const MY_ORDERS_QUERY = defineQuery(`
{
  "orders": *[
    _type == "order" &&
    clerkUserId == $userId
  ] | order(orderDate desc) [$start...$end]{
    ...,
    products[]{
      ...,
      product->
    }
  },

  "total": count(*[
    _type == "order" &&
    clerkUserId == $userId
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
  | order(name asc) [$start...($start + $limit)] {
    _id,
    name,
    slug,
    price,
    discount,
    stock,
    images,
    status,
    variant,
    "categories": categories[]->title,
    "rating": *[_type == "review" && product._ref == ^._id][0].rating,
    "reviewCount": count(*[_type == "review" && product._ref == ^._id])
  }
`;

const PRODUCTS_BY_CATEGORY_QUERY = `
  *[_type == "product" && references(*[_type == "category" && slug.current == $categorySlug]._id)]
  | order(name asc){
    ...,
    "categories": categories[]->title,
    "rating": *[_type == "review" && product._ref == ^._id].rating,
    "reviewCount": count(*[_type == "review" && product._ref == ^._id])
  }
`;

const PRODUCTS_BY_VARIANT_QUERY = `
  *[_type == "product" && variant == $variant] 
  | order(name asc) [0...$limit]{
    ...,
    "categories": categories[]->title,
    "rating": *[_type == "review" && product._ref == ^._id].rating,
    "reviewCount": count(*[_type == "review" && product._ref == ^._id])
  }
`;

const SIMILAR_PRODUCTS_QUERY = `
  *[_type == "product" && _id != $currentProductId && references($categoryId)]
  | order(_createdAt desc) [0...6]{
    _id,
    name,
    slug,
    price,
    discount,
    stock,
    images,
    "categories": categories[]->title,
    "rating": *[_type == "review" && product._ref == ^._id].rating,
    "reviewCount": count(*[_type == "review" && product._ref == ^._id])
  }
`;

const PRODUCT_WITH_CATEGORIES_QUERY = `
  *[_type == "product" && _id == $productId][0]{
    _id,
    "categories": categories[]->{_id, title, slug}
  }
`;

const SITEMAP_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product"] {
    "slug": slug.current,
    _updatedAt
  }
`);

const SITEMAP_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] {
    "slug": slug.current,
    _updatedAt
  }
`);

const SITEMAP_BRANDS_QUERY = defineQuery(`
  *[_type == "brand"] {
    "slug": slug.current,
    _updatedAt
  }
`);

export {
  BRANDS_QUERY,
  DEAL_PRODUCTS,
  PRODUCT_BY_SLUG_QUERY,
  BRAND_QUERY,
  PRODUCTS_BY_BRAND_QUERY,
  MY_ORDERS_QUERY,
  GET_ADDRESSES_QUERY,
  GET_OTHER_ADDRESSES_QUERY,
  SHOP_PRODUCTS_QUERY,
  PRODUCTS_BY_VARIANT_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
  SIMILAR_PRODUCTS_QUERY,
  PRODUCT_WITH_CATEGORIES_QUERY,
  SITEMAP_PRODUCTS_QUERY,
  SITEMAP_CATEGORIES_QUERY,
  SITEMAP_BRANDS_QUERY,
};
