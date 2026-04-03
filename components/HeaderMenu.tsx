"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { headerData } from "@/constants/data";

const HeaderMenu = () => {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center justify-center gap-6 text-sm font-medium">
      {headerData?.map((item) => (
        <Link
          key={item?.title}
          href={item?.href}
          className={`relative py-2 transition-colors ${
            pathname === item?.href
              ? "text-shop_dark_green"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {item?.title}
          <span
            className={`absolute -bottom-0 left-0 w-full h-0.5 bg-shop_dark_green transition-transform origin-left ${
              pathname === item?.href ? "scale-x-100" : "scale-x-0"
            }`}
          />
        </Link>
      ))}
    </nav>
  );
};

export default HeaderMenu;
