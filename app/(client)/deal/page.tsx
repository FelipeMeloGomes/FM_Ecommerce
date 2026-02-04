import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { Title } from "@/components/Text";
import { getDealProducts } from "@/sanity/queries";

const DealPage = async () => {
  const products = await getDealProducts();
  console.log(products);
  return (
    <div className="py-10 bg-deal-bg">
      <Container>
        <Title className="mb-5 underline underline-offset-4 decoration-[1px] text-base  uppercase tracking-wide">
          Hot Deals of the Week
        </Title>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {products?.map((product) => (
            // @ts-ignore
            <ProductCard key={product?._id} product={product} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default DealPage;
