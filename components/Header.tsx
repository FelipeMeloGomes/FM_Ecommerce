import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ShieldCheck } from "lucide-react";
import { getMyOrders } from "@/sanity/queries";
import Container from "./Container";
import HeaderMenu from "./HeaderMenu";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import SignIn from "./SignIn";

export const revalidate = 60;

const Header = async () => {
  const [user, { userId }] = await Promise.all([currentUser(), auth()]);
  const isAdmin = user?.publicMetadata?.role === "admin";

  let ordersData = null;

  if (userId) {
    ordersData = await getMyOrders(userId, 0, 1);
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

        <div className="flex items-center gap-2">
          {isAdmin && (
            <span className="flex items-center gap-1 text-xs font-semibold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </span>
          )}
          {userId ? <UserButton /> : <SignIn />}
        </div>
      </Container>
    </header>
  );
};

export default Header;
