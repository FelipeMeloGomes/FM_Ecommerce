import WishListProducts from "@/components/WishListProducts";
import { GuestWishlistPrompt } from "@/components/wishlist/GuestWishlistPrompt";

const WishListPage = () => {
  return <WishListProducts GuestPrompt={GuestWishlistPrompt} />;
};

export default WishListPage;
