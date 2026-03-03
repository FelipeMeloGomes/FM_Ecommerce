export interface Product {
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
