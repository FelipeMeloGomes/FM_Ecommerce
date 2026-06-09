"use client";
import { AlignLeft } from "lucide-react";
import { useCallback, useState } from "react";
import SideMenu from "./SideMenu";

interface MobileMenuProps {
  user?: boolean;
  isAdmin: boolean;
  ordersCount?: number;
}

const MobileMenu = ({ user, isAdmin, ordersCount = 0 }: MobileMenuProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={toggleSidebar}
        className="p-2 hover:bg-muted rounded-lg transition-colors"
        aria-label="Abrir menu"
      >
        <AlignLeft className="w-6 h-6" aria-hidden="true" />
      </button>
      <SideMenu
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        isLoggedIn={user}
        isAdmin={isAdmin}
        ordersCount={ordersCount}
      />
    </>
  );
};

export default MobileMenu;
