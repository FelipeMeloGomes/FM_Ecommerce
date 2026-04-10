import type { Metadata } from "next";
import CategoryProducts from "@/components/CategoryProducts";
import Container from "@/components/Container";
import Title from "@/components/Title";
import { Badge } from "@/components/ui/badge";
import { getCategories, getCategoriesStatic } from "@/sanity/queries";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const categories = await getCategoriesStatic();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `${slug && slug.charAt(0).toUpperCase() + slug.slice(1)} | FMShop`,
    description: `Veja produtos da categoria ${slug} na FMShop`,
  };
}

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const categories = await getCategories();
  const { slug } = await params;
  return (
    <div className="py-8 lg:py-12">
      <Container>
        <div className="flex flex-col gap-2 mb-8">
          <Badge
            variant="outline"
            className="w-fit border-shop_orange text-shop_orange text-xs uppercase tracking-widest"
          >
            Categoria
          </Badge>
          <Title className="text-3xl lg:text-4xl font-bold">
            Produtos por Categoria
          </Title>
          <p className="text-muted-foreground text-lg">
            Navegue pela categoria{" "}
            <span className="font-semibold text-shop_dark_green capitalize">
              {slug && slug}
            </span>
          </p>
        </div>
        <CategoryProducts categories={categories} slug={slug} />
      </Container>
    </div>
  );
};

export default CategoryPage;
