import Image from "next/image";
import Link from "next/link";
import React from "react";
import { urlFor } from "@/sanity/lib/image";
import type { Category } from "@/sanity.types";
import Title from "./Title";

const HomeCategories = React.memo(
  ({ categories }: { categories: Category[] }) => {
    return (
      <div className="bg-card dark:bg-card rounded-none lg:rounded-xl p-0 lg:p-8 border-x-0 lg:border border-border dark:border-neutral-800 -mx-4 lg:mx-0">
        <div className="px-4 lg:px-0">
          <Title className="text-lg font-semibold tracking-tight pb-4 mb-0 lg:mb-6 border-b border-border dark:border-neutral-800 dark:text-neutral-100">
            Categorias
          </Title>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px lg:gap-4 bg-border dark:bg-neutral-800">
          {categories?.map((category, index) => (
            <Link
              key={category?._id}
              href={`/category/${category?.slug?.current}`}
              className="flex items-center gap-4 p-4 lg:p-5 bg-card dark:bg-neutral-900 hover:bg-muted/50 dark:hover:bg-neutral-800 transition-colors duration-200 group animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {category?.image && (
                <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-border dark:border-neutral-700">
                  <Image
                    src={urlFor(category?.image).url()}
                    alt={category?.title || "Categoria"}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm lg:text-base font-medium text-foreground dark:text-neutral-100 truncate">
                  {category?.title}
                </h3>
                <p className="text-xs lg:text-sm text-muted-foreground mt-0.5">
                  <span className="font-medium dark:text-neutral-400">
                    {(category as unknown as { productCount?: number })
                      ?.productCount ?? 0}
                  </span>{" "}
                  itens
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
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
