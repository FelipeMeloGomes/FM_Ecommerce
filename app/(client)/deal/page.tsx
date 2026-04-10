import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import Title from "@/components/Title";
import { getDealProducts } from "@/sanity/queries";

export const revalidate = 300;

const DealPage = async () => {
  const products = await getDealProducts();
  return (
    <div className="min-h-screen bg-background">
      <Container className="py-8">
        <div className="mb-8">
          <Title className="text-2xl font-semibold tracking-tight">
            Ofertas da Semana
          </Title>
          <p className="text-sm text-muted-foreground mt-1">
            Produtos com desconto especial
          </p>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product?._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <svg
                className="h-10 w-10 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <title>Ícone de oferta</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Nenhuma oferta disponível</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Volte em breve para novas promoções
            </p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default DealPage;
