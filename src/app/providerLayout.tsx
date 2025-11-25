// src/components/ProvidersLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import { CartWishlistProvider } from "@/context/cartContext";
import { ConfigurableProductProvider } from "@/context/ConfigurableProductContext";

export default function ProvidersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const noHeaderRoutes = ["/login", "/sign-up", "/dashboard-login"];
  const hideHeader =
    noHeaderRoutes.includes(pathname) || pathname.startsWith("/admin");

  return (
    <CartWishlistProvider>
      <ConfigurableProductProvider>
      {!hideHeader && <Header />}
        {children}
      </ConfigurableProductProvider>
    </CartWishlistProvider>
  );
}