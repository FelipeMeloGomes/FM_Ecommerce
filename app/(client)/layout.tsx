import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL("https://fm-ecommerce-jade.vercel.app"),
  title: {
    template: "%s | FMShop",
    default: "FMShop",
  },
  description:
    "FMShop loja online, seu ponto único para todas as suas necessidades de eletrônicos e eletrodomésticos",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://fm-ecommerce-jade.vercel.app",
    siteName: "FMShop",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FMShop - Loja de Eletrônicos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
