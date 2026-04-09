import Image from "next/image";
import Link from "next/link";
import React from "react";
import { urlFor } from "@/sanity/lib/image";
import type { Category } from "@/sanity.types";
import Title from "./Title";

const HomeCategories = React.memo(
  ({ categories }: { categories: Category[] }) => {
    return (
      <div className="bg-card border border-border/60 rounded-xl p-6 lg:p-8">
        <Title className="border-b border-border/40 pb-4 mb-6">
          Categorias Populares
        </Title>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.map((category) => (
            <Link
              key={category?._id}
              href={`/category/${category?.slug?.current}`}
              className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted border border-transparent hover:border-shop_orange/30 transition-all group"
            >
              {category?.image && (
                <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-border">
                  <Image
                    src={urlFor(category?.image).url()}
                    alt="categoryImage"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
              )}
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">
                  {category?.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold text-shop_dark_green">
                    {(category as unknown as { productCount?: number })
                      ?.productCount ?? 0}
                  </span>{" "}
                  Itens disponíveis
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  },
);

HomeCategories.displayName = "HomeCategories";

export default HomeCategories;
