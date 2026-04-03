"use client";
import Link from "next/link";
import { productType } from "@/constants/data";

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabBar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        {productType?.map((item) => (
          <button
            type="button"
            onClick={() => onTabSelect(item?.title)}
            key={item?.title}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedTab === item?.title
                ? "bg-shop_dark_green text-white"
                : "bg-muted text-muted-foreground hover:bg-shop_dark_green/10 hover:text-foreground"
            }`}
          >
            {item?.display}
          </button>
        ))}
      </div>
      <Link
        href={"/shop"}
        className="text-sm font-medium text-shop_orange hover:text-shop_btn_dark_green transition-colors"
      >
        Ver tudo
      </Link>
    </div>
  );
};

export default HomeTabBar;
