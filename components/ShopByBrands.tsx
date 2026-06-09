import { GitCompareArrows, Headset, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { getAllBrands } from "@/sanity/queries";
import Title from "./Title";

const benefits = [
  { icon: Truck, label: "Frete grátis", sub: "Acima de R$100" },
  { icon: GitCompareArrows, label: "Devolução", sub: "30 dias" },
  { icon: Headset, label: "Suporte 24/7", sub: "Sempre disponível" },
  { icon: ShieldCheck, label: "Garantia", sub: "Qualidade verificada" },
];

const ShopByBrands = async () => {
  const brands = await getAllBrands();

  return (
    <div className="space-y-8">
      <div className="bg-card dark:bg-card rounded-none lg:rounded-xl p-0 lg:p-8 border-x-0 lg:border border-border dark:border-neutral-800 -mx-4 lg:mx-0">
        <div className="flex items-center justify-between px-4 lg:px-0 pb-4 mb-0 lg:mb-6 border-b border-border dark:border-neutral-800">
          <Title className="text-lg font-semibold tracking-tight dark:text-neutral-100">
            Marcas
          </Title>
          <Link
            href={"/shop"}
            className="text-xs font-medium text-muted-foreground hover:text-foreground dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
          >
            Ver todas
          </Link>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-px lg:gap-3 bg-border dark:bg-neutral-800">
          {brands?.slice(0, 8).map((brand, index) => (
            <Link
              key={brand?._id}
              href={{
                pathname: "/shop",
                query: { brand: brand?.slug?.current },
              }}
              className="aspect-square flex items-center justify-center bg-card dark:bg-neutral-900 hover:bg-muted/50 dark:hover:bg-neutral-800 transition-colors duration-200 group animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {brand?.image ? (
                <Image
                  src={urlFor(brand?.image).url()}
                  alt={brand?.title || "Marca"}
                  width={80}
                  height={80}
                  className="w-16 h-12 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              ) : (
                <span className="text-xs text-muted-foreground">
                  {brand?.title?.[0]}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {benefits.map((item, index) => (
          <div
            key={item.label}
            className="flex items-center gap-3 p-4 rounded-xl bg-card dark:bg-neutral-900/50 border border-border dark:border-neutral-800 hover:border-neutral-600 dark:hover:border-neutral-700 transition-colors duration-200 animate-fade-in-up"
            style={{ animationDelay: `${index * 75 + 400}ms` }}
          >
            <item.icon
              className="w-5 h-5 text-muted-foreground dark:text-neutral-500 shrink-0"
              strokeWidth={1.5}
            />
            <div>
              <p className="text-sm font-medium text-foreground dark:text-neutral-200">
                {item.label}
              </p>
              <p className="text-xs text-muted-foreground">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopByBrands;
