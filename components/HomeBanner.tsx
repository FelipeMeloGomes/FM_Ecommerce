import Image from "next/image";
import Link from "next/link";
import { banner_1 } from "@/images";
import { Title } from "./ui/text";

const HomeBanner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-neutral-100/80 via-background to-neutral-50/60 dark:from-neutral-900 dark:via-neutral-950 dark:to-black rounded-none lg:rounded-2xl p-8 lg:p-16 border border-border dark:border-neutral-800">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-200/30 to-transparent dark:from-neutral-800/20 dark:to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        <div className="space-y-6 max-w-xl text-center lg:text-left">
          <Title
            className="text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.1] dark:text-neutral-100 animate-fade-in-up"
            style={{ animationDelay: "0ms" }}
          >
            Garanta até <span className="font-bold">50% OFF</span>
            <br />
            em fones selecionados
          </Title>
          <p
            className="text-sm lg:text-base text-muted-foreground dark:text-neutral-500 animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            Ofertas por tempo limitado. Não perca essa oportunidade.
          </p>
          <Link
            href={"/shop"}
            className="inline-flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 px-8 py-4 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            Ver ofertas
          </Link>
        </div>

        <div
          className="relative animate-fade-in-scale"
          style={{ animationDelay: "300ms" }}
        >
          <div className="absolute -inset-4 bg-gradient-to-br from-neutral-300/20 to-neutral-100/10 dark:from-neutral-700/20 dark:to-neutral-900/10 rounded-full blur-3xl opacity-50" />
          <Image
            src={banner_1}
            alt="banner_1"
            width={450}
            height={450}
            className="relative w-64 lg:w-96 h-64 lg:h-96 object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
