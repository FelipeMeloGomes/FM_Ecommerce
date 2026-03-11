export interface BrandImage {
  _key: string;
  _type: "image";
  asset: {
    _type: "reference";
    _ref: string;
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface Brand {
  _id?: string;
  title: string;
  slug: string;
  description?: string;
  image?: BrandImage;
}
