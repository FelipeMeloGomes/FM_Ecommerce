import { Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import type { Product } from "@/sanity.types";
import AddToCartButton from "./AddToCartButton";
import PriceView from "./PriceView";
import ProductSideMenu from "./ProductSideMenu";
import StarRating from "./StarRating";
import Title from "./Title";
import { Badge } from "./ui/badge";

interface ProductWithRating extends Product {
  rating?: number;
  reviewCount?: number;
}

const ProductCard = ({ product }: { product: ProductWithRating }) => {
  return (
    <div className="group relative bg-card border border-border/60 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-shop_orange/10 transition-all duration-300">
      <div className="relative aspect-square bg-muted/20 overflow-hidden">
        {product?.images && (
          <Link href={`/product/${product?.slug?.current}`}>
            <Image
              src={urlFor(product.images[0]).url()}
              alt="productImage"
              width={500}
              height={500}
              priority
              className={`w-full h-full object-contain transition-transform duration-500 
              ${product?.stock !== 0 ? "group-hover:scale-105" : "opacity-50 grayscale"}`}
            />
          </Link>
        )}
        <ProductSideMenu product={product} />
        {product?.status === "sale" ? (
          <Badge className="absolute top-3 left-3 bg-destructive/90 text-white text-xs font-medium">
            Promoção!
          </Badge>
        ) : (
          <Link
            href={"/deal"}
            className="absolute top-3 left-3 p-1.5 rounded-full bg-shop_orange/90 hover:bg-shop_orange transition-colors"
          >
            <Flame size={16} className="text-white" />
          </Link>
        )}
      </div>
      <div className="p-4 flex flex-col gap-3">
        {product?.categories && (
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider line-clamp-1">
            {product.categories.map((cat) => cat).join(", ")}
          </p>
        )}
        <Title className="text-base line-clamp-2 leading-tight">
          {product?.name}
        </Title>
        <div className="flex items-center gap-2">
          <StarRating rating={product?.rating ?? 0} />
          {product?.reviewCount !== undefined && product?.reviewCount > 0 ? (
            <p className="text-xs text-muted-foreground">
              ({product?.reviewCount})
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">(0)</p>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Estoque:</span>
          <span
            className={`font-semibold ${product?.stock === 0 ? "text-destructive" : "text-emerald-600"}`}
          >
            {(product?.stock as number) > 0
              ? `${product?.stock} unidades`
              : "Indisponível"}
          </span>
        </div>

        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-base"
        />
        <AddToCartButton product={product} className="w-full rounded-lg" />
      </div>
    </div>
  );
};

export default ProductCard;
