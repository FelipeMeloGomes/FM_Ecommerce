import Image from "next/image";
import Link from "next/link";
import { banner_1 } from "@/images";
import { Title } from "./ui/text";

const HomeBanner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-shop_light_pink/50 via-background to-shop_light_pink/30 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800 rounded-2xl p-8 lg:p-12">
      <div className="absolute inset-0 bg-gradient-to-r from-shop_light_pink/20 to-transparent dark:hidden" />
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-4 max-w-lg">
          <Title className="text-3xl lg:text-4xl font-bold leading-tight">
            Garanta até 50% OFF em <br />
            Fones de ouvido selecionados
          </Title>
          <Link
            href={"/shop"}
            className="inline-flex bg-shop_dark_green hover:bg-shop_btn_dark_green text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:shadow-shop_dark_green/25"
          >
            Comprar agora
          </Link>
        </div>
        <div className="hidden lg:block">
          <Image
            src={banner_1}
            alt="banner_1"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
