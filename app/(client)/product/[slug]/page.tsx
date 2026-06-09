import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getProductQuestions } from "@/actions/questionActions";
import {
  getProductRating,
  getProductReviews,
  verifyPurchase,
} from "@/actions/reviewActions";
import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import PriceView from "@/components/PriceView";
import { ProductActions } from "@/components/ProductActions";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import { ProductSEO } from "@/components/ProductSEO";
import { ShippingInfoCard } from "@/components/ShippingInfoCard";
import StarRating from "@/components/StarRating";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getProductBySlug } from "@/sanity/queries";

const ImageView = dynamic(() => import("@/components/ImageView"), {
  loading: () => <Skeleton className="h-96 w-full rounded-lg" />,
});

const ReviewSection = dynamic(() => import("./ReviewSection"), {
  loading: () => (
    <div className="my-8">
      <Skeleton className="h-8 w-48 mb-4" />
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  ),
});

const QuestionsSection = dynamic(() => import("./QuestionsSection"), {
  loading: () => (
    <div className="my-8">
      <Skeleton className="h-8 w-48 mb-4" />
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  ),
});

export const revalidate = 30;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produto não encontrado | FMShop",
    };
  }

  return {
    title: `${product.name} | FMShop`,
    description: product.description || `Compre ${product.name} na FMShop`,
  };
}

const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const [product, { userId }] = await Promise.all([
    getProductBySlug(slug),
    auth(),
  ]);

  if (!product) {
    return notFound();
  }

  const [reviews, ratingData, purchaseData, questions] = await Promise.all([
    getProductReviews(product._id),
    getProductRating(product._id),
    userId ? verifyPurchase(userId, product._id) : { hasPurchased: false },
    getProductQuestions(product._id),
  ]);

  const hasPurchased = purchaseData.hasPurchased;

  const breadcrumbs = [
    { name: "Home", url: "https://fm-ecommerce-jade.vercel.app" },
    { name: "Shop", url: "https://fm-ecommerce-jade.vercel.app/shop" },
    {
      name: product.name || "Produto",
      url: `https://fm-ecommerce-jade.vercel.app/product/${slug}`,
    },
  ];

  return (
    <>
      <ProductSEO
        product={product}
        breadcrumbs={breadcrumbs}
        ratingData={ratingData}
      />
      <Container>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 py-8 lg:py-12">
          {product?.images && (
            <ImageView
              images={product?.images}
              isStock={product?.stock}
              name={product?.name}
            />
          )}
          <div className="w-full lg:w-1/2 flex flex-col gap-6 lg:gap-8">
            <div className="space-y-4">
              <Badge
                variant="secondary"
                className="w-fit bg-shop_light_pink text-shop_dark_green font-medium text-xs uppercase tracking-wider"
              >
                {product?.variant}
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight">
                {product?.name}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                {product?.description}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <StarRating rating={Math.round(ratingData.average)} />
                <p className="text-sm font-semibold text-muted-foreground">
                  ({ratingData.count}{" "}
                  {ratingData.count === 1 ? "avaliação" : "avaliações"})
                </p>
              </div>
            </div>

            <Card className="border-border/60 bg-card/50">
              <CardContent className="p-6 space-y-4">
                <PriceView
                  price={product?.price}
                  discount={product?.discount}
                  className="text-2xl font-bold"
                />
                <div className="flex items-center gap-3">
                  <span
                    className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                      product?.stock === 0
                        ? "bg-destructive/10 text-destructive"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {(product?.stock as number) > 0
                      ? "✓ Em estoque"
                      : "✗ Sem estoque"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {product?.stock} unidades disponíveis
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-3">
              <AddToCartButton product={product} className="flex-1" />
              <FavoriteButton showProduct={true} product={product} />
            </div>

            <ProductCharacteristics product={product} />

            <ProductActions product={product} userId={userId} />

            <ShippingInfoCard />

            <ReviewSection
              productId={product._id}
              userId={userId}
              hasPurchased={hasPurchased}
              reviews={reviews}
              ratingData={ratingData}
            />

            <QuestionsSection
              productId={product._id}
              productName={product.name || ""}
              userId={userId}
              questions={questions}
            />
          </div>
        </div>
      </Container>
    </>
  );
};

export default SingleProductPage;
