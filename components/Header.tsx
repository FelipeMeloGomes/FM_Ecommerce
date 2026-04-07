import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Logs } from "lucide-react";
import Link from "next/link";
import { getMyOrders } from "@/sanity/queries";
import CartIcon from "./CartIcon";
import Container from "./Container";
import FavoriteButton from "./FavoriteButton";
import HeaderMenu from "./HeaderMenu";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import SignIn from "./SignIn";
import { ThemeToggle } from "./ThemeToggle";

export const revalidate = 60;

const Header = async () => {
  const user = await currentUser();
  const { userId } = await auth();
  const isAdmin = user?.publicMetadata?.role === "admin";

  let ordersData = null;

  if (userId) {
    ordersData = await getMyOrders(userId, isAdmin, 0, 1);
  }

  return (
    <header className="sticky top-0 z-50 py-3 md:py-4 bg-background/80 backdrop-blur-lg border-b border-border/40">
      <Container className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <MobileMenu
            user={!!user}
            isAdmin={isAdmin}
            ordersCount={ordersData?.total ?? 0}
          />
          <Logo />
        </div>
        <HeaderMenu />
        <div className="flex items-center justify-end gap-1 md:gap-4">
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link
              href={"/cart"}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <CartIcon />
            </Link>
            <Link
              href={"/wishlist"}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <FavoriteButton />
            </Link>

            {user && (
              <Link
                href={"/orders"}
                className="p-2 rounded-lg hover:bg-muted transition-colors group relative"
              >
                <Logs className="w-5 h-5 text-muted-foreground group-hover:text-shop_dark_green transition-colors" />
                <span className="absolute -top-1 -right-1 bg-shop_dark_green text-white h-5 w-5 rounded-full text-xs font-semibold flex items-center justify-center">
                  {ordersData?.total ?? 0}
                </span>
              </Link>
            )}
          </div>

          <ClerkLoaded>
            <SignedIn>
              <UserButton />
            </SignedIn>
            {!user && <SignIn />}
          </ClerkLoaded>
        </div>
      </Container>
    </header>
  );
};

export default Header;
