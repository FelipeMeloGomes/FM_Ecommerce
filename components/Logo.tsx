import Link from "next/link";
import { cn } from "@/lib/utils";

const Logo = ({
  className,
  spanDesign,
}: {
  className?: string;
  spanDesign?: string;
}) => {
  return (
    <Link href={"/"} className="inline-flex">
      <h2
        className={cn(
          "text-2xl text-shop_dark_green dark:text-white font-black tracking-wider uppercase hover:text-shop_orange transition-colors",
          className,
        )}
      >
        FM
        <span className={cn("text-shop_orange transition-colors", spanDesign)}>
          Shop
        </span>
      </h2>
    </Link>
  );
};

export default Logo;
