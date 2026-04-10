"use client";

import { format } from "date-fns";
import {
  Heart,
  Home,
  LayoutGrid,
  MapPin,
  MessageCircleQuestion,
  Moon,
  Package,
  Plus,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Sun,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart, useOutsideClick } from "@/hooks";
import Logo from "./Logo";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  ordersCount?: number;
}

const SideMenu = ({
  isOpen,
  onClose,
  isLoggedIn,
  isAdmin,
  ordersCount = 0,
}: SideMenuProps) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { itemCount: cartItemsCount, favoriteProduct } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const menuItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/shop", label: "Loja", icon: ShoppingBag },
    { href: "/category/gadget", label: "Categorias", icon: LayoutGrid },
    { href: "/deal", label: "Promoções", icon: Package },
    {
      href: "/cart",
      label: "Carrinho",
      icon: ShoppingCart,
      badge: mounted && cartItemsCount > 0 ? cartItemsCount : undefined,
    },
    {
      href: "/wishlist",
      label: "Favoritos",
      icon: Heart,
      badge:
        mounted && favoriteProduct.length > 0
          ? favoriteProduct.length
          : undefined,
    },
  ];

  const accountItems = [
    {
      href: "/orders",
      label: "Meus Pedidos",
      icon: ShoppingBag,
      badge: mounted && ordersCount > 0 ? ordersCount : undefined,
    },
    { href: "/account/addresses", label: "Endereços", icon: MapPin },
  ];

  const adminItems = [
    { href: "/admin/products", label: "Produtos", icon: Plus },
    { href: "/admin/categories", label: "Categorias", icon: Plus },
    { href: "/admin/brands", label: "Marcas", icon: Plus },
    {
      href: "/admin/questions",
      label: "Perguntas",
      icon: MessageCircleQuestion,
    },
  ];

  const handleKeyDownClose = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClose();
      }
    },
    [onClose],
  );

  return (
    <>
      <button
        type="button"
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 cursor-default ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        onKeyDown={handleKeyDownClose}
        aria-label="Fechar menu"
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 h-screen w-80 max-w-[85vw] transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          ref={sidebarRef}
          className="flex h-full flex-col bg-background dark:bg-zinc-900"
        >
          <div className="flex items-center justify-between border-b border-border p-4">
            <Logo
              className="text-shop_dark_green dark:text-white"
              spanDesign="group-hover:text-shop_dark_green"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-9 w-9"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Accordion
              type="multiple"
              defaultValue={["navigation"]}
              className="w-full"
            >
              <AccordionItem value="navigation" className="border-border">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">
                  <span className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Navegação
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-2">
                  <nav className="space-y-1">
                    {menuItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-shop_dark_green text-white"
                              : "text-foreground hover:bg-muted dark:text-zinc-200"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="bg-shop_orange text-white text-xs px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </AccordionContent>
              </AccordionItem>

              {isLoggedIn && (
                <AccordionItem value="account" className="border-border">
                  <AccordionTrigger className="px-4 py-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Minha Conta
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-2">
                    <nav className="space-y-1">
                      {accountItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? "bg-shop_dark_green text-white"
                                : "text-foreground hover:bg-muted dark:text-zinc-200"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <item.icon className="w-4 h-4" />
                              {item.label}
                            </span>
                            {item.badge && (
                              <span className="bg-shop_orange text-white text-xs px-2 py-0.5 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </nav>
                  </AccordionContent>
                </AccordionItem>
              )}

              {isAdmin && (
                <AccordionItem value="admin" className="border-border">
                  <AccordionTrigger className="px-4 py-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">
                    <span className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Administração
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-2">
                    <nav className="space-y-1">
                      {adminItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? "bg-shop_dark_green text-white"
                                : "text-foreground hover:bg-muted dark:text-zinc-200"
                            }`}
                          >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </nav>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            <div className="p-4">
              <Separator className="my-2" />
              <Button
                variant="ghost"
                onClick={handleThemeToggle}
                className="w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted dark:text-zinc-200"
              >
                {mounted && theme === "dark" ? (
                  <>
                    <Sun className="w-4 h-4" />
                    Modo Claro
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    Modo Escuro
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="border-t border-border p-4">
            <p className="text-xs text-center text-muted-foreground">
              © {format(new Date(), "yyyy")} FMShop. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
