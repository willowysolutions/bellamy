// src/components/ProvidersLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import { CartWishlistProvider } from "@/context/cartContext";
import { ConfigurableProductProvider } from "@/context/ConfigurableProductContext";
import { PublicThemeLock } from "./public-theme-lock";

export default function ProvidersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const noHeaderRoutes = ["/login", "/sign-up", "/dashboard-login"];
  const hideHeader =
    noHeaderRoutes.includes(pathname) || pathname.startsWith("/admin");

  return (
    <CartWishlistProvider>
      <ConfigurableProductProvider>
      {!hideHeader && <Header />}
      {!isAdmin && <PublicThemeLock />}
        {children}
      </ConfigurableProductProvider>
    </CartWishlistProvider>
  );
}