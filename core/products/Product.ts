export interface Product {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  weight: number;
  width: number;
  height: number;
  length: number;
  status?: string;
  variant?: string;
  isFeatured: boolean;
  brand?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
  };
  categories?: {
    _type: "reference";
    _ref: string;
    _key?: string;
    _weak?: boolean;
  }[];
  images: ProductImage[];
}

export interface ProductImage {
  _key: string;
  _type: "image";
  asset: {
    _type: "reference";
    _ref: string;
  };
}
