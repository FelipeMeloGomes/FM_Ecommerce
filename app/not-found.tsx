import Link from "next/link";
import Logo from "@/components/Logo";

const NotFoundPage = () => {
  return (
    <div className="bg-background dark:bg-zinc-900 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 md:py-32">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Logo />

          <h2 className="mt-6 text-3xl font-extrabold text-foreground">
            Procurando por algo?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Desculpe. O endereço da web que você digitou não é uma página válida
            em nosso site.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <Link
              href="/"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-md text-white bg-shop_dark_green/80 hover:bg-shop_dark_green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shop_orange hoverEffect"
            >
              Ir para a página inicial do FMShopcart
            </Link>
            <Link
              href="/help"
              className="w-full flex items-center justify-center px-4 py-2 border border-border text-sm font-semibold rounded-md text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shop_dark_green"
            >
              Ajuda
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Precisa de ajuda? Visite a{" "}
            <Link
              href="/help"
              className="font-medium text-shop_dark_green hover:text-shop_btn_dark_green"
            >
              Seção de ajuda
            </Link>{" "}
            ou{" "}
            <Link
              href="/contact"
              className="font-medium text-shop_dark_green hover:text-shop_btn_dark_green"
            >
              Entre em contato conosco
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
