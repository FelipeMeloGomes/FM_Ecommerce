"use client";
import { AlignLeft } from "lucide-react";
import { useState } from "react";
import SideMenu from "./SideMenu";

interface MobileMenuProps {
  user?: boolean;
  isAdmin: boolean;
  ordersCount?: number;
}

const MobileMenu = ({ user, isAdmin, ordersCount = 0 }: MobileMenuProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="p-2 hover:bg-muted rounded-lg transition-colors"
      >
        <AlignLeft className="w-6 h-6" />
      </button>
      <SideMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isLoggedIn={user}
        isAdmin={isAdmin}
        ordersCount={ordersCount}
      />
    </>
  );
};

export default MobileMenu;
