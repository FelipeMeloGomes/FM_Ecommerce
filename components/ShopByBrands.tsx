import { GitCompareArrows, Headset, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { getAllBrands } from "@/sanity/queries";
import type { Brand } from "@/sanity.types";
import Title from "./Title";

const extraData = [
  {
    title: "Entrega Grátis",
    description: "Frete grátis para compras acima de R$100",
    icon: <Truck size={40} />,
  },
  {
    title: "Devolução Grátis",
    description: "Frete grátis para devoluções",
    icon: <GitCompareArrows size={40} />,
  },
  {
    title: "Suporte ao Cliente",
    description: "Atendimento amigável 24/7",
    icon: <Headset size={40} />,
  },
  {
    title: "Garantia de Reembolso",
    description: "Qualidade verificada pela nossa equipe",
    icon: <ShieldCheck size={40} />,
  },
];

const ShopByBrands = async () => {
  const brands = await getAllBrands();
  return (
    <div className="bg-muted/30 border border-border/60 rounded-xl p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <Title>Comprar por Marcas</Title>
        <Link
          href={"/shop"}
          className="text-sm font-semibold text-shop_orange hover:text-shop_btn_dark_green transition-colors"
        >
          Ver tudo
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {brands?.map((brand: Brand) => (
          <Link
            key={brand?._id}
            href={{ pathname: "/shop", query: { brand: brand?.slug?.current } }}
            className="aspect-square flex items-center justify-center rounded-xl bg-card border border-border/40 hover:border-shop_orange hover:shadow-lg hover:shadow-shop_orange/10 transition-all"
          >
            {brand?.image && (
              <Image
                src={urlFor(brand?.image).url()}
                alt="brandImage"
                width={100}
                height={100}
                className="w-20 h-14 object-contain"
              />
            )}
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
        {extraData?.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/40 hover:border-shop_orange/30 transition-colors"
          >
            <span className="p-2.5 rounded-full bg-shop_orange/10 text-shop_orange">
              {item?.icon}
            </span>
            <div>
              <p className="font-semibold text-foreground">{item?.title}</p>
              <p className="text-sm text-muted-foreground">
                {item?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopByBrands;
