import { currentUser } from "@clerk/nextjs/server";
import NoAccess from "@/components/NoAccess";
import WishListProducts from "@/components/WishListProducts";

const WishListPage = async () => {
  const user = await currentUser();
  return (
    <>
      {user ? (
        <WishListProducts />
      ) : (
        <NoAccess details="Faça login para ver os itens da sua lista de desejos. Não perca os produtos do seu carrinho para efetuar o pagamento!" />
      )}
    </>
  );
};

export default WishListPage;
