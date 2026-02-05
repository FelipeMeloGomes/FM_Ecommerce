import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import { getProductBySlug } from "@/sanity/queries";
import { CornerDownLeft, StarIcon, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { RxBorderSplit } from "react-icons/rx";
import { TbTruckDelivery } from "react-icons/tb";

const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return notFound();
  }
  return (
    <Container className="flex flex-col md:flex-row gap-10 py-10">
      {product?.images && (
        <ImageView images={product?.images} isStock={product?.stock} />
      )}
      <div className="w-full md:w-1/2 flex flex-col gap-5">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{product?.name}</h2>
          <p className="text-sm text-gray-600 tracking-wide">
            {product?.description}
          </p>
          <div className="flex items-center gap-0.5 text-xs">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                size={12}
                className="text-shop_light_green"
                fill={"#3b9c3c"}
              />
            ))}
            <p className="font-semibold">{`(120)`}</p>
          </div>
        </div>
        <div className="space-y-2 border-t border-b border-gray-200 py-5">
          <PriceView
            price={product?.price}
            discount={product?.discount}
            className="text-lg font-bold"
          />
          <p
            className={`px-4 py-1.5 text-sm text-center inline-block font-semibold rounded-lg ${product?.stock === 0 ? "bg-red-100 text-red-600" : "text-green-600 bg-green-100"}`}
          >
            {(product?.stock as number) > 0 ? "In Stock" : "Out of Stock"}
          </p>
        </div>
        <div className="flex items-center gap-2.5 lg:gap-3">
          <AddToCartButton product={product} />
          <FavoriteButton showProduct={true} product={product} />
        </div>
        <ProductCharacteristics product={product} />
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-b-gray-200 py-5 -mt-2">
          <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
            <RxBorderSplit className="text-lg" />
            <p>Comparar cores</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
            <FaRegQuestionCircle className="text-lg" />
            <p>Faça uma pergunta</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
            <TbTruckDelivery className="text-lg" />
            <p>Entrega e Devolução</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
            <FiShare2 className="text-lg" />
            <p>Compartilhar</p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="border border-lightColor/25 border-b-0 p-3 flex items-center gap-2.5">
            <Truck size={30} className="text-shop_orange" />
            <div>
              <p className="text-base font-semibold text-black">
                Entrega Grátis
              </p>
              <p className="text-sm text-gray-500 underline underline-offset-2">
                Digite seu CEP para ver a disponibilidade de entrega.
              </p>
            </div>
          </div>
          <div className="border border-lightColor/25 p-3 flex items-center gap-2.5">
            <CornerDownLeft size={30} className="text-shop_orange" />
            <div>
              <p className="text-base font-semibold text-black">
                Devolução do Pedido
              </p>
              <p className="text-sm text-gray-500 ">
                Devoluções grátis em até 30 dias.{" "}
                <span className="underline underline-offset-2">Detalhes</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SingleProductPage;
