import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getMyOrders } from "@/sanity/queries";
import Container from "./Container";
import HeaderMenu from "./HeaderMenu";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import SignIn from "./SignIn";

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

        <ClerkLoaded>
          <SignedIn>
            <UserButton />
          </SignedIn>
          {!user && <SignIn />}
        </ClerkLoaded>
      </Container>
    </header>
  );
};

export default Header;
