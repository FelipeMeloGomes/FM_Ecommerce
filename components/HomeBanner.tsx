import Image from "next/image";
import Link from "next/link";
import { banner_1 } from "@/images";

const HomeBanner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-shop-light-pink/20 to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black rounded-none lg:rounded-3xl p-6 lg:p-12 border border-neutral-200/50 dark:border-neutral-800/50">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-shop_orange/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-shop_dark_green/10 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Floating decorative shapes */}
      <div className="absolute top-12 right-12 w-3 h-3 bg-shop_orange rounded-full animate-float opacity-60" />
      <div
        className="absolute bottom-20 left-20 w-2 h-2 bg-shop_dark_green rounded-full animate-float opacity-40"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-4 h-4 border-2 border-shop_orange/30 rounded-full animate-float opacity-30"
        style={{ animationDelay: "0.5s" }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
        {/* Text content - asymmetric positioning */}
        <div className="space-y-6 max-w-xl text-center lg:text-left flex-1 lg:pl-4">
          <div
            className="inline-block px-3 py-1 bg-shop_orange/10 dark:bg-shop_orange/20 rounded-full text-shop_orange text-xs font-semibold tracking-wider uppercase animate-fade-in-up"
            style={{ animationDelay: "0ms" }}
          >
            Oferta da Semana
          </div>

          <h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1] dark:text-white animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            <span className="bg-gradient-to-r from-shop_dark_green to-shop_light_green dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
              50% OFF
            </span>
            <br />
            <span className="text-neutral-900 dark:text-neutral-100">
              em fones
            </span>
            <br />
            <span className="text-neutral-500 dark:text-neutral-500 font-medium text-3xl sm:text-4xl lg:text-5xl">
              selecionados
            </span>
          </h1>

          <p
            className="text-sm lg:text-base text-neutral-600 dark:text-neutral-400 max-w-md animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            Qualidade premium com preços que cabem no seu bolso.
            <span className="text-shop_orange font-medium">
              {" "}
              Oferta por tempo limitado.
            </span>
          </p>

          <div
            className="flex flex-col sm:flex-row items-center gap-3 pt-2 animate-fade-in-up"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href={"/shop"}
              className="group inline-flex items-center justify-center bg-shop_dark_green hover:bg-shop_btn_dark_green text-white px-8 py-4 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-shop_dark_green/20 hover:shadow-xl hover:shadow-shop_dark_green/30"
            >
              <span>Ver ofertas</span>
              <svg
                className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              Frete grátis acima de R$ 199
            </p>
          </div>
        </div>

        {/* Image - asymmetric with decorative elements */}
        <div
          className="relative flex-shrink-0 animate-fade-in-scale"
          style={{ animationDelay: "400ms" }}
        >
          {/* Glow effect behind image */}
          <div className="absolute inset-0 bg-gradient-to-br from-shop_orange/20 to-shop_dark_green/20 rounded-full blur-3xl scale-75 opacity-60" />

          {/* Main image container */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-shop_orange/10 to-transparent rounded-3xl" />
            <Image
              src={banner_1}
              alt="Banner promocional 50% OFF em fones selecionados"
              width={420}
              height={420}
              className="relative w-56 sm:w-72 lg:w-96 h-56 sm:h-72 lg:h-96 object-contain drop-shadow-2xl animate-float"
              priority
            />
          </div>

          {/* Badge decoration */}
          <div
            className="absolute -bottom-2 -right-2 lg:-bottom-4 lg:-right-4 bg-white dark:bg-neutral-800 rounded-2xl p-3 lg:p-4 shadow-xl animate-fade-in-up"
            style={{ animationDelay: "500ms" }}
          >
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              A partir de
            </p>
            <p className="text-xl lg:text-2xl font-bold text-shop_dark_green">
              R$ 99
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
